# Andrew's — Meal prep app for Iowa State students

Version 1 design spec. Date: 2026-09-15.

## 1. What this is

A clickable, phone-shaped web prototype of **Andrew's**, a meal prep service for Iowa State University students. Its job is to look and behave like a shipped iOS food-ordering app so the founder can screenshot it for a pitch deck and click through it live. There is no backend. All menu data lives in one TypeScript file. Bag, orders, and login live in the browser's localStorage so the full order flow works end to end.

The user workflow is modeled on the Chipotle app: category tiles on Home, a single long-scrolling build page with option pills grouped by section, a sticky "Add to bag" bar with a live price, a Bag with editable rows, then a pickup-location-and-time checkout.

**Explicit exception to the global "no mock data in real code" rule:** the menu data file *is* the product. There is no other data source. Everything else in the global rules applies (TDD for logic, fail loud, no debug leftovers, ask before new dependencies).

## 2. Stack

- Next.js 15, App Router, TypeScript, `src/` directory.
- Tailwind CSS v4 with design tokens declared in `@theme` in `src/app/globals.css`.
- Fonts via `next/font/google`: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (ticket/utility).
- Icons: `lucide-react`, 1.5px stroke, 22px in the tab bar, 20px inline. **New dependency, approved in this spec.**
- Tests: Vitest. **New dev dependency, approved in this spec.**
- No other packages. If a worker thinks it needs one, it stops and asks.
- Deploys to Vercel as a static-ish Next app. No environment variables.

## 3. Visual identity

### Palette (Iowa State: cardinal, gold, cream)

| Token | Hex | Use |
|---|---|---|
| `cardinal` | `#C8102E` | Primary buttons, active tab, header blocks, selected pill border |
| `cardinal-deep` | `#8E0B21` | Pressed state, gradient end on header blocks |
| `gold` | `#F1BE48` | Prices, rewards bar fill, selected pill fill, badges |
| `cream` | `#FBF5E6` | Page background inside the phone |
| `card` | `#FFFDF8` | Cards, sheets, tab bar |
| `ink` | `#2B1114` | Primary text, a warm near-black with a red cast |
| `ink-soft` | `#7A5C60` | Secondary text, captions |
| `line` | `#EADFC8` | Hairlines, card borders |
| `veg` | `#5B7A3A` | Vegetarian tag only |

Outside the phone frame on desktop: `#EFE6D2`, a darker cream, so the phone reads as an object on a table.

### Type

- **Display: Bricolage Grotesque**, weight 800, letter-spacing -0.02em. Large titles (34px), meal names (22px), price on the sticky bar (24px). Used with restraint: never for body copy.
- **Body: Instrument Sans**, 400 and 600. 17px body, 15px secondary, 13px captions. `font-feature-settings: "tnum"` on anything numeric.
- **Ticket: JetBrains Mono**, 500. 13px. Used only inside the "kitchen ticket" surfaces described below.

### Signature element: the kitchen ticket

Every place the app shows a total is styled like the ticket a kitchen prints on the line. The sticky "Add to bag" bar, the Bag summary, the checkout total, and the order confirmation all share one component, `Ticket`: card background, monospace line items with dotted leaders between name and price, a perforated top edge made with a CSS radial-gradient mask, and a cardinal tear line. This is the one bold choice. Everything else stays quiet and iOS-native.

### Motion

- Pill select: scale 0.96 to 1.0 over 120ms, fill animates cream to gold.
- Running total: the number counts to the new value over 200ms.
- Bag tab badge: single bounce when an item is added.
- Confirmation screen: the ticket slides up 16px and fades in on mount.
- All motion disabled under `prefers-reduced-motion`.

## 4. Apple Human Interface Guidelines conventions

The app is rendered in the browser but must feel like a native iOS app.

- **Phone frame.** On viewports 768px and wider, the app renders inside a 390×844 frame with 48px corner radius, a 1px `line` border, and a home indicator bar at the bottom. Under 768px the frame disappears and the app fills the screen.
- **Safe areas.** 54px top padding inside the frame for the status bar area, 34px bottom for the home indicator. On real devices use `env(safe-area-inset-*)`.
- **Tap targets.** Nothing interactive is smaller than 44×44px.
- **Navigation.** Top-level screens use a large title (34px display) that sits below the status area. Pushed screens use a back chevron plus an inline 17px semibold title, centered.
- **Tab bar.** 49px tall plus bottom safe area, `card` background, top hairline, four tabs: Home, Order, Bag, Account. Active tab is cardinal, inactive is `ink-soft`. Bag shows a gold count badge.
- **Grouped lists.** Settings-style rows in Account and Checkout use inset grouped lists: 16px horizontal inset, 12px radius, hairline separators indented to align with text.
- **Sheets.** Plan picker, pickup location picker, and time slot picker open as bottom sheets with a grabber, dimmed backdrop, 16px top radius. Dismiss by tapping the backdrop or the Done button.
- **Segmented control.** Meal-type filter on the Order tab is an iOS-style segmented control.
- **Buttons.** Primary: full-width, 50px tall, cardinal fill, white 17px semibold text, 14px radius. Secondary: cream fill, cardinal text, `line` border.
- **Feedback.** Actions confirm with the same verb they were named with. "Add to bag" produces a toast "Added to bag." "Place order" leads to the confirmation. Toasts are 3 seconds, bottom-anchored above the tab bar.
- **Focus.** Visible keyboard focus ring in cardinal on every control.

## 5. Screens and flow

### 5.1 Login `/login`

No tab bar on this screen. Full-screen cream. The Iowa State logo (`public/isu-logo.png`) centered in the top third at 240px wide. Below it, "Andrew's" in display 34px and the line "Meal prep for Cyclones. Pick up on campus." Fields: ISU email, password. Primary button "Sign in". Secondary button "Continue with ISU Net-ID". Any non-empty email signs the user in. The first name is derived from the email prefix, capitalized; empty prefix falls back to "Cyclone". Signed-in state persists in localStorage. Every other route redirects to `/login` when signed out.

### 5.2 Home `/`

Large title "Hey, {firstName}". Under it, top to bottom:

1. **Rewards bar.** A card with "{points} pts", a gold progress bar toward the next tier, and the tier name. Tiers: 0 to 499 "Cyclone", 500 to 1499 "Cardinal", 1500 and up "Gold". Points equal the floor of dollars spent across placed orders.
2. **Your usual.** Horizontal row of the three most recent orders as compact cards with a "Reorder" button that puts the whole order back in the bag. If there are no orders, the row is replaced by a card "No orders yet. Your first week starts here." with a button "Build a bowl".
3. **Start an order.** Grid of five meal-type tiles, two per row, the fifth full width: Bowl, Wrap, Pasta, Salad, Breakfast. Each tile has the meal type's image, name, and "from ${basePrice}". Tapping goes to `/menu/{mealType}`.
4. **Preset meals.** Horizontal row of preset cards, each with image, name, price, calories, and protein grams. Tapping goes to `/meal/{presetId}`.

### 5.3 Order tab `/order`

Large title "Order". A segmented control across the top: All, Bowls, Wraps, Pasta, Salads, Breakfast. Below it, a vertical list of every preset meal filtered by the selected segment, plus one "Build your own {type}" card pinned to the top of each filtered list. Filter chips under the segmented control: High protein (30g or more), Vegetarian, Under $10.

### 5.4 Build page `/menu/[mealType]` and `/meal/[presetId]`

Both routes render the same `Builder` component. The preset route pre-fills the selections from the preset's ingredient list, so a student can tweak a preset instead of starting over. Inline title is the meal type name or the preset name.

Top: the meal's image, 200px tall, edge to edge.

Then one long scrolling page of sections in this order. Each section has a display heading, a one-line rule, and a wrap of option pills.

| Section | Rule | Options and price |
|---|---|---|
| Base | choose one, required | White rice, Brown rice, Cilantro-lime rice, Pasta, Mixed greens; Quinoa +$1.00; Sweet potato +$0.75 |
| Protein | choose one, required | Grilled chicken +$3.50; Steak +$4.50; Salmon +$5.50; Ground turkey +$3.00; Tofu +$2.50; Eggs +$2.00; No protein |
| Veggies | choose any | Broccoli, Bell peppers, Corn, Black beans, Spinach, Cucumber, Cherry tomatoes, Red onion (all included) |
| Toppings | choose any | Pico, Corn salsa, Pickled jalapeños (included); Cheese +$0.50; Sour cream +$0.50; Feta +$0.75; Guac +$1.75 |
| Sauce | choose one | Chipotle crema, Buffalo, Teriyaki, Ranch, Hot honey, None; Pesto +$0.50 |
| Extras | choose any | Double protein +$3.00; Extra base +$1.00; Protein shake +$3.50; Cookie +$1.50 |

Pills show the option name and, for upcharges, "+$1.75" in gold. Selected pills have a gold fill and cardinal border. Dietary tags: vegetarian options show a small `veg` dot.

Meal type base prices: Bowl $5.00, Wrap $5.50, Pasta $5.50, Salad $5.00, Breakfast $4.50. Item price is base price plus the sum of selected option prices.

Below the sections: a "Name this meal" text field, optional, and a quantity stepper from 1 to 10.

Sticky bottom `Ticket` bar showing the live total in display 24px and a primary button "Add to bag". If Base or Protein is missing, the button is disabled and the ticket reads "Choose a base and a protein". After adding: toast "Added to bag", navigate back to the previous screen.

A macro line under the image shows calories and protein grams summed from selected ingredients, updating live.

### 5.5 Bag `/bag`

Large title "Bag". Empty state: "Your bag is empty. Build a bowl or grab a preset." with a button "Start an order".

With items: each row shows the image thumbnail, the item name (custom name, preset name, or "Custom {type}"), a one-line summary of its selections, quantity stepper, unit price, and actions Edit and Duplicate. Edit reopens the Builder with that item's selections and saves back to the same row.

Below the rows, **Plan** card: "Meals this week" with three options in a bottom sheet: 5 meals, 7 meals, 10 meals. Discounts: 5 meals 0%, 7 meals 5%, 10 meals 10%. The card shows the current plan, the meals in the bag versus the plan size, and a line "Add {n} more to fill your plan" when short. The discount applies to the whole subtotal once the bag holds at least the plan's meal count.

Below the plan card, **Add-ons** row: Protein shake and Cookie as one-tap items.

Bottom `Ticket`: Subtotal, Plan discount (if any), Tax at 7%, Total. Primary button "Check out".

### 5.6 Checkout `/checkout`

Inline title "Checkout". Inset grouped list:

- **Pickup spot.** Row opens a sheet listing four campus locations: Memorial Union (Main Lounge entrance), State Gym (front desk), Parks Library (south entrance), Frederiksen Court (community center). Each has a one-line "how to find us" note.
- **Pickup day.** Segmented: Sunday, Wednesday.
- **Pickup time.** Row opens a sheet of 30-minute slots from 4:00 PM to 7:00 PM.
- **Payment.** Row showing "Visa ending 4242" with a chevron, plus a full-width black "Pay with Apple Pay" style button under the list. Both do the same thing.
- **Promo code.** Text field and Apply button. The code `CYCLONE10` takes 10% off the subtotal. Any other code shows the inline error "That code isn't valid." Only one promo at a time.

Bottom `Ticket` with the full breakdown and a primary button "Place order". Placing an order creates an Order record, empties the bag, adds points, and navigates to the confirmation.

### 5.7 Confirmation `/order/[orderId]`

No tab bar on this screen. Cream background, a large gold check mark in a cardinal circle, display title "See you {day}." Under it the `Ticket` with a big order number in the form `AND-{4 digits}`, pickup spot, day and time, the line items, and the total. A line "Ready at {time}" and a "Back to home" button.

### 5.8 Account `/account`

Large title "Account". Sections as inset grouped lists:

- **Rewards.** Points, tier, progress bar, and "{n} pts to {next tier}".
- **Order history.** Rows with order number, date, item count, total, and a "Reorder" button. Tapping a row goes to its confirmation page.
- **Saved meals.** Every named custom build, with an "Add to bag" button.
- **Dietary preferences.** Toggles: Vegetarian, High protein, Gluten free. These only pre-select the matching filter chips on the Order tab.
- **Demo.** A "Reset demo data" button that clears all Andrew's localStorage keys and returns to login. A "Sign out" button.

## 6. Data model

All in `src/data/menu.ts`. Types in `src/data/types.ts`.

```ts
type IngredientGroup = "base" | "protein" | "veggies" | "toppings" | "sauce" | "extras";

type Ingredient = {
  id: string;            // "grilled-chicken"
  name: string;
  group: IngredientGroup;
  price: number;         // 0 when included
  calories: number;
  protein: number;       // grams
  tags: Array<"veg" | "gf" | "spicy">;
};

type MealTypeId = "bowl" | "wrap" | "pasta" | "salad" | "breakfast";

type MealType = {
  id: MealTypeId;
  name: string;
  basePrice: number;
  blurb: string;
  image: string;         // "/meals/bowl.jpg"
};

type PresetMeal = {
  id: string;            // "cyclone-bowl"
  name: string;
  mealType: MealTypeId;
  blurb: string;
  image: string;
  ingredientIds: string[];
  tags: Array<"veg" | "high-protein">;
};

type Selection = {
  mealType: MealTypeId;
  ingredientIds: string[];
  quantity: number;
  name?: string;         // student-given name
  presetId?: string;     // set when it started from a preset
};

type BagItem = Selection & { id: string };

type PlanSize = 5 | 7 | 10;

type PickupLocation = { id: string; name: string; note: string };

type Order = {
  id: string;            // "AND-4821"
  items: BagItem[];
  plan: PlanSize;
  promo?: string;
  location: PickupLocation;
  day: "Sunday" | "Wednesday";
  time: string;          // "4:30 PM"
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  placedAt: string;      // ISO
};
```

Preset meals, eight of them. Prices are **derived** from their ingredients through the pricing function, never hard-coded, so the builder and the menu can't disagree.

| Preset | Type | Ingredients |
|---|---|---|
| Cyclone Bowl | bowl | cilantro-lime rice, grilled chicken, black beans, corn, corn salsa, cheese, chipotle crema |
| Campanile Pesto Pasta | pasta | pasta, grilled chicken, cherry tomatoes, spinach, feta, pesto |
| Jack Trice Steak Bowl | bowl | brown rice, steak, bell peppers, red onion, pico, guac, hot honey |
| Lake LaVerne Salmon | bowl | quinoa, salmon, broccoli, cucumber, feta, ranch |
| Veg Out Wrap | wrap | mixed greens, tofu, bell peppers, corn, black beans, pico, chipotle crema |
| Hilton Magic Teriyaki | bowl | white rice, grilled chicken, broccoli, bell peppers, teriyaki |
| Sunrise Breakfast Bowl | breakfast | sweet potato, eggs, spinach, cherry tomatoes, cheese, hot honey |
| Buffalo Chicken Mac | pasta | pasta, grilled chicken, corn, cheese, buffalo |

Calories and protein per ingredient are plausible, whole numbers. The worker fills them in.

### Images

`public/meals/{mealType}.jpg` for the five meal types and `public/meals/{presetId}.jpg` for the eight presets. The task-zero worker downloads free-to-use food photos from Pexels or Unsplash into those paths and verifies each file is a real JPEG over 20KB. `MealImage` renders the file, and if the image fails to load it renders a fallback tile: a cardinal-to-cardinal-deep gradient with the meal's first letter in display type. The founder swaps in real photos later by replacing files.

## 7. Logic

### Pricing, `src/lib/pricing.ts`

Pure functions, no React, fully unit tested first.

- `itemPrice(selection, menu)` = meal type base price + sum of selected ingredient prices, times quantity.
- `bagSubtotal(items, menu)` = sum of item prices.
- `mealCount(items)` = sum of quantities.
- `planDiscountRate(plan, mealCount)` = 0 when count is below plan size; else 0 for 5, 0.05 for 7, 0.10 for 10.
- `promoRate(code)` = 0.10 for `CYCLONE10`, else 0. Case-insensitive.
- `orderTotals(items, plan, promo, menu)` returns `{ subtotal, discount, tax, total }`. Discount = subtotal × (plan rate + promo rate). Tax = 7% of (subtotal − discount). All money rounded to cents at the end, never mid-calculation.
- `macros(selection, menu)` returns `{ calories, protein }`.

### Rewards, `src/lib/rewards.ts`

- `points(orders)` = floor of the sum of order totals.
- `tier(points)` returns `{ name, next, nextAt }` per the thresholds in 5.2.

### Storage, `src/lib/storage.ts`

One module that reads and writes the four keys `andrews.user`, `andrews.bag`, `andrews.orders`, `andrews.saved`. Every read validates shape with a hand-written type guard. If a value fails validation, the module **throws** an Error naming the key and the reason. It never silently resets. The "Reset demo data" button exists for recovery. Access is wrapped so server rendering never touches `window`.

### State

`AuthProvider`, `BagProvider`, and `OrdersProvider` in `src/state/`, each a React context over the storage module, mounted once in the root layout. Components never touch localStorage directly.

### Routing guard

`src/components/RequireAuth.tsx` wraps every page except login. Signed-out visitors go to `/login`.

## 8. Copy voice

Sentence case everywhere. Plain verbs. Buttons say what happens: "Add to bag", "Check out", "Place order", "Reorder", "Sign in". A toast repeats the verb: "Added to bag." Errors say what went wrong and what to do: "That code isn't valid." Empty states invite an action. No exclamation points except on the confirmation screen's title.

## 9. Testing

- Vitest unit tests for every function in `pricing.ts` and `rewards.ts`, written before the implementation.
- A storage test that a corrupt value throws.
- `npm run build` and `npm run lint` must pass. That is the UI's acceptance test for version one; there are no component tests.
- Before handoff the orchestrator clicks the full flow in a browser: login, build a bowl, add a preset, set a 7-meal plan, check out with `CYCLONE10`, confirm, reorder from Account.

## 10. Project layout

```
src/
  app/
    layout.tsx           root: fonts, providers, PhoneFrame
    globals.css          @theme tokens, ticket edge, motion rules
    login/page.tsx
    page.tsx             Home
    order/page.tsx
    menu/[mealType]/page.tsx
    meal/[presetId]/page.tsx
    bag/page.tsx
    checkout/page.tsx
    order/[orderId]/page.tsx
    account/page.tsx
  components/
    PhoneFrame.tsx  TabBar.tsx  LargeTitle.tsx  InlineNav.tsx
    Button.tsx  Pill.tsx  Sheet.tsx  Toast.tsx  Ticket.tsx
    MealImage.tsx  RequireAuth.tsx  SegmentedControl.tsx
    builder/   BuilderSection.tsx  Builder.tsx  MacroLine.tsx
    bag/       BagRow.tsx  PlanCard.tsx
    home/      RewardsBar.tsx  UsualRow.tsx  MealTypeGrid.tsx  PresetRow.tsx
  data/        types.ts  menu.ts  locations.ts
  lib/         pricing.ts  rewards.ts  storage.ts  (+ .test.ts files)
  state/       AuthProvider.tsx  BagProvider.tsx  OrdersProvider.tsx
public/
  isu-logo.png
  meals/*.jpg
```

## 11. Delegation

Orchestrator (this session) writes no application code. It scaffolds, writes briefs, reviews diffs, runs the build, clicks through, and deploys. Workers claim files through linkC and touch nothing outside their claim.

### Task 0, foundation. Codex (gpt-5.6-sol). Serial, everything else waits on it.

Scaffold with `create-next-app`, install `lucide-react` and Vitest, fonts, tokens, the data files, `pricing.ts` and `rewards.ts` and `storage.ts` with their tests first, the three providers, `PhoneFrame`, `TabBar`, `LargeTitle`, `InlineNav`, `Button`, `Pill`, `Sheet`, `Toast`, `Ticket`, `MealImage`, `SegmentedControl`, `RequireAuth`, and a stub page for every route that renders its title so the app boots and every tab works. Download meal photos. Commit.

Done when: tests pass, build passes, every route renders inside the phone frame, tab bar navigates.

### Task 1, build and bag. Codex (gpt-5.6-sol).

`Builder`, `BuilderSection`, `MacroLine`, both build routes, `BagRow`, `PlanCard`, the bag page. Owns `src/components/builder/**`, `src/components/bag/**`, `src/app/menu/**`, `src/app/meal/**`, `src/app/bag/**`.

### Task 2, login, home, order tab. Antigravity (gemini-3.8-flash).

Login page, Home with its four sections, Order tab with segmented control and filters. Owns `src/app/login/**`, `src/app/page.tsx`, `src/app/order/page.tsx`, `src/components/home/**`.

### Task 3, checkout, confirmation, account. Cursor (auto).

Checkout with its sheets and promo, confirmation, Account with all five sections. Owns `src/app/checkout/**`, `src/app/order/[orderId]/**`, `src/app/account/**`.

Tasks 1, 2, and 3 run in parallel. Shared files (`globals.css`, `TabBar.tsx`, providers, `menu.ts`) are frozen after Task 0. A worker who needs a change there posts a linkC note and the orchestrator routes it.

### Task 4, integration. Orchestrator plus one Codex review pass.

Build, lint, tests, full click-through, fix list delegated back to the owning worker, deploy to Vercel, hand over the link.

## 12. Out of scope for version one

Real auth, payments, a backend, push notifications, a kitchen or admin view, delivery, allergen data, nutrition beyond calories and protein, dark mode, and Android-style layout. The founder edits copy, prices, and photos after seeing version one.
