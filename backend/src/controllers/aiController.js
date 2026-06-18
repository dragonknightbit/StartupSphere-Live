const evaluateIdea = async (req, res) => {
  try {
    const { name, idea, problem, users, industry } = req.body;

    const prompt = `You are a highly strict startup evaluator. Given this startup data, return ONLY a valid JSON object with no markdown, no explanation. Format: { "innovation": number 0-100, "market": number 0-100, "feasibility": number 0-100, "verdict": "string", "suggestions": ["string", "string", "string"] }. CRITICAL RULE: You MUST analyze EVERY field: Name, Industry, Idea, Problem, and Target Users. If ANY single field contains keyboard smashes, nonsense, or "rubbish data" (like "dsvdsvds"), you MUST return 0 for all scores, "Invalid Data" for verdict, and "Please ensure all fields contain real, sensible data." for suggestions. Otherwise, for the verdict, return a 1-2 word classification like "Excellent", "Good", "Average", or "Poor". Startup Name: ${name}. Industry: ${industry}. Startup idea: ${idea}. Problem: ${problem}. Target users: ${users}.`;

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with status: ${response.status}`);
    }

    const result = await response.json();
    
    // Clean markdown if the model outputs ```json ... ```
    let cleanJson = result.response.replace(/```json/gi, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(cleanJson);
    
    res.status(200).json(evaluation);
  } catch (error) {
    console.error("Ollama Error:", error);
    res.status(500).json({ message: "Local AI Evaluation Failed: " + error.message });
  }
};

module.exports = { evaluateIdea };
