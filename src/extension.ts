import * as vscode from "vscode";

import { loadModel } from "./utils/loadModel";
import { predict } from "./utils/predict";

loadModel();

export function activate(context: vscode.ExtensionContext) {
  let sendPrediction = false;
  const sendPredictionCommand = "maverick.sendPrediction";
  const sendPredictionCommandHandler = () => {
    const editor = vscode.window.activeTextEditor;
    if (!(editor && vscode.window.state.focused)) {
      return;
    }
    sendPrediction = true;

    // force call to inline suggestion
    vscode.commands.executeCommand("editor.action.inlineSuggest.trigger");
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      sendPredictionCommand,
      sendPredictionCommandHandler
    )
  );
  const provider: vscode.CompletionItemProvider = {
    // @ts-ignore
    provideInlineCompletionItems: async (
      document: any,
      position: any,
      context: any,
      token: any
    ) => {
      let items: any[] = [];
      let rs;

      // Trigger model prediction on given line with document text as context.
      if (sendPrediction) {
        try {
          sendPrediction = false;
          rs = await predict(document, position);
          items = rs.map((item: any) => {
            return {
              text: `${item}`,
              insertText: `${item}`,
              range: new vscode.Range(
                position.translate(0, item.length),
                position
              ),
            };
          });
        } catch (err: any) {
          vscode.window.showErrorMessage(err.toString());
        }
      }
      return { items };
    },
  };

  // @ts-ignore
  vscode.languages.registerInlineCompletionItemProvider(
    { pattern: "**" },
    provider
  );
}
