export function parseRecipeText(recipeText) {
  const recipe = {
    title: "",
    servings: "",
    totalTime: "",
    ingredients: [],
    instructions: [],
    suggestions: [],
    tips: [],
    nutrition: "",
  };

  let section = "";
  const lines = recipeText.split("\n");
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (/^recipe title:/i.test(line)) {
      recipe.title = line.replace(/^recipe title:/i, "").trim();
    } else if (/^servings:/i.test(line)) {
      recipe.servings = line.replace(/^servings:/i, "").trim();
    } else if (/^total (preparation and )?cooking time:/i.test(line)) {
      recipe.totalTime = line.replace(/^total (preparation and )?cooking time:/i, "").trim();
    } else if (/^ingredients:/i.test(line)) {
      section = "ingredients";
    } else if (/^cooking instructions:/i.test(line) || /^instructions:/i.test(line)) {
      section = "instructions";
    } else if (/^serving suggestions:/i.test(line)) {
      section = "suggestions";
    } else if (/^chef's tips:/i.test(line) || /^tips:/i.test(line)) {
      section = "tips";
    } else if (/^nutritional note:/i.test(line)) {
      section = "nutrition";
    } else if (section === "ingredients" && line.startsWith("-")) {
      recipe.ingredients.push(line.slice(1).trim());
    } else if (section === "instructions" && /^\d+\./.test(line)) {
      recipe.instructions.push(line.replace(/^\d+\.\s*/, ""));
    } else if (section === "suggestions" && line.startsWith("-")) {
      recipe.suggestions.push(line.slice(1).trim());
    } else if (section === "tips" && line.startsWith("-")) {
      recipe.tips.push(line.slice(1).trim());
    } else if (section === "nutrition") {
      recipe.nutrition += (recipe.nutrition ? " " : "") + line;
    }
  }

  return recipe;
}