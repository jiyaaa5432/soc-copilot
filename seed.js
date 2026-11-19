const Database = require("better-sqlite3");
const db = new Database("alerts.db");

db.exec(`
  DROP TABLE IF EXISTS alerts;
  CREATE TABLE alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    severity TEXT NOT NULL,
    rule TEXT NOT NULL,
    source_ip TEXT NOT NULL,
    description TEXT NOT NULL
  );
`);

const alerts = [
  ["2026-11-19 09:02:11", "high", "Repeated failed logins", "203.0.113.45", "52 failed SSH logins for root in 3 minutes"],
  ["2026-11-19 09:05:40", "high", "Repeated failed logins", "203.0.113.45", "Failed logins continued, now trying admin and ubuntu accounts"],
  ["2026-11-19 09:31:02", "critical", "Unauthorized account activity", "203.0.113.45", "New user account 'svc_backup' created right after failed login burst"],
  ["2026-11-19 10:12:17", "medium", "Port scan", "198.51.100.23", "Connection attempts to 40 different ports in 10 seconds"],
  ["2026-11-19 10:14:55", "medium", "Port scan", "198.51.100.23", "Second scan sweep targeting ports 1-1024"],
  ["2026-11-19 10:48:09", "low", "Firewall block", "192.0.2.77", "Blocked inbound connection to port 23 (telnet)"],
  ["2026-11-19 11:03:30", "low", "Firewall block", "192.0.2.78", "Blocked inbound connection to port 3389 (RDP)"],
  ["2026-11-19 11:20:44", "high", "Privilege escalation", "10.0.0.15", "User 'dev1' added to sudoers group outside business hours"],
  ["2026-11-19 11:45:12", "medium", "Repeated failed logins", "192.0.2.150", "8 failed web admin logins in 2 minutes"],
  ["2026-11-19 12:10:03", "low", "Firewall block", "198.51.100.99", "Blocked outbound connection to known bad domain"],
  ["2026-11-19 12:32:21", "high", "Unauthorized account activity", "10.0.0.15", "Account 'dev1' logged in from two countries within 5 minutes"],
  ["2026-11-19 13:05:58", "medium", "Port scan", "203.0.113.200", "Slow scan across ports 20-25 and 80-90"],
  ["2026-11-19 13:40:19", "low", "Firewall block", "192.0.2.77", "Blocked inbound connection to port 23 (telnet) again"],
  ["2026-11-19 14:02:47", "critical", "Data exfiltration", "10.0.0.21", "Large outbound transfer of 2.4 GB to unknown external address"],
  ["2026-11-19 14:15:33", "high", "Unauthorized account activity", "10.0.0.21", "Database admin account used from a workstation never seen before"],
  ["2026-11-19 14:50:08", "medium", "Repeated failed logins", "203.0.113.45", "14 failed FTP logins in 1 minute"],
  ["2026-11-19 15:22:36", "low", "Firewall block", "192.0.2.210", "Blocked inbound connection to port 445 (SMB)"],
  ["2026-11-19 15:41:50", "medium", "Suspicious process", "10.0.0.33", "PowerShell launched with encoded command from Word"],
  ["2026-11-19 16:08:14", "high", "Suspicious process", "10.0.0.33", "Unknown process opened outbound connection every 60 seconds"],
  ["2026-11-19 16:30:27", "low", "Firewall block", "198.51.100.23", "Blocked inbound connection to port 22 from scanning address"],
];

const insert = db.prepare(
  "INSERT INTO alerts (timestamp, severity, rule, source_ip, description) VALUES (?, ?, ?, ?, ?)"
);
for (const a of alerts) insert.run(...a);

console.log("Added " + alerts.length + " sample alerts to alerts.db");
db.close();