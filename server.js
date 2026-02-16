const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');

// Auth Hack: Create the key file from your Render Environment Variable
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const keyPath = '/tmp/gcp-key.json';
    fs.writeFileSync(keyPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
}

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID, 
  location: 'us-central1' 
});

const model = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Update your main chat function to use this:
async function getAIResponse(userMessage) {
  const result = await model.generateContent(userMessage);
  return result.response.candidates[0].content.parts[0].text;
}
