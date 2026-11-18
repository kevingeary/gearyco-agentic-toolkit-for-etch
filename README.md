# Gearyco Agentic Toolkit for Etch

An agent workspace for building sites in [Etch](https://etchbuilder.io) with [Automatic.css](https://automaticcss.com) and AI coding tools (Cursor, Claude Code, Codex, Copilot and others). Agents read `AGENTS.md`, follow the linked docs in `agent-docs/`, and drive a live Etch tab through a shared kit of builders, upserts and audits.

> **Unofficial.** This toolkit is built on top of [`@digital-gravy/etch-connector`](https://www.npmjs.com/package/@digital-gravy/etch-connector). It is not the official Etch Connector and is not affiliated with Digital Gravy or Etch.

## Requirements

- An active Etch license (the connector needs one).
- Node.js 18 or later.
- [Automatic.css](https://automaticcss.com) if you use the ACSS docs. The rules assume ACSS is in use; edit the "How to tell which modules apply" section of `AGENTS.md` if it isn't.

## Layout

```text
AGENTS.md          entry point for agents: hard rules, conventions, doc index
agent-docs/        context modules (markup, CSS, ACSS, keyframes, copy/paste, helpers)
shared-helpers/
├── run.mjs        runner: joins kit + project prelude + task, checks syntax, runs eval
└── etch/          the shared kit: blocks.js, upsert.js, audit.js
projects/
└── example/       a starter project; your own sites live alongside it (git-ignored)
```

Everything in `projects/` except `example/` is ignored by git, so client work stays local.

## Quick start

Open the folder in your AI coding tool and tell it what you want to work on, e.g. "let's work on my site". The agent follows the getting-started routine in `AGENTS.md`. It uses the Etch MCP server first (`.cursor/mcp.json` registers `https://studio.etchbuilder.io/mcp`): it lists your Etch Studio projects, opens the right one in a headless builder, and sets up a project folder for a new site. If your tool has no MCP support, the server isn't connected, or the site isn't an Etch Studio project, it falls back to the connector: it starts it and asks you to connect your Etch tab.

On MCP, your only manual step may be signing in when the server first asks. On the connector, it's connecting the tab: in Etch, enable the AI Connector in Settings, then click the AI button in the builder's left sidebar.

### Running it by hand

```bash
npx @digital-gravy/etch-connector serve        # keep this running
npx @digital-gravy/etch-connector tabs         # lists connected tabs
cp -R projects/example projects/<your-site>    # then set "tab" in etch/etch.json
node shared-helpers/run.mjs <your-site> audit.js
```

Your tool needs to be able to run shell commands, and ideally keep a background process alive for `serve`. If it can't, start `serve` yourself in a terminal first.

See `agent-docs/etch-shared-helpers.md` for the runner options and the full kit reference.
