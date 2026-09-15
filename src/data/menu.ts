import type { Ingredient, IngredientGroup, MealType, MealTypeId, PresetMeal } from "./types";

export const MEAL_TYPES: MealType[] = [
  { id: "bowl", name: "Bowl", basePrice: 5, blurb: "Build a balanced bowl your way.", image: "/meals/bowl.jpg" },
  { id: "wrap", name: "Wrap", basePrice: 5.5, blurb: "A campus-ready meal wrapped up.", image: "/meals/wrap.jpg" },
  { id: "pasta", name: "Pasta", basePrice: 5.5, blurb: "Comforting pasta with your favorites.", image: "/meals/pasta.jpg" },
  { id: "salad", name: "Salad", basePrice: 5, blurb: "Fresh greens with plenty of substance.", image: "/meals/salad.jpg" },
  { id: "breakfast", name: "Breakfast", basePrice: 4.5, blurb: "A strong start for an early class.", image: "/meals/breakfast.jpg" },
];

export const INGREDIENTS: Ingredient[] = [
  { id: "white-rice", name: "White rice", group: "base", price: 0, calories: 205, protein: 4, tags: ["veg", "gf"] },
  { id: "brown-rice", name: "Brown rice", group: "base", price: 0, calories: 216, protein: 5, tags: ["veg", "gf"] },
  { id: "cilantro-lime-rice", name: "Cilantro-lime rice", group: "base", price: 0, calories: 210, protein: 4, tags: ["veg", "gf"] },
  { id: "pasta", name: "Pasta", group: "base", price: 0, calories: 221, protein: 8, tags: ["veg"] },
  { id: "mixed-greens", name: "Mixed greens", group: "base", price: 0, calories: 20, protein: 2, tags: ["veg", "gf"] },
  { id: "quinoa", name: "Quinoa", group: "base", price: 1, calories: 222, protein: 8, tags: ["veg", "gf"] },
  { id: "sweet-potato", name: "Sweet potato", group: "base", price: 0.75, calories: 180, protein: 4, tags: ["veg", "gf"] },
  { id: "grilled-chicken", name: "Grilled chicken", group: "protein", price: 3.5, calories: 230, protein: 43, tags: ["gf"] },
  { id: "steak", name: "Steak", group: "protein", price: 4.5, calories: 250, protein: 38, tags: ["gf"] },
  { id: "salmon", name: "Salmon", group: "protein", price: 5.5, calories: 280, protein: 34, tags: ["gf"] },
  { id: "ground-turkey", name: "Ground turkey", group: "protein", price: 3, calories: 220, protein: 35, tags: ["gf"] },
  { id: "tofu", name: "Tofu", group: "protein", price: 2.5, calories: 170, protein: 18, tags: ["veg", "gf"] },
  { id: "eggs", name: "Eggs", group: "protein", price: 2, calories: 140, protein: 12, tags: ["veg", "gf"] },
  { id: "no-protein", name: "No protein", group: "protein", price: 0, calories: 0, protein: 0, tags: ["veg", "gf"] },
  { id: "broccoli", name: "Broccoli", group: "veggies", price: 0, calories: 31, protein: 3, tags: ["veg", "gf"] },
  { id: "bell-peppers", name: "Bell peppers", group: "veggies", price: 0, calories: 24, protein: 1, tags: ["veg", "gf"] },
  { id: "corn", name: "Corn", group: "veggies", price: 0, calories: 77, protein: 3, tags: ["veg", "gf"] },
  { id: "black-beans", name: "Black beans", group: "veggies", price: 0, calories: 114, protein: 8, tags: ["veg", "gf"] },
  { id: "spinach", name: "Spinach", group: "veggies", price: 0, calories: 14, protein: 2, tags: ["veg", "gf"] },
  { id: "cucumber", name: "Cucumber", group: "veggies", price: 0, calories: 16, protein: 1, tags: ["veg", "gf"] },
  { id: "cherry-tomatoes", name: "Cherry tomatoes", group: "veggies", price: 0, calories: 27, protein: 1, tags: ["veg", "gf"] },
  { id: "red-onion", name: "Red onion", group: "veggies", price: 0, calories: 23, protein: 1, tags: ["veg", "gf"] },
  { id: "pico", name: "Pico", group: "toppings", price: 0, calories: 20, protein: 1, tags: ["veg", "gf"] },
  { id: "corn-salsa", name: "Corn salsa", group: "toppings", price: 0, calories: 70, protein: 2, tags: ["veg", "gf"] },
  { id: "pickled-jalapenos", name: "Pickled jalapeños", group: "toppings", price: 0, calories: 10, protein: 0, tags: ["veg", "gf", "spicy"] },
  { id: "cheese", name: "Cheese", group: "toppings", price: 0.5, calories: 110, protein: 7, tags: ["veg", "gf"] },
  { id: "sour-cream", name: "Sour cream", group: "toppings", price: 0.5, calories: 90, protein: 1, tags: ["veg", "gf"] },
  { id: "feta", name: "Feta", group: "toppings", price: 0.75, calories: 75, protein: 4, tags: ["veg", "gf"] },
  { id: "guac", name: "Guac", group: "toppings", price: 1.75, calories: 150, protein: 2, tags: ["veg", "gf"] },
  { id: "chipotle-crema", name: "Chipotle crema", group: "sauce", price: 0, calories: 80, protein: 1, tags: ["veg", "gf", "spicy"] },
  { id: "buffalo", name: "Buffalo", group: "sauce", price: 0, calories: 25, protein: 0, tags: ["veg", "gf", "spicy"] },
  { id: "teriyaki", name: "Teriyaki", group: "sauce", price: 0, calories: 60, protein: 1, tags: ["veg"] },
  { id: "ranch", name: "Ranch", group: "sauce", price: 0, calories: 120, protein: 1, tags: ["veg", "gf"] },
  { id: "hot-honey", name: "Hot honey", group: "sauce", price: 0, calories: 60, protein: 0, tags: ["veg", "gf", "spicy"] },
  { id: "none", name: "None", group: "sauce", price: 0, calories: 0, protein: 0, tags: ["veg", "gf"] },
  { id: "pesto", name: "Pesto", group: "sauce", price: 0.5, calories: 110, protein: 2, tags: ["veg", "gf"] },
  { id: "double-protein", name: "Double protein", group: "extras", price: 3, calories: 220, protein: 35, tags: ["gf"] },
  { id: "extra-base", name: "Extra base", group: "extras", price: 1, calories: 200, protein: 4, tags: ["veg"] },
  { id: "protein-shake", name: "Protein shake", group: "extras", price: 3.5, calories: 220, protein: 30, tags: ["veg", "gf"] },
  { id: "cookie", name: "Cookie", group: "extras", price: 1.5, calories: 280, protein: 3, tags: ["veg"] },
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

export function ingredientsInGroup(group: IngredientGroup): Ingredient[] {
  return INGREDIENTS.filter((item) => item.group === group);
}
