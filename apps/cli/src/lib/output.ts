export const writeOutput = (payload: unknown, asJson: boolean): void => {
  if (asJson) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (typeof payload === "string") {
    console.log(payload);
    return;
  }

  console.log(JSON.stringify(payload, null, 2));
};
