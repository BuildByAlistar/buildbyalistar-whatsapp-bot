app.post('/webhook', async (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));

  const message =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (message) {
    const from = message.from;

    await fetch(
      `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Hello 👋 Bot working!" }
        })
      }
    );
  }

  res.sendStatus(200);
});