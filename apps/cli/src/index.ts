import { config as loadEnv } from "dotenv";
import { Command } from "commander";

import { runCreateGreetingCommand } from "./commands/create";
import { runHealthCommand } from "./commands/health";
import { runListGreetingsCommand } from "./commands/list";

loadEnv();
loadEnv({ path: "apps/cli/.env", override: false });

const program = new Command();

program.name("hello").description("Hello Monorepo CLI").version("0.0.0");

program
  .command("create")
  .description('Create a greeting, for example: hello create --name "Makon"')
  .requiredOption("--name <name>", "Name to greet")
  .option("--json", "Print JSON output")
  .action(async (options: { name: string; json?: boolean }) => {
    await runCreateGreetingCommand(options.name, options);
  });

program
  .command("list")
  .description("List greetings")
  .option("--json", "Print JSON output")
  .action(async (options: { json?: boolean }) => {
    await runListGreetingsCommand(options);
  });

program
  .command("health")
  .description("Check server health")
  .option("--json", "Print JSON output")
  .action(async (options: { json?: boolean }) => {
    await runHealthCommand(options);
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
