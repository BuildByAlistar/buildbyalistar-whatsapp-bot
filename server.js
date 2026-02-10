const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// ✅ Verify webhook (Meta calls this once when you click "Verify and save")
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// ✅ Receive messages (Meta sends message events here)
app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Incoming:", JSON.stringify(req.body, null, 2));

    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      // Not a message event (could be status update etc.)
      return res.sendStatus(200);
    }

    const from = message.from; // user's WhatsApp number (wa_id)

    // ✅ Reply back
    const url = `https://graph.facebook.com/v20.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: from,
      text: { body: "Hello 👋 Bot working!" },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("✅ Sent reply:", data);

    return res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in webhook:", err);
    return res.sendStatus(200); // still return 200 so Meta doesn't keep retrying
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Bot running");
});

// ✅ Start server (LAST)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server started on port", PORT));