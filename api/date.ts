export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const day = searchParams.get("day");

  if (!month || !day) {
    return new Response(JSON.stringify({ error: "Missing month or day parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const API_URL = `https://events.historylabs.io/date?month=${month}&day=${day}`;

  try {
    const response = await fetch(API_URL, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch history events" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
