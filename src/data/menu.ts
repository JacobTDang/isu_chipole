import type { Allergen, Ingredient, IngredientGroup, MealType, MealTypeId, PresetMeal } from "./types";

export const ALLERGENS: Allergen[] = ["dairy", "gluten", "nuts", "soy", "eggs", "fish"];

export const MEAL_TYPES: MealType[] = [
  { id: "bowl", name: "Bowl", basePrice: 5, blurb: "Build a balanced bowl your way.", image: "/meals/bowl.jpg" },
  { id: "wrap", name: "Wrap", basePrice: 5.5, blurb: "A campus-ready meal wrapped up.", image: "/meals/wrap.jpg" },
  { id: "pasta", name: "Pasta", basePrice: 5.5, blurb: "Comforting pasta with your favorites.", image: "/meals/pasta.jpg" },
  { id: "salad", name: "Salad", basePrice: 5, blurb: "Fresh greens with plenty of substance.", image: "/meals/salad.jpg" },
  { id: "breakfast", name: "Breakfast", basePrice: 4.5, blurb: "A strong start for an early class.", image: "/meals/breakfast.jpg" },
];

export const INGREDIENTS: Ingredient[] = [
  { id: "white-rice", name: "White rice", group: "base", price: 0, calories: 205, protein: 4, tags: ["veg", "gf"], allergens: [] },
  { id: "brown-rice", name: "Brown rice", group: "base", price: 0, calories: 216, protein: 5, tags: ["veg", "gf"], allergens: [] },
  { id: "cilantro-lime-rice", name: "Cilantro-lime rice", group: "base", price: 0, calories: 210, protein: 4, tags: ["veg", "gf"], allergens: [] },
  { id: "pasta", name: "Pasta", group: "base", price: 0, calories: 220, protein: 8, tags: ["veg"], allergens: ["gluten"] },
  { id: "mixed-greens", name: "Mixed greens", group: "base", price: 0, calories: 15, protein: 1, tags: ["veg", "gf"], allergens: [] },
  { id: "quinoa", name: "Quinoa", group: "base", price: 1, calories: 222, protein: 8, tags: ["veg", "gf"], allergens: [] },
  { id: "sweet-potato", name: "Sweet potato", group: "base", price: 0.75, calories: 180, protein: 4, tags: ["veg", "gf"], allergens: [] },
  { id: "grilled-chicken", name: "Grilled chicken", group: "protein", price: 3.5, calories: 185, protein: 35, tags: ["gf"], allergens: [] },
  { id: "steak", name: "Steak", group: "protein", price: 4.5, calories: 240, protein: 35, tags: ["gf"], allergens: [] },
  { id: "salmon", name: "Salmon", group: "protein", price: 5.5, calories: 235, protein: 25, tags: ["gf"], allergens: ["fish"] },
  { id: "ground-turkey", name: "Ground turkey", group: "protein", price: 3, calories: 240, protein: 31, tags: ["gf"], allergens: [] },
  { id: "tofu", name: "Tofu", group: "protein", price: 2.5, calories: 163, protein: 20, tags: ["veg", "gf"], allergens: ["soy"] },
  { id: "eggs", name: "Eggs", group: "protein", price: 2, calories: 143, protein: 13, tags: ["veg", "gf"], allergens: ["eggs"] },
  { id: "no-protein", name: "No protein", group: "protein", price: 0, calories: 0, protein: 0, tags: ["veg", "gf"], allergens: [] },
  { id: "broccoli", name: "Broccoli", group: "veggies", price: 0, calories: 27, protein: 2, tags: ["veg", "gf"], allergens: [] },
  { id: "bell-peppers", name: "Bell peppers", group: "veggies", price: 0, calories: 20, protein: 1, tags: ["veg", "gf"], allergens: [] },
  { id: "corn", name: "Corn", group: "veggies", price: 0, calories: 70, protein: 3, tags: ["veg", "gf"], allergens: [] },
  { id: "black-beans", name: "Black beans", group: "veggies", price: 0, calories: 110, protein: 7, tags: ["veg", "gf"], allergens: [] },
  { id: "spinach", name: "Spinach", group: "veggies", price: 0, calories: 21, protein: 3, tags: ["veg", "gf"], allergens: [] },
  { id: "cucumber", name: "Cucumber", group: "veggies", price: 0, calories: 8, protein: 0, tags: ["veg", "gf"], allergens: [] },
  { id: "cherry-tomatoes", name: "Cherry tomatoes", group: "veggies", price: 0, calories: 13, protein: 1, tags: ["veg", "gf"], allergens: [] },
  { id: "red-onion", name: "Red onion", group: "veggies", price: 0, calories: 32, protein: 1, tags: ["veg", "gf"], allergens: [] },
  { id: "pico", name: "Pico", group: "toppings", price: 0, calories: 5, protein: 0, tags: ["veg", "gf"], allergens: [] },
  { id: "corn-salsa", name: "Corn salsa", group: "toppings", price: 0, calories: 40, protein: 2, tags: ["veg", "gf"], allergens: [] },
  { id: "pickled-jalapenos", name: "Pickled jalapeños", group: "toppings", price: 0, calories: 3, protein: 0, tags: ["veg", "gf", "spicy"], allergens: [] },
  { id: "cheese", name: "Cheese", group: "toppings", price: 0.5, calories: 110, protein: 7, tags: ["veg", "gf"], allergens: ["dairy"] },
  { id: "sour-cream", name: "Sour cream", group: "toppings", price: 0.5, calories: 60, protein: 1, tags: ["veg", "gf"], allergens: ["dairy"] },
  { id: "feta", name: "Feta", group: "toppings", price: 0.75, calories: 75, protein: 4, tags: ["veg", "gf"], allergens: ["dairy"] },
  { id: "guac", name: "Guac", group: "toppings", price: 1.75, calories: 90, protein: 1, tags: ["veg", "gf"], allergens: [] },
  { id: "chipotle-crema", name: "Chipotle crema", group: "sauce", price: 0, calories: 80, protein: 1, tags: ["veg", "gf", "spicy"], allergens: ["dairy"] },
  { id: "buffalo", name: "Buffalo", group: "sauce", price: 0, calories: 30, protein: 0, tags: ["veg", "gf", "spicy"], allergens: ["dairy"] },
  { id: "teriyaki", name: "Teriyaki", group: "sauce", price: 0, calories: 32, protein: 2, tags: ["veg"], allergens: ["soy", "gluten"] },
  { id: "ranch", name: "Ranch", group: "sauce", price: 0, calories: 130, protein: 1, tags: ["veg", "gf"], allergens: ["dairy", "eggs"] },
  { id: "hot-honey", name: "Hot honey", group: "sauce", price: 0, calories: 128, protein: 0, tags: ["veg", "gf", "spicy"], allergens: [] },
  { id: "none", name: "None", group: "sauce", price: 0, calories: 0, protein: 0, tags: ["veg", "gf"], allergens: [] },
  { id: "pesto", name: "Pesto", group: "sauce", price: 0.5, calories: 160, protein: 3, tags: ["veg", "gf"], allergens: ["dairy", "nuts"] },
  { id: "double-protein", name: "Double protein", group: "extras", price: 3, calories: 185, protein: 35, tags: ["gf"], allergens: [] },
  { id: "extra-base", name: "Extra base", group: "extras", price: 1, calories: 205, protein: 4, tags: ["veg"], allergens: [] },
  { id: "protein-shake", name: "Protein shake", group: "extras", price: 3.5, calories: 270, protein: 34, tags: ["veg", "gf"], allergens: ["dairy"] },
  { id: "cookie", name: "Cookie", group: "extras", price: 1.5, calories: 380, protein: 4, tags: ["veg"], allergens: ["gluten", "dairy", "eggs"] },
];

export const PRESETS: PresetMeal[] = [
  { id: "cyclone-bowl", name: "Cyclone Bowl", mealType: "bowl", blurb: "Chicken, beans, corn, and Cyclone spirit.", image: "/meals/cyclone-bowl.jpg", ingredientIds: ["cilantro-lime-rice", "grilled-chicken", "black-beans", "corn", "corn-salsa", "cheese", "chipotle-crema"], tags: ["high-protein"] },
  { id: "campanile-pesto-pasta", name: "Campanile Pesto Pasta", mealType: "pasta", blurb: "Pesto chicken pasta with bright vegetables.", image: "/meals/campanile-pesto-pasta.jpg", ingredientIds: ["pasta", "grilled-chicken", "cherry-tomatoes", "spinach", "feta", "pesto"], tags: ["high-protein"] },
  { id: "jack-trice-steak-bowl", name: "Jack Trice Steak Bowl", mealType: "bowl", blurb: "A bold steak bowl with hot honey.", image: "/meals/jack-trice-steak-bowl.jpg", ingredientIds: ["brown-rice", "steak", "bell-peppers", "red-onion", "pico", "guac", "hot-honey"], tags: ["high-protein"] },
  { id: "lake-laverne-salmon", name: "Lake LaVerne Salmon", mealType: "bowl", blurb: "Salmon and quinoa with crisp vegetables.", image: "/meals/lake-laverne-salmon.jpg", ingredientIds: ["quinoa", "salmon", "broccoli", "cucumber", "feta", "ranch"], tags: ["high-protein"] },
  { id: "veg-out-wrap", name: "Veg Out Wrap", mealType: "wrap", blurb: "A colorful tofu wrap loaded with vegetables.", image: "/meals/veg-out-wrap.jpg", ingredientIds: ["mixed-greens", "tofu", "bell-peppers", "corn", "black-beans", "pico", "chipotle-crema"], tags: ["veg"] },
  { id: "hilton-magic-teriyaki", name: "Hilton Magic Teriyaki", mealType: "bowl", blurb: "Teriyaki chicken and roasted vegetables.", image: "/meals/hilton-magic-teriyaki.jpg", ingredientIds: ["white-rice", "grilled-chicken", "broccoli", "bell-peppers", "teriyaki"], tags: ["high-protein"] },
  { id: "sunrise-breakfast-bowl", name: "Sunrise Breakfast Bowl", mealType: "breakfast", blurb: "Eggs and sweet potato for an early start.", image: "/meals/sunrise-breakfast-bowl.jpg", ingredientIds: ["sweet-potato", "eggs", "spinach", "cherry-tomatoes", "cheese", "hot-honey"], tags: ["veg"] },
  { id: "buffalo-chicken-mac", name: "Buffalo Chicken Mac", mealType: "pasta", blurb: "Creamy, spicy, and packed with chicken.", image: "/meals/buffalo-chicken-mac.jpg", ingredientIds: ["pasta", "grilled-chicken", "corn", "cheese", "buffalo"], tags: ["high-protein"] },
];

export function mealType(id: MealTypeId): MealType {
  const value = MEAL_TYPES.find((item) => item.id === id);
  if (!value) throw new Error(`Unknown meal type: ${id}`);
  return value;
}

export function ingredient(id: string): Ingredient {
  const value = INGREDIENTS.find((item) => item.id === id);
  if (!value) throw new Error(`Unknown ingredient: ${id}`);
  return value;
}

export function preset(id: string): PresetMeal {
  const value = PRESETS.find((item) => item.id === id);
  if (!value) throw new Error(`Unknown preset: ${id}`);
  return value;
}

export function ingredientsInGroup(group: IngredientGroup, mealTypeId?: MealTypeId): Ingredient[] {
  const all = INGREDIENTS.filter((item) => item.group === group);
  if (group !== "base" || !mealTypeId) return all;
  if (mealTypeId === "pasta") {
    return all.filter((item) => item.id === "pasta");
  }
  return all.filter((item) => item.id !== "pasta");
}

