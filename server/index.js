import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing ❌ GEMINI_API_KEY in .env file");
} else {
  console.log("Gemini API Key: Loaded ✅");
}

app.post("/api/crop-advice", async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Server is missing API key" });
  }

  try {
    const { prompt } = req.body;

    // Updated to use the recommended gemini-2.5-flash-preview-09-2025 model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      // Log more detail if the API request itself fails
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini API response:", data);
    res.json(data);
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to get crop advice" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
