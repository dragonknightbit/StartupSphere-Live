const fetch = require('node-fetch'); // or native fetch
const idea = "We are building an AI-powered drone network that scans crop fields to detect diseases and water stress early. This allows farmers to take localized actions, saving chemicals and optimizing their yields by up to 20%.";
const problem = "Traditional farming relies on manual visual inspection or blanket pesticide application, leading to significant crop loss from late disease detection and massive environmental waste.";
const users = "Medium to large-scale commercial farmers and ...";
const industry = "dsvdsvds";
const name = "dsv";

const prompt = `You are a highly strict startup evaluator. Given this startup data, return ONLY a valid JSON object with no markdown, no explanation. Format: { "innovation": number 0-100, "market": number 0-100, "feasibility": number 0-100, "verdict": "string", "suggestions": ["string", "string", "string"] }. CRITICAL RULE: You MUST analyze EVERY field: Name, Industry, Idea, Problem, and Target Users. If ANY single field contains keyboard smashes, nonsense, or "rubbish data" (like "dsvdsvds"), you MUST return 0 for all scores, "Invalid Data" for verdict, and "Please ensure all fields contain real, sensible data." for suggestions. Otherwise, for the verdict, return a 1-2 word classification like "Excellent", "Good", "Average", or "Poor". Startup Name: ${name}. Industry: ${industry}. Startup idea: ${idea}. Problem: ${problem}. Target users: ${users}.`;

async function test() {
  console.log("Sending request to Ollama...");
  const start = Date.now();
  const response = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:1b',
      prompt: prompt,
      stream: false,
      format: 'json'
    })
  });
  const data = await response.json();
  console.log("Time taken:", Date.now() - start, "ms");
  console.log(data.response);
}
test().catch(console.error);
