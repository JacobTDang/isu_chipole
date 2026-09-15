export type IngredientGroup = "base" | "protein" | "veggies" | "toppings" | "sauce" | "extras";
export type IngredientTag = "veg" | "gf" | "spicy";

export type Ingredient = {
  id: string;
  name: string;
  group: IngredientGroup;
  price: number;
  calories: number;
  protein: number;
  tags: IngredientTag[];
};

export type MealTypeId = "bowl" | "wrap" | "pasta" | "salad" | "breakfast";

export type MealType = {
  id: MealTypeId;
  name: string;
  basePrice: number;
  blurb: string;
  image: string;
};

export type PresetMeal = {
  id: string;
  name: string;
  mealType: MealTypeId;
  blurb: string;
  image: string;
  ingredientIds: string[];
  tags: Array<"veg" | "high-protein">;
};

export type Selection = {
  mealType: MealTypeId;
  ingredientIds: string[];
  quantity: number;
  name?: string;
  presetId?: string;
};

export type BagItem = Selection & { id: string };
export type PlanSize = 5 | 7 | 10;
export type PickupLocation = { id: string; name: string; note: string };
export type User = { email: string; firstName: string };

export type Order = {
  id: string;
  items: BagItem[];
  plan: PlanSize;
  promo?: string;
  location: PickupLocation;
  day: "Sunday" | "Wednesday";
  time: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  placedAt: string;
};
