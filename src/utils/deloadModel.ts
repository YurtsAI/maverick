import { exec } from "child_process";

import { getConfig } from "../config";
import { checkServer } from "./checkServer";

export async function deloadModel() {
  const config = getConfig();
  const port = config.settings.port;
  let isMaverickOnPort = false;
  try {
    const serverResponse = await checkServer(port);
    isMaverickOnPort =
      serverResponse ===
      "Maverick loaded properly. Use POST methods to retrieve predictions.";
  } catch (err: any) {
    console.error(err);
  }
  // Kill the model if it exists.
  if (isMaverickOnPort) {
    exec(`kill $(lsof -t -i:${port})`);
  }
}
