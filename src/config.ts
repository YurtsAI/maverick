import * as vscode from "vscode";

type IConfig = {
  settings: {
    port: number;
    maxTokensToGenerate: number;
    numLinesForContext: number;
  };
};

export function getConfig() {
  const config = vscode.workspace.getConfiguration("maverick");

  return {
    settings: {
      port: config.settings.port,
      maxTokensToGenerate: config.settings.maxTokensToGenerate,
      numLinesForContext: config.settings.numLinesForContext,
    },
  } as IConfig;
}
