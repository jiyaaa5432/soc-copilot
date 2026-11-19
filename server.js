const path = require("path");
const Database = require("better-sqlite3");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

// Read-only: the server can look at alerts but can never change them.
const db = new Database(path.join(__dirname, "alerts.db"), {
  readonly: true,
  fileMustExist: true,
});

const server = new McpServer({ name: "soc-copilot", version: "1.0.0" });

const asText = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

// Tool 1: search and filter alerts
server.tool(
  "search_alerts",
  "Search security alerts by keyword and/or severity. Returns the newest matches first.",
  {
    keyword: z.string().max(100).optional().describe("Word to look for in the rule, IP or description"),
    severity: z.enum(["low", "medium", "high", "critical"]).optional(),
    limit: z.number().int().min(1).max(50).default(10),
  },
  async ({ keyword, severity, limit }) => {
    let sql = "SELECT * FROM alerts WHERE 1=1";
    const params = [];
    if (severity) {
      sql += " AND severity = ?";
      params.push(severity);
    }
    if (keyword) {
      sql += " AND (rule LIKE ? OR source_ip LIKE ? OR description LIKE ?)";
      const like = `%${keyword}%`;
      params.push(like, like, like);
    }
    sql += " ORDER BY timestamp DESC LIMIT ?";
    params.push(limit);
    return asText(db.prepare(sql).all(...params));
  }
);

// Tool 2: get one alert by id
server.tool(
  "get_alert",
  "Get the full details of one alert by its id.",
  { id: z.number().int().positive() },
  async ({ id }) => {
    const row = db.prepare("SELECT * FROM alerts WHERE id = ?").get(id);
    return asText(row || { error: "No alert found with that id" });
  }
);

// Tool 3: count alerts by severity
server.tool(
  "alert_summary",
  "Count how many alerts there are at each severity level.",
  {},
  async () => {
    const rows = db
      .prepare("SELECT severity, COUNT(*) AS count FROM alerts GROUP BY severity")
      .all();
    return asText(rows);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SOC Copilot MCP server is running"); // errors channel, so it doesn't break the protocol
}

main();