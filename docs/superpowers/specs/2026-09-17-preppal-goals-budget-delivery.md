# PrepPal — Health goals, allergies, budget, delivery

Feature addendum. Date: 2026-09-17. Applies to both the web app (`src/`) and the iOS app (`ios/`). Everything here must behave identically on both platforms; the shared contract is the data below. Copy is sentence case, same wording on both.

## Why

The pitch promises four things: save time (cook, pack, and deliver), meet health goals (cook to your needs, diet, allergies), save money (build to a budget), have options. The app already covers options, pickup, macros, and plan discounts. This addendum adds delivery, allergies, a health goal target, and a per-meal budget.

## 1. Data contract

### Allergens on ingredients

```
Allergen = "dairy" | "gluten" | "nuts" | "soy" | "eggs" | "fish"
Ingredient gets: allergens: Allergen[]   (empty for most)
```

Assignment, identical in `src/data/menu.ts` and `ios/Andrews/Model/Menu.swift`:

| Ingredient id | allergens |
|---|---|
| pasta | gluten |
| tofu | soy |
| eggs | eggs |
| salmon | fish |
| cheese | dairy |
| sour-cream | dairy |
| feta | dairy |
| chipotle-crema | dairy |
| buffalo | dairy |
| teriyaki | soy, gluten |
| ranch | dairy, eggs |
| pesto | dairy, nuts |
| protein-shake | dairy |
| cookie | gluten, dairy, eggs |
| everything else | none |

### Preferences

```
Goal = "muscle" | "lose" | "maintain"
Preferences {
  vegetarian: boolean
  highProtein: boolean
  glutenFree: boolean
  allergies: Allergen[]        // new, default []
  goal: Goal | null            // new, default null
  budget: number | null        // new, dollars per meal, default null
}
```

Stored preferences written before this change lack the three new fields. The validator accepts a missing new field and fills its default. Any field that is present with the wrong type still throws, as before.

### Goal targets per meal

| Goal | Calories | Protein |
|---|---|---|
| muscle | 700, on target within ±15% | at least 45 g |
| lose | at most 500 | at least 35 g |
| maintain | 600, on target within ±15% | at least 30 g |

`goalStatus(goal, macros)` returns `{ onTarget: boolean, message: string }`. On target: "On target". Otherwise the message names the worst miss first, protein before calories: "12g protein short", "120 cal over", "80 cal under". Only one message is shown.

### Orders and delivery

```
Fulfillment = "pickup" | "delivery"
Order gets:
  fulfillment: Fulfillment     // new
  address: string | null       // new, delivery only
  deliveryFee: number          // new, 2.99 for delivery, 0 for pickup
  location stays as is; for delivery it holds the default location and is not shown
Totals gets: delivery: number
orderTotals(items, plan, promo, deliveryFee = 0):
  discount = subtotal × (planRate + promoRate)
  tax = 7% of (subtotal − discount)
  total = subtotal − discount + tax + deliveryFee   // fee is not taxed
```

`DELIVERY_FEE = 2.99`. Existing stored orders without the new fields are read as pickup with fee 0.

### Budget helpers

`budgetStatus(budget, itemPrice)` returns `{ over: boolean, remaining: number }` where remaining is `budget − itemPrice` (negative when over).

## 2. Account screen

New sections between "Dietary preferences" and "Demo", in this order:

- **Health goal.** Four choices as a segmented control or radio list: None, Build muscle, Lose weight, Maintain. Under it one line describing the chosen target, for example "About 700 cal and 45g+ protein per meal". None shows "No target set."
- **Allergies.** Six toggles: Dairy, Gluten, Nuts, Soy, Eggs, Fish. Caption: "We'll grey out anything that contains these."
- **Budget per meal.** A stepper from $6.00 to $20.00 in $0.50 steps with a "No budget" option (web: a range input plus a checkbox; iOS: a `Stepper` plus a toggle). Shows "$10.00 per meal" or "No budget".

## 3. Builder

- **Allergies.** Any pill whose ingredient contains a selected allergen is disabled and shows a small caption under its name: "Contains dairy" (list all that apply, comma separated). Disabled pills cannot be selected. When a preset is opened and some of its ingredients conflict, those ingredients are removed from the initial selection and a cardinal-tinted banner above the sections reads "We removed cheese and ranch. They contain dairy." naming the removed ingredients and allergens.
- **Goal.** When a goal is set, the macro line gains the status: "805 cal · 59g protein · On target" in veg green, or "805 cal · 59g protein · 12g protein short" in cardinal. Updates live.
- **Budget.** When a budget is set, the sticky ticket bar shows a second line under the price: "Budget $10.00 · $2.25 left" in ink-soft, or "$1.50 over budget" in cardinal when over. The add button stays enabled either way; the budget is guidance, not a block.

## 4. Order tab

- When a budget is set, a filter chip "In budget" appears after "Under $10" and filters presets to `itemPrice ≤ budget`.
- When allergies are set, preset rows that contain a selected allergen show a small cardinal caption "Contains dairy" under the macros. They are not hidden.
- When a goal is set, preset rows show the goal status after the macros, same styling as the builder.

## 5. Checkout

- A segmented control at the top: Pickup, Delivery. Default Pickup.
- Delivery hides the "Pickup spot" row and shows a "Deliver to" text field (placeholder "Friley Hall, room 2310"). Place order is disabled until the address is non-empty. The day and time rows stay and are labeled "Delivery day" and "Delivery time".
- Ticket adds a "Delivery" line of $2.99 only when delivery is selected, placed after Tax and before Total.
- The order stores fulfillment, address, and fee. Totals come from `orderTotals` with the fee.

## 6. Confirmation

- Pickup orders are unchanged.
- Delivery orders show "Deliver to" with the address instead of "Pickup" with the location, a "Delivery $2.99" ticket line, and "Arrives at {time}" instead of "Ready at {time}" with no location note.

## 7. Tests

Unit tests on both platforms, written first:

- `goalStatus`: muscle with 805/59 is on target; lose with 805/59 is "305 cal over"; muscle with 600/30 is "15g protein short" (protein wins over the calorie miss); maintain with 690/30 is on target.
- `budgetStatus`: budget 10 with price 7.75 gives remaining 2.25 not over; price 11.50 gives remaining −1.50 over.
- `orderTotals` with delivery: ten 8.50 bowls, plan 10, `CYCLONE10`, fee 2.99 gives subtotal 85.00, discount 17.00, tax 4.76, delivery 2.99, total 75.75.
- Allergen data: `cookie` has gluten, dairy, eggs; `grilled-chicken` has none; every allergen value in the data is one of the six.
- Preferences migration: a stored object with only the three original booleans loads with `allergies: []`, `goal: null`, `budget: null`.
- iOS UI test: extend the walkthrough to set a $12 budget and the dairy allergy in Account before building, assert the builder shows "Contains dairy" on the Cheese pill and a "left" budget line, then choose Delivery at checkout with an address and assert the confirmation shows "Deliver to" and a total of the expected amount.

## 8. Out of scope

Real addresses or maps, delivery time estimates, per-day macro tracking, nutrition beyond calories and protein, allergen cross-contamination notices.
