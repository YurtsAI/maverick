import * as vscode from "vscode";

type IConfig = {
  settings: {
    sites: { [name: string]: boolean };
    maxResults: number;
    port: number;
    maxTokens: number;
  };
};

export function getConfig() {
  const config = vscode.workspace.getConfiguration("maverick");

  return {
    settings: {
      port: config.settings.port,
      maxTokens: config.settings.maxTokens,
    },
  } as IConfig;
}
