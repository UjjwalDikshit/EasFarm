//Theory Initial Basic: https://chat.deepseek.com/a/chat/s/a9ee9d86-360d-48f3-a0d7-aaee790ace0c
//Theory Detailed Advanced : https://chat.deepseek.com/a/chat/s/1bfecf04-75e1-4f24-b5c7-1807175596f9

// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_KEY,
// });

// const SYSTEM_PROMPT = {
//   role: "system",
//   parts: [
//     {
//       text: `
// You are EasFarm AI.

// You must:
// - Answer clearly and practically
// - Use simple explanations
// - Avoid hallucination
// - Say "I don't know" if unsure
// - Help with agriculture and software topics
// `,
//     },
//   ],
// };

// let userHistories = {}; // initialized
// const MAX_CONTEXT = 10;

// const aiAgent = async (req, res) => {
//   try {
//     const { userName = "guest", problem } = req.body;

//     if (!problem) {
//       return res.status(400).json({ success: false, message: "problem is required" });
//     }

//     if (problem.length > 1000) {
//       return res.status(200).json({ success: true, finalText: "Your text should be less than 150 words" });
//     }

//     if (!userHistories[userName]) userHistories[userName] = [SYSTEM_PROMPT];

//     // Reset
//     if (["clear", "new", "reset"].includes(problem.toLowerCase())) {
//       userHistories[userName] = [SYSTEM_PROMPT];
//       return res.status(200).json({ success: true, finalText: "Chat history cleared for this session." });
//     }

//     userHistories[userName].push({ role: "user", parts: [{ text: problem }] });

//     // Trim context
//     if (userHistories[userName].length > MAX_CONTEXT * 2 + 1) {
//       userHistories[userName] = [
//         SYSTEM_PROMPT,
//         ...userHistories[userName].slice(-(MAX_CONTEXT * 2)),
//       ];
//     }

//     // ✅ Streaming
//     const stream = await ai.models.streamGenerateContent({
//       model: "models/gemini-2.5-flash",
//       contents: userHistories[userName],
//     });

//     let finalText = "";
//     for await (const chunk of stream) {
//       if (chunk.text) finalText += chunk.text;
//     }

//     // Save assistant reply
//     userHistories[userName].push({ role: "model", parts: [{ text: finalText }] });

//     return res.status(200).json({ success: true, finalText });
//   } catch (err) {
//     console.error("❌ Gemini Agent Error:", err);
//     return res.status(500).json({ success: false, message: "Error communicating with Gemini", error: err.message });
//   }
// };

// module.exports = aiAgent;

// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // In-memory memory (Redis in prod)
// const userMemory = {};
// const MAX_TURNS = 6;

// async function geminiAgent(req, res) {
//   try {
//     const { userName, problem } = req.body;

//     if (!problem) {
//       return res.status(400).json({
//         success: false,
//         error: "problem is required",
//       });
//     }

//     const userId = userName || "anonymous";

//     if (!userMemory[userId]) {
//       userMemory[userId] = [];
//     }

//     userMemory[userId].push({
//       role: "user",
//       parts: [{ text: problem }],
//     });

//     if (userMemory[userId].length > MAX_TURNS * 2) {
//       userMemory[userId] = userMemory[userId].slice(-MAX_TURNS * 2);
//     }

//     const result = await ai.models.generateContent({
//       model: "models/gemini-2.5-flash",
//       contents: userMemory[userId],
//     });

//     const reply = result.text;

//     userMemory[userId].push({
//       role: "model",
//       parts: [{ text: reply }],
//     });

//     return res.json({
//       success: true,
//       reply,
//     });
//   } catch (err) {
//     console.error("Gemini Agent Error:", err);
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// }

// module.exports = geminiAgent;

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ✅ System prompt
const SYSTEM_PROMPT = {
  role: "user", // must be 'system'
  parts: [
    {
      text: `
[System Instruction]
You are EasFarm AI.
You must:
- Answer clearly and practically
- Use simple explanations
- Avoid hallucination
- Say "I don't know" if unsure
- Help with agriculture and software topics
`,
    },
  ],
};

// In-memory memory (Redis in prod)
const userMemory = {};
const MAX_TURNS = 6;

async function geminiAgent(req, res) {
  try {
    const { userName, problem } = req.body;

    if (!problem) {
      return res.status(400).json({
        success: false,
        error: "problem is required",
      });
    }

    const userId = userName || "anonymous";

    // Initialize memory with system prompt
    if (!userMemory[userId]) {
      userMemory[userId] = [SYSTEM_PROMPT];
    }

    // Reset commands
    if (["clear", "new", "reset"].includes(problem.toLowerCase())) {
      userMemory[userId] = [SYSTEM_PROMPT];
      return res.json({
        success: true,
        reply: "Chat history cleared for this session.",
      });
    }

    // Add user message
    userMemory[userId].push({
      role: "user",
      parts: [{ text: problem }],
    });

    // Trim memory but keep system prompt
    if (userMemory[userId].length > MAX_TURNS * 2 + 1) {
      userMemory[userId] = [
        SYSTEM_PROMPT,
        ...userMemory[userId].slice(-(MAX_TURNS * 2)),
      ];
    }

    // Generate content
    const result = await ai.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: userMemory[userId],
    });
    
    const reply = result.text;

    // Save model reply
    userMemory[userId].push({
      role: "model",
      parts: [{ text: reply }],
    });

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("Gemini Agent Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = geminiAgent;




// If you want history to clear only when frontend tab closes,
// add navigator.sendBeacon('/api/endSession', {userName})
// in frontend to notify backend.

//Replace in-memory userHistories with a database or Redis with expiry.

// Example: store history with userId + sessionId.

// Auto-expire after X mins inactivity.
