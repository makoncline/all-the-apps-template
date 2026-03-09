import { createHmac, timingSafeEqual } from "node:crypto";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const webhookSecret = process.env.DEPLOY_WEBHOOK_SECRET;
const composeFile = process.env.DEPLOY_COMPOSE_FILE ?? "/workspace/infra/docker/compose.prod.yml";
const workingDirectory = process.env.DEPLOY_WORKDIR ?? "/workspace";
const webImageTagVariable = process.env.WEB_IMAGE_TAG_VARIABLE ?? "WEB_IMAGE_TAG";
const serverImageTagVariable = process.env.SERVER_IMAGE_TAG_VARIABLE ?? "SERVER_IMAGE_TAG";
const deployHookImageTagVariable =
  process.env.DEPLOY_HOOK_IMAGE_TAG_VARIABLE ?? "DEPLOY_HOOK_IMAGE_TAG";

const parseSignature = (headerValue: string | undefined): Buffer | null => {
  if (!headerValue) {
    return null;
  }

  const normalized = headerValue.startsWith("sha256=") ? headerValue.slice("sha256=".length) : headerValue;
  return Buffer.from(normalized, "hex");
};

const verifySignature = (payload: string, signatureHeader: string | undefined): boolean => {
  if (!webhookSecret) {
    return false;
  }

  const providedSignature = parseSignature(signatureHeader);

  if (!providedSignature) {
    return false;
  }

  const expectedSignature = createHmac("sha256", webhookSecret).update(payload).digest();

  return (
    expectedSignature.length === providedSignature.length &&
    timingSafeEqual(expectedSignature, providedSignature)
  );
};

const sendJson = (
  response: Parameters<ReturnType<typeof createServer>["emit"]>[1],
  statusCode: number,
  payload: unknown
) => {
  response.writeHead(statusCode, {
    "content-type": "application/json"
  });
  response.end(JSON.stringify(payload));
};

const readBody = async (
  request: Parameters<Parameters<typeof createServer>[0]>[0]
): Promise<string> => {
  const chunks: Uint8Array[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
};

createServer(async (request, response) => {
  if (request.url === "/healthz" && request.method === "GET") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.url !== "/deploy" || request.method !== "POST") {
    sendJson(response, 404, {
      error: {
        code: "NOT_FOUND",
        message: "Route not found."
      }
    });
    return;
  }

  const rawPayload = await readBody(request);

  if (!verifySignature(rawPayload, request.headers["x-signature"] as string | undefined)) {
    sendJson(response, 401, {
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid webhook signature."
      }
    });
    return;
  }

  const payload = JSON.parse(rawPayload) as {
    sha: string;
    webImageTag?: string;
    serverImageTag?: string;
    deployHookImageTag?: string;
  };

  const webImageTag = payload.webImageTag ?? payload.sha;
  const serverImageTag = payload.serverImageTag ?? payload.sha;
  const deployHookImageTag = payload.deployHookImageTag ?? payload.sha;

  await execFileAsync(
    "docker",
    ["compose", "-f", composeFile, "pull", "web", "server", "deploy-hook"],
    {
      cwd: workingDirectory,
      env: {
        ...process.env,
        [webImageTagVariable]: webImageTag,
        [serverImageTagVariable]: serverImageTag,
        [deployHookImageTagVariable]: deployHookImageTag
      }
    }
  );

  await execFileAsync("pnpm", ["db:migrate"], {
    cwd: workingDirectory,
    env: {
      ...process.env,
      DATABASE_URL: "file:/data/app.db"
    }
  });

  await execFileAsync("docker", ["compose", "-f", composeFile, "up", "-d", "web", "server", "deploy-hook"], {
    cwd: workingDirectory,
    env: {
      ...process.env,
      [webImageTagVariable]: webImageTag,
      [serverImageTagVariable]: serverImageTag,
      [deployHookImageTagVariable]: deployHookImageTag
    }
  });

  sendJson(response, 200, {
    ok: true,
    deployedSha: payload.sha,
    webImageTag,
    serverImageTag,
    deployHookImageTag
  });
}).listen(Number(process.env.PORT ?? 8787));
