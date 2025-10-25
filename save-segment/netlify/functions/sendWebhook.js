export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    const response = await fetch(
      "https://webhook.site/49231acb-36d1-4d93-8678-38109caae1f1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error sending webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
