# SOC Copilot

An MCP (Model Context Protocol) server that exposes security alerts as
tools, so any MCP client can search and summarize them.

## Tools
- search_alerts: search by keyword and severity
- get_alert: get one alert by id
- alert_summary: count alerts by severity

## How it works
- Node.js server using the MCP SDK
- Read-only SQLite database, so alerts cannot be changed
- Every tool validates its input with zod

## Run it
1. npm install
2. node seed.js (creates alerts.db with 20 sample alerts)
3. npx @modelcontextprotocol/inspector node server.js

## Note
All alerts are sample data made up for this demo.