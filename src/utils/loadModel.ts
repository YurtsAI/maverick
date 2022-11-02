import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";
import fetch from "node-fetch";

import { getConfig } from "../config";

export async function loadModel() {
  const config = getConfig();
  const port = config.settings.port;
  vscode.window.showInformationMessage(
    `Maverick launching on port ${port}. Please wait a few minutes for Maverick to load and configure.`
  );

  // const modelExecutable = path.resolve(__dirname.slice(0, -4), "dist/app/app");
  const modelExecutable = path.resolve(__dirname.slice(0, -9), "dist/app/app");
  exec(modelExecutable, (error, stdout, stderror) =>
    console.log(error, stdout, stderror)
  );

  let isModelReady = false;
  vscode.window.showInformationMessage("Model downloading. Please wait.");

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  async function checkServer() {
    return await fetch(`http://localhost:${port}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.text());
  }

  // Allow model to load/deploy for up to 10 minutes
  // 240 polls * 5000 ms = 1200000 ms = 20 minutes
  const disposable = vscode.window.setStatusBarMessage(
    "Maverick loading... This message will auto-clear when it is ready."
  );
  let poll = 240;
  while (!isModelReady && poll > 0) {
    try {
      const serverResponse = await checkServer();
      isModelReady =
        serverResponse ===
        "Maverick loaded properly. Use POST methods to retrieve predictions.";
    } catch {
      poll -= 1;
      await sleep(5000);
    }
  }

  disposable.dispose();

  if (!isModelReady) {
    vscode.window.showErrorMessage("Failed to load Maverick.");
    throw new Error("Failed to load Maverick.");
  }

  vscode.window.showInformationMessage(
    "Maverick ready. Use CMD/CTRL + SHIFT + M to generate code."
  );
}
