const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;


// 🔥 THIS IS THE IMPORTANT PART
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    res.status(200).send(challenge); // MUST return challenge
  } else {
    res.sendStatus(403);
  }
});


// test route
app.get('/', (req, res) => {
  res.send('Bot running');
});


app.listen(process.env.PORT || 3000, () => {
  console.log('Server started');
});