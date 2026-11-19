# SOC Copilot

An MCP (Model Context Protocol) server that lets AI assistants like Claude
search and summarize security alerts. Status: in progress.

## What works now
- MCP server in Node.js with three tools: search_alerts, get_alert, alert_summary
- Read-only access to a SQLite alerts database
- Input validation on every tool with zod

## Run it
1. npm install
2. node seed.js  (creates alerts.db with 20 made-up sample alerts)
3. npx @modelcontextprotocol/inspector node server.js

## Note
All alerts are sample data made up for this demo.

## Next
- Express REST API and React dashboard
- Claude agent that triages alerts using these tools