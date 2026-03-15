// server/check_models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Check available models
    console.log("Checking available models for your API key...");
    // Note: The SDK doesn't always expose listModels directly easily, 
    // so we will try a simple generation to test the most likely ones.
    
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    for (const modelName of candidates) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
            await m.generateContent("Hello");
            console.log("✅ SUCCESS!");
        } catch (e) {
            console.log("❌ Failed (" + e.message.split('[')[0] + ")");
        }
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();