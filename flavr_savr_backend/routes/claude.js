require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Anthropic } = require("@anthropic-ai/sdk");
const User = require("../models/User");
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST - Send user ingredients and suggest associated ingredients based on user response
router.post("/", async (req, res) => {
  const { userId, ingredients } = req.body;
  console.log("connect to claude");

  try {
    // Fetch user dietary info
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Build dietary restrictions string
    const diet = user.diet.join(", ");
    const avoid = [...user.avoid, user.avoidOther].filter(Boolean).join(", ");
    const dietaryText = `User follows: ${diet || "no specific diet"}. Avoids: ${
      avoid || "nothing specific"
    }.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Here is a list of ingredients: ${ingredients.join(
            ", "
          )}. Suggest 15 UNIQUE common ingredients that pair well with list of ingredients. ${dietaryText} ONLY suggest items that fit these dietary restrictions. Exclude common staples like salt, pepper, olive oil, water, and sugar. Focus on the main ingredients that define the dish. Just provide the list ONLY no other text`,
        },
      ],
    });
    console.log(response);
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Claude request failed" });
  }
});

// POST - Send user ingredients and suggest associated ingredients based on user response
router.post("/refresh", async (req, res) => {
  const { ingredients, previousSuggestions } = req.body;
  console.log(
    "Refresh ingredients - previous suggestions:",
    previousSuggestions
  );

  try {
    const previousList =
      previousSuggestions && previousSuggestions.length > 0
        ? `\n\nDo NOT suggest any of these ingredients that were already suggested: ${previousSuggestions.join(
            ", "
          )}.`
        : "";

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Here is a list of ingredients: ${ingredients.join(
            ", "
          )}. Suggest 15 UNIQUE common ingredients that pair well with list of ingredients. ${dietaryText} ONLY suggest items that fit these dietary restrictions. Don't include the cooking essential ingredients.${previousList}`,
        },
      ],
    });
    console.log(response);
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Claude request failed" });
  }
});

// POST - Generate brief recipe ideas (titles & short description)
router.post("/recipe-ideas", async (req, res) => {
  const { ingredients } = req.body;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Given these ingredients: ${ingredients.join(
            ", "
          )}. Generate 3 recipe ideas using those ingredients. Please provide the output in **JSON format** exactly like this:
          {
            "title": "string",
            "prepTime": "string",
            "cookTime": "string",
            "totalTime": "string",
            "servings": "string",
            "dietaryCategories": "string"
          }

          Only return valid JSON, do not include explanations or other text.`,
        },
      ],
    });
    console.log(response);
    const recipeIdeas = JSON.parse(response.content[0].text);
    res.json({ reply: recipeIdeas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Claude recipe ideas generation failed" });
  }
});

// POST - Generate full recipe from selected idea
router.post("/full-recipe", async (req, res) => {
  console.log("POST /full-recipe received!");
  const { recipeIdea, ingredients } = req.body;

  let response;
  try {
    response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Create a detailed recipe for: "${recipeIdea}"
          Use ONLY these ingredients: ${ingredients.join(", ")}

          Output in STRICT JSON ONLY, exactly following this schema (no explanations, no extra text):

          \`\`\`json
          {
            "title": "string",
            "prepTime": "string (e.g., 15 mins)",
            "cookTime": "string (e.g., 20 mins)",
            "totalTime": "string (e.g., 35 mins)",
            "servings": "string (e.g., 4)",
            "ingredients": ["string"],
            "equipment": ["string"],
            "steps": ["string"],
            "tips": ["string"]
          }
          \`\`\`

          Make sure arrays have at least one element. Return valid JSON only.`,
        },
      ],
    });

    let recipeText = response.content[0].text.trim();
    console.log("Raw response:", recipeText);

    // Remove markdown code blocks if present
    recipeText = recipeText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // Try to extract JSON if it's wrapped in other text
    const jsonMatch = recipeText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      recipeText = jsonMatch[0];
    }

    const recipeJson = JSON.parse(recipeText);
    res.json({ reply: recipeJson });
  } catch (err) {
    console.error("Full recipe error:", err);
    if (response?.content?.[0]?.text) {
      console.error("Response was:", response.content[0].text);
    }
    res.status(500).json({
      error: "Claude full recipe generation failed",
      details: err.message,
    });
  }
});

module.exports = router;
