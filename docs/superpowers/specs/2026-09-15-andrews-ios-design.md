# Andrew's — Native iOS app (SwiftUI)

Version 1 iOS design spec. Date: 2026-09-15. This ports the web prototype to a native SwiftUI app. Everything not covered here is identical to `2026-09-15-andrews-meal-prep-design.md`: screens, flow, copy, palette, type, data, pricing rules, rewards tiers, pickup locations, and the Chipotle-style build workflow. Read that spec first.

## 1. What this is

A native iOS app that looks and behaves exactly like the web prototype, runs in the iOS Simulator and on a physical iPhone, and produces App Store-style screenshots from the Simulator. No backend. Menu data is Swift structs. Bag, orders, saved meals, preferences, and sign-in state persist in UserDefaults as JSON.

## 2. Stack

- Xcode 26, Swift 6, SwiftUI, iOS 17.0 deployment target, iPhone only, portrait only.
- Xcode project at `ios/Andrews.xcodeproj` with two targets: `Andrews` (app) and `AndrewsTests` (unit tests, Swift Testing framework). The project uses `PBXFileSystemSynchronizedRootGroup` for `ios/Andrews/` and `ios/AndrewsTests/`, so adding a file to those folders adds it to the target with no project edits. Hand-written, no generator.
- No third-party packages. No Swift Package dependencies.
- Fonts bundled as TTF: Bricolage Grotesque (ExtraBold), Instrument Sans (Regular, SemiBold), JetBrains Mono (Medium). All three are SIL Open Font License; the worker downloads them from the Google Fonts GitHub repository and lists them under `UIAppFonts` in Info.plist.
- Persistence: `UserDefaults.standard` with `JSONEncoder`/`JSONDecoder`. Corrupt data throws and surfaces as a fatal precondition failure with the key name, matching the web app's fail-loud rule. A "Reset demo data" button clears every key.
- State: one `@Observable final class AppStore` injected via `.environment(...)`, holding `user`, `bag`, `plan`, `promo`, `orders`, `saved`, `prefs`, and the mutation methods. Views never touch UserDefaults directly.

## 3. Visual mapping

| Web | iOS |
|---|---|
| Phone frame | None; the app fills the device |
| Tab bar | Native `TabView` with four tabs: Home, Order, Bag, Account. Bag tab uses `.badge(mealCount)`. Tint cardinal. |
| Large title | `NavigationStack` with `.navigationTitle` and `.navigationBarTitleDisplayMode(.large)` |
| Inline nav with back chevron | Pushed view in the `NavigationStack`, inline title |
| Bottom sheet | `.sheet` with `.presentationDetents([.medium])` and `.presentationDragIndicator(.visible)` |
| Segmented control | `Picker` with `.pickerStyle(.segmented)`; for the six Order segments use a horizontally scrolling custom segmented view so no label truncates |
| Pill | Custom `PillButton` view; selected state gold fill, cardinal border, 44pt min height, spring scale animation |
| Ticket | Custom `TicketView`: card background, perforated top edge drawn with a `Canvas` of small circles, mono line items with dotted leaders, cardinal dashed rule, display-weight total |
| Toast | Custom overlay at the bottom above the tab bar, 3 seconds, `.transition(.move(edge: .bottom).combined(with: .opacity))` |
| Grouped list | `List` with `.listStyle(.insetGrouped)` or `Form` |
| Primary button | Custom `ButtonStyle`: full width, 50pt, cardinal fill, white semibold, 14pt radius, pressed state cardinal-deep |
| Toggles | Native `Toggle` tinted cardinal |
| Meal images | Bundled JPEGs in `Assets.xcassets` as image sets, same 13 photos copied from `public/meals/`, plus the ISU logo from `public/isu-logo.png` |
| Reduced motion | Respect `accessibilityReduceMotion` for every animation |

Colors are defined once in `Theme.swift` as `Color.cardinal`, `.cardinalDeep`, `.gold`, `.cream`, `.card`, `.ink`, `.inkSoft`, `.line`, `.veg` with the hex values from the web spec. Fonts as `Font.display(_ size:)`, `.body(_ size:, weight:)`, `.ticket(_ size:)`.

Dynamic Type: the app uses fixed sizes from the spec but wraps them in `.dynamicTypeSize(...DynamicTypeSize.xLarge)` at the root so accessibility sizes don't break layouts.

## 4. Screens

All eight screens from the web spec, section 5, with identical copy and behavior. Navigation model:

- Root: if `store.user == nil`, show `LoginView` full screen; otherwise `MainTabView`.
- Home tab: `NavigationStack` → `HomeView` → pushes `BuilderView(mode: .new(mealType))` or `BuilderView(mode: .preset(id))`.
- Order tab: `NavigationStack` → `OrderView` → pushes `BuilderView`.
- Bag tab: `NavigationStack` → `BagView` → pushes `CheckoutView` → on place order, replaces the path with `ConfirmationView(orderId)`. Bag row "Edit" pushes `BuilderView(mode: .edit(bagItemId))`.
- Account tab: `NavigationStack` → `AccountView` → tapping an order pushes `ConfirmationView`.
- `ConfirmationView` hides the tab bar with `.toolbar(.hidden, for: .tabBar)` and has a "Back to home" button that pops to root and switches to the Home tab.

## 5. Logic

`Pricing.swift` mirrors `src/lib/pricing.ts` function for function: `itemPrice`, `bagSubtotal`, `mealCount`, `planDiscountRate`, `promoRate`, `orderTotals`, `macros`. Money is `Decimal` rounded to two places at the end with `NSDecimalNumber` banker's-free rounding (`.plain`). `Rewards.swift` mirrors `rewards.ts`. Both are pure, no Foundation UI imports, and unit tested with the same expected values as the web tests (a bowl with cilantro-lime rice and grilled chicken is 8.50; ten of them with `CYCLONE10` on the 10-meal plan totals 72.76).

`Menu.swift` holds `mealTypes`, `ingredients`, `presets`, and `locations` transcribed exactly from `src/data/menu.ts` and `src/data/locations.ts`, including calories and protein. A unit test asserts the counts (5 meal types, 8 presets, 4 locations) and that every preset ingredient id resolves.

`Storage.swift` wraps UserDefaults with typed `load<T: Decodable>(_ key:)` and `save<T: Encodable>(_ value:, _ key:)`. Keys: `andrews.user`, `andrews.bag`, `andrews.orders`, `andrews.saved`, `andrews.prefs`. A decode failure calls `preconditionFailure("andrews storage: \(key) is invalid: \(error)")`. A unit test uses a `UserDefaults(suiteName:)` instance to verify round-trip and `clearAll`.

## 6. Testing and verification

- `xcodebuild -project ios/Andrews.xcodeproj -scheme Andrews -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build test` passes.
- The orchestrator boots the iPhone 17 Pro simulator, installs the app, walks the full flow (sign in, build a bowl, add a preset, 7-meal plan, checkout with `CYCLONE10`, confirmation, account), and captures one screenshot per screen with `xcrun simctl io booted screenshot` into `docs/superpowers/screenshots/ios/`.

## 7. Project layout

```
ios/
  Andrews.xcodeproj/project.pbxproj
  Andrews/
    AndrewsApp.swift          @main, injects AppStore, loads fonts
    Info.plist                UIAppFonts, portrait only, display name Andrew's
    Assets.xcassets/          AppIcon (from public/icons), Meals/*.imageset, ISULogo.imageset
    Fonts/*.ttf
    Theme/Theme.swift         colors, fonts
    Model/Types.swift         Ingredient, MealType, PresetMeal, Selection, BagItem, PlanSize, PickupLocation, Order, User, Preferences
    Model/Menu.swift          data
    Model/Pricing.swift
    Model/Rewards.swift
    Model/Storage.swift
    Model/AppStore.swift
    Components/PillButton.swift  TicketView.swift  PrimaryButtonStyle.swift  ToastView.swift
               MealImage.swift  ScrollingSegments.swift  QuantityStepper.swift
    Screens/LoginView.swift  MainTabView.swift
    Screens/Home/HomeView.swift  RewardsBar.swift  UsualRow.swift  MealTypeGrid.swift  PresetRow.swift
    Screens/Order/OrderView.swift  FilterChips.swift
    Screens/Builder/BuilderView.swift  BuilderSection.swift  MacroLine.swift
    Screens/Bag/BagView.swift  BagRow.swift  PlanSheet.swift  AddOnsRow.swift
    Screens/Checkout/CheckoutView.swift  LocationSheet.swift  TimeSheet.swift  PromoField.swift
    Screens/Confirmation/ConfirmationView.swift
    Screens/Account/AccountView.swift  OrderHistory.swift  SavedMeals.swift  PreferencesSection.swift
  AndrewsTests/
    PricingTests.swift  RewardsTests.swift  MenuTests.swift  StorageTests.swift
```

## 8. Out of scope

App Store submission, code signing for a physical device (the founder sets a team in Xcode when needed), push notifications, widgets, iPad layouts, dark mode, localization.
