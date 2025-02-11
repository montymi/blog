import { createRequire as VPV_createRequire } from "node:module";
import { fileURLToPath as VPV_fileURLToPath } from "node:url";
import { dirname as VPV_dirname } from "node:path";
const require = VPV_createRequire(import.meta.url);
const __filename = VPV_fileURLToPath(import.meta.url);
const __dirname = VPV_dirname(__filename);


// _api/date.ts
async function handler(req, res) {
  const { month, day } = req.query;
  if (!month || !day) {
    return res.status(400).json({ error: "Missing month or day parameters" });
  }
  const API_URL = `https://events.historylabs.io/date?month=${month}&day=${day}`;
  try {
    const response = await fetch(API_URL, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch history events" });
  }
}
export {
  handler as default
};
