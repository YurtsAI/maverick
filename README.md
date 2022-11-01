# Maverick — AI Code suggestion for Python in VSCode

[![Maverick on Marketplace](https://vsmarketplacebadge.apphb.com/version/YurtsAI.maverick.svg)](https://marketplace.visualstudio.com/items?itemName=YurtsAI.maverick) [![Maverick on Marketplace](https://vsmarketplacebadge.apphb.com/installs-short/YurtsAI.maverick.svg)](https://marketplace.visualstudio.com/items?itemName=YurtsAI.maverick) [![Discord Chat](https://img.shields.io/discord/1032744296471855124.svg)](https://discord.gg/qgUprRUX)

Maverick is an code completion tool powered by AI. Built at Yurts, Maverick focuses on delivering the best code completion on your local machine without reaching out to any APIs or knowledge bases. Best of all? It's **free**.

![Demo Video](./demo.gif)

---

Table of contents:

- [Maverick — AI Code suggestion for Python in VSCode](#maverick--ai-code-suggestion-for-python-in-vscode)
  - [1. Install extension from the marketplace](#1-install-extension-from-the-marketplace)
    - [System Requirements](#system-requirements)
    - [Installation](#installation)
      - [Common reasons why you can't run Maverick:](#common-reasons-why-you-cant-run-maverick)
      - [Still not running?](#still-not-running)
  - [2. How to use](#2-how-to-use)
    - [Inline Completion using AI](#inline-completion-using-ai)
  - [3. Changelog](#3-changelog)

---

## 1. Install extension from the marketplace

### System Requirements

Currently, Maverick can be ran on `linux/arm64`, `linux/amd64`, and `windows/amd64` platforms, i.e., MacOS Intel 64-bit/MacOS M-Series/Windows 64-bit. This is because `PyTorch` (a dependency for the Maverick model) requires 64-bit precision to be ran.

### Installation

During installation, the Maverick packaged application as well as the code completion model is downloaded. Installation can take ~10 minutes and may vary based off internet speed and compute resources.

Have questions or issues with install? Join our [Discord server](https://discord.gg/qgUprRUX) or file a Github [Issue](https://github.com/YurtsAI/maverick/issues).

#### Common reasons why you can't run Maverick:

- When pressing `Run debugger`, it shows different target options (nodejs, edge, etc.). Your VSCode root directory might be incorrect. Make sure your root directory is the folder in which the `package.json` file is.
- Error message `module "node-fetch" not found...`. You need to run `npm install`.
- `canvas.node` was compiled against a different Node.js. [Try to remove canvas](https://github.com/hieunc229/copilot-clone/issues/9) (`npm uninstall canvas`)

#### Still not running?

- You haven't enabled the inline completion feature. To enable, set VSCode config `"editor.inlineSuggest.enabled": true`
- It might conflict with some other plugins. You might need to disable plugins to check

If none of the above works, open a thread or join our [Discord channel and have a chat](https://discord.gg/qgUprRUX).

## 2. How to use

### Inline Completion using AI

AI inline completion triggers on the **key command `cmd + shift + m` (macOS) or `ctrl + shift + m` (Windows/Linux)**.

For example, if the following was typed into your editor:

```python
class LinkedList:
```

Hitting `cmd + shift + m` or `ctrl + shift + m` would then send the prediction request to Maverick. (_You can tell a prediction is in progress if the Status Message in the bottom left of VSCode reads "Maverick generating code..."_) The prediction will then render as an inline suggestion!

## 3. Changelog

- Nov 02, 2022 - Publish the initial version

**_Love Maverick? Please drop us a star :) and expand the yurt._**
