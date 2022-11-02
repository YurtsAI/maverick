import * as vscode from "vscode";
import fetch from "node-fetch";

import { getConfig } from "../config";

export async function predict(
  document: vscode.TextDocument,
  position: vscode.Position
): Promise<string[]> {
  const disposable = vscode.window.setStatusBarMessage(
    "Maverick generating code..."
  );
  const config = getConfig();
  const numLinesForContext = config.settings.numLinesForContext;
  const maxTokensToGenerate = config.settings.maxTokensToGenerate;

  const diff = (s1: string, s2: string) => s1.split(s2).join("");

  const startContextLine =
    position.line >= numLinesForContext
      ? position.line - numLinesForContext
      : 0;
  const contextText = document.getText(
    new vscode.Range(new vscode.Position(startContextLine, 0), position)
  );
  const response = await fetch(`http://localhost:${config.settings.port}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: contextText,
      numTokens: maxTokensToGenerate,
    }),
  });
  const result = await response.json();
  disposable.dispose();
  if (
    response.status === 500 &&
    result.message.startsWith("Prediction in progress")
  ) {
    vscode.window.showErrorMessage(result.message);
    return [];
  }
  result.text.forEach((prediction: string, index: number, arr: string[]) => {
    arr[index] = diff(prediction, contextText);
  });
  return result.text;
}
