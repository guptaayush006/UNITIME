const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. ROBUST PDF LIBRARY LOADING ---
let pdfParseLib;
try {
    pdfParseLib = require('pdf-parse');
} catch (e) {
    console.warn("⚠️ Warning: 'pdf-parse' not found. PDF reading will be skipped.");
}
const pdfParse = (pdfParseLib && typeof pdfParseLib === 'function') 
    ? pdfParseLib 
    : (pdfParseLib && pdfParseLib.default) 
        ? pdfParseLib.default 
        : null;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - INCREASE LIMIT for images
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Memory Storage for File Uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- 2. INTELLIGENT AI ANALYSIS FUNCTION ---
async function analyzeWithAI(fileBuffer, mimetype, availableTime, studentData) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Missing GEMINI_API_KEY in .env file");
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // --- PREPARE PROMPT PARTS ---
    let promptParts = [];
    let fileContextMsg = "No file uploaded.";

    // A. HANDLE IMAGES (PNG, JPG, JPEG)
    if (fileBuffer && mimetype.startsWith('image/')) {
        console.log(`📸 Processing Image: ${mimetype} (${fileBuffer.length} bytes)`);
        
        const imagePart = {
            inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType: mimetype
            }
        };
        promptParts.push(imagePart);
        fileContextMsg = "Image of schedule provided.";
    } 
    // B. HANDLE PDF (Extract Text)
    else if (fileBuffer && mimetype === 'application/pdf') {
        try {
            if (!pdfParse) {
                fileContextMsg = "PDF content skipped (Library missing).";
            } else {
                const pdfData = await pdfParse(fileBuffer);
                const text = (pdfData.text || "").slice(0, 10000); 
                promptParts.push(text);
                console.log(`✅ Extracted ${text.length} characters from PDF.`);
                fileContextMsg = "PDF Text content provided.";
            }
        } catch (error) {
            console.warn("⚠️ PDF Read Error:", error.message);
            fileContextMsg = "Error reading PDF file.";
        }
    }
    // C. HANDLE TEXT FILES
    else if (fileBuffer) {
        const text = fileBuffer.toString('utf-8').slice(0, 10000);
        promptParts.push(text);
        fileContextMsg = "Text file content provided.";
    }

    // --- ADD INSTRUCTIONS TO PROMPT ---
    const textPrompt = `
        Act as an expert academic planner.
        
        CONTEXT:
        - Available Time: ${availableTime} minutes.
        - Student Data: ${JSON.stringify(studentData || {})}
        - File Status: ${fileContextMsg}
        
        TASK:
        Analyze the provided schedule/image and create a specific study session plan.
        
        OUTPUT FORMAT (Strict JSON, no markdown):
        { 
          "primaryTask": "Task Name", 
          "reason": "Why this is the priority", 
          "alternatives": [
            {"task": "Alt 1", "reason": "Why"},
            {"task": "Alt 2", "reason": "Why"}
          ] 
        }
    `;
    
    promptParts.push(textPrompt);

    // --- TRY MODELS (UPDATED LIST FOR RATE LIMITS) ---
    const candidates = [
        "gemini-2.0-flash-lite",  // 1. Try Lite (Fastest, usually separate quota)
        "gemini-2.5-flash",       // 2. Try Newest (Different quota pool)
        "gemini-flash-latest",    // 3. Try Standard Flash alias
        "gemini-pro-vision"       // 4. Fallback for images
    ];

    for (const modelName of candidates) {
        try {
            console.log(`🤖 Attempting AI Model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const result = await model.generateContent(promptParts);
            const response = await result.response;
            
            const cleanText = response.text().replace(/```json|```/g, '').trim();
            return JSON.parse(cleanText);

        } catch (error) {
            // Handle Rate Limits (429) specifically
            if (error.message.includes('429')) {
                console.warn(`⏳ Quota exceeded for ${modelName}. Switching to next model...`);
            }
            // Handle Not Found (404)
            else if (error.message.includes('404') || error.message.includes('not found')) {
                console.log(`🔹 Model ${modelName} not available, switching...`);
            } 
            else {
                console.warn(`❌ Error with ${modelName}:`, error.message.split('[')[0]);
            }
        }
    }
    throw new Error("All AI models failed. Please wait 60 seconds or check API Quota.");
}

// --- ROUTES ---

app.get('/', (req, res) => res.send("✅ UniTime Server is Running!"));

app.post('/api/analyze', upload.single('file'), async (req, res) => {
    try {
        console.log(`📥 Analyze Request: ${req.file ? req.file.mimetype : "No File"}`);
        
        const result = await analyzeWithAI(
            req.file ? req.file.buffer : null,
            req.file ? req.file.mimetype : null,
            req.body.availableTime || 60,
            req.body.studentData
        );
        
        console.log("✅ Analysis Successful");
        res.json(result);

    } catch (error) {
        console.error("🔥 Analysis Failed:", error.message);
        res.status(500).json({ 
            error: "Analysis Failed", 
            details: error.message 
        });
    }
});

// Chatbot Route
app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "No prompt provided" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use flash-lite for chat too to save quota
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }); 
        
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Chat Error:", error.message);
        res.status(500).json({ error: "Chat failed" });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});