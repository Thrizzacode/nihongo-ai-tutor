async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY is not defined in environment.");
    return;
  }
  try {
    console.log("Fetching models...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    const data = await response.json();
    if (data.models) {
      console.log(
        "Available Models:",
        JSON.stringify(
          data.models.map((m) => m.name),
          null,
          2,
        ),
      );
    } else {
      console.log("No models found:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
