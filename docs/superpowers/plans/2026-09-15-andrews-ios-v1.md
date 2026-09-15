# Andrew's iOS v1 Implementation Plan

> **For agentic workers:** Read `docs/superpowers/specs/2026-09-15-andrews-ios-design.md` and then `docs/superpowers/specs/2026-09-15-andrews-meal-prep-design.md` in full before starting. The web app in `src/` is the reference implementation: when in doubt about copy, layout order, or behavior, open the matching web component and match it. Touch only the files your task owns.

**Goal:** A native SwiftUI iOS app that reproduces the web prototype screen for screen, builds and tests from the command line, and runs in the iPhone 17 Pro simulator.

**Architecture:** One `@Observable` `AppStore` over a UserDefaults JSON storage layer. Pure `Pricing` and `Rewards` modules with unit tests. SwiftUI screens composed from a small set of shared components (`PillButton`, `TicketView`, `PrimaryButtonStyle`, `ToastView`, `MealImage`, `ScrollingSegments`, `QuantityStepper`).

**Tech Stack:** Xcode 26, Swift 6, SwiftUI, Swift Testing, iOS 17 deployment target. No packages.

## Global Constraints

- No Swift Package or CocoaPods dependencies. No project generators.
- Test-first for `Pricing.swift`, `Rewards.swift`, `Menu.swift` counts, and `Storage.swift`.
- Fail loud: storage decode failures hit `preconditionFailure` with the key name. No silent defaults on corrupt data.
- No `print` statements left behind, no commented-out code, no scratch files.
- Colors only through `Theme.swift`. Fonts only through the `Font` helpers in `Theme.swift`. No hex literals or font names outside `Theme.swift`.
- Every tappable control at least 44pt tall.
- Copy identical to the web app: sentence case, "Add to bag", "Check out", "Place order", "Reorder", "Sign in", toast "Added to bag."
- Build command that must pass before reporting done:
  `xcodebuild -project ios/Andrews.xcodeproj -scheme Andrews -destination 'platform=iOS Simulator,name=iPhone 17 Pro' -quiet build test`
- Commit only your own files with explicit `git add`. `feat:`/`test:`/`chore:` messages. No AI tool names or co-author trailers in commit messages.
- Shared files frozen after Task 0: `ios/Andrews.xcodeproj/**`, `ios/Andrews/Info.plist`, `ios/Andrews/Theme/**`, `ios/Andrews/Model/**`, `ios/Andrews/Components/**`, `ios/Andrews/AndrewsApp.swift`, `ios/Andrews/Screens/MainTabView.swift`. Need a change there: post a linkC note titled `Shared file request: <file>` and continue.

---

### Task 0: Foundation

Worker: Cursor. Serial.

**Files:** `ios/Andrews.xcodeproj/project.pbxproj`, `ios/Andrews/AndrewsApp.swift`, `ios/Andrews/Info.plist`, `ios/Andrews/Assets.xcassets/**`, `ios/Andrews/Fonts/*.ttf`, `ios/Andrews/Theme/Theme.swift`, `ios/Andrews/Model/*.swift`, `ios/Andrews/Components/*.swift`, `ios/Andrews/Screens/MainTabView.swift`, `ios/Andrews/Screens/LoginView.swift` (stub), one stub file per screen listed in spec section 7 that renders its title, `ios/AndrewsTests/*.swift`.

**Interfaces produced:**

```swift
// Model/Types.swift  (Codable, Hashable, Identifiable where sensible)
enum IngredientGroup: String, Codable, CaseIterable { case base, protein, veggies, toppings, sauce, extras }
enum IngredientTag: String, Codable { case veg, gf, spicy }
struct Ingredient: Codable, Identifiable, Hashable { let id: String; let name: String; let group: IngredientGroup; let price: Decimal; let calories: Int; let protein: Int; let tags: [IngredientTag] }
enum MealTypeId: String, Codable, CaseIterable, Identifiable { case bowl, wrap, pasta, salad, breakfast; var id: String { rawValue } }
struct MealType: Codable, Identifiable, Hashable { let id: MealTypeId; let name: String; let basePrice: Decimal; let blurb: String; let image: String }
enum PresetTag: String, Codable { case veg, highProtein = "high-protein" }
struct PresetMeal: Codable, Identifiable, Hashable { let id: String; let name: String; let mealType: MealTypeId; let blurb: String; let image: String; let ingredientIds: [String]; let tags: [PresetTag] }
struct Selection: Codable, Hashable { var mealType: MealTypeId; var ingredientIds: [String]; var quantity: Int; var name: String?; var presetId: String? }
struct BagItem: Codable, Identifiable, Hashable { let id: String; var selection: Selection }
enum PlanSize: Int, Codable, CaseIterable { case five = 5, seven = 7, ten = 10 }
struct PickupLocation: Codable, Identifiable, Hashable { let id: String; let name: String; let note: String }
enum PickupDay: String, Codable, CaseIterable { case sunday = "Sunday", wednesday = "Wednesday" }
struct Order: Codable, Identifiable, Hashable { let id: String; let items: [BagItem]; let plan: PlanSize; let promo: String?; let location: PickupLocation; let day: PickupDay; let time: String; let subtotal: Decimal; let discount: Decimal; let tax: Decimal; let total: Decimal; let placedAt: Date }
struct User: Codable, Hashable { let email: String; let firstName: String }
struct Preferences: Codable, Hashable { var vegetarian = false; var highProtein = false; var glutenFree = false }
struct Totals: Hashable { let subtotal: Decimal; let discount: Decimal; let tax: Decimal; let total: Decimal }

// Model/Menu.swift
enum Menu {
  static let mealTypes: [MealType]; static let ingredients: [Ingredient]; static let presets: [PresetMeal]
  static let locations: [PickupLocation]; static let timeSlots: [String]   // "4:00 PM" ... "7:00 PM"
  static func mealType(_ id: MealTypeId) -> MealType
  static func ingredient(_ id: String) -> Ingredient          // preconditionFailure if unknown
  static func preset(_ id: String) -> PresetMeal              // preconditionFailure if unknown
  static func ingredients(in group: IngredientGroup) -> [Ingredient]
}

// Model/Pricing.swift
enum Pricing {
  static let taxRate: Decimal = 0.07
  static func itemPrice(_ sel: Selection) -> Decimal          // base price skipped when only extras are selected
  static func bagSubtotal(_ items: [BagItem]) -> Decimal
  static func mealCount(_ items: [BagItem]) -> Int
  static func planDiscountRate(_ plan: PlanSize, count: Int) -> Decimal
  static func promoRate(_ code: String?) -> Decimal
  static func orderTotals(_ items: [BagItem], plan: PlanSize, promo: String?) -> Totals
  static func macros(_ sel: Selection) -> (calories: Int, protein: Int)
  static func money(_ d: Decimal) -> String                   // "$10.25"
}

// Model/Rewards.swift
enum Rewards {
  static func points(_ orders: [Order]) -> Int
  static func tier(_ points: Int) -> (name: String, nextName: String?, nextAt: Int?)
}

// Model/Storage.swift
struct Storage { init(defaults: UserDefaults = .standard); func load<T: Decodable>(_ key: StorageKey) -> T?; func save<T: Encodable>(_ value: T?, _ key: StorageKey); func clearAll() }
enum StorageKey: String, CaseIterable { case user = "andrews.user", bag = "andrews.bag", orders = "andrews.orders", saved = "andrews.saved", prefs = "andrews.prefs" }

// Model/AppStore.swift
@Observable final class AppStore {
  var user: User?; var bag: [BagItem]; var plan: PlanSize; var promo: String?; var orders: [Order]; var saved: [Selection]; var prefs: Preferences
  var toast: String?                      // set to show, cleared automatically after 3s
  var selectedTab: Tab                    // enum Tab { case home, order, bag, account }
  func signIn(email: String); func signOut()
  func add(_ sel: Selection); func update(_ id: String, _ sel: Selection); func remove(_ id: String); func duplicate(_ id: String); func setQuantity(_ id: String, _ q: Int)
  func setPlan(_ p: PlanSize); func setPromo(_ code: String?); func replaceBag(with items: [BagItem]); func clearBag()
  @discardableResult func placeOrder(location: PickupLocation, day: PickupDay, time: String) -> Order   // computes totals, empties bag
  func save(_ sel: Selection); func setPrefs(_ p: Preferences); func resetDemoData()
  func showToast(_ message: String)
}

// Components
struct PillButton: View { init(label: String, price: Decimal?, veg: Bool, selected: Bool, action: () -> Void) }
struct TicketView<Content: View>: View { init(lines: [TicketLine], total: TicketLine?, @ViewBuilder footer: () -> Content) }
struct TicketLine: Identifiable { let id = UUID(); let label: String; let amount: String; var muted = false }
struct PrimaryButtonStyle: ButtonStyle {}  struct SecondaryButtonStyle: ButtonStyle {}  struct DarkButtonStyle: ButtonStyle {}
struct ToastView: View  // reads store.toast
struct MealImage: View { init(name: String, fallbackLetter: String) }  // Assets image or gradient tile
struct ScrollingSegments<ID: Hashable>: View { init(options: [(id: ID, label: String)], selection: Binding<ID>) }
struct QuantityStepper: View { init(value: Binding<Int>, range: ClosedRange<Int>) }
```

- [ ] **Step 1: Project.** Create `ios/Andrews.xcodeproj/project.pbxproj` by hand with `objectVersion = 77`, two native targets (`Andrews` app, `AndrewsTests` unit test bundle with `TEST_HOST` pointing at the app), one `PBXFileSystemSynchronizedRootGroup` per source folder, `IPHONEOS_DEPLOYMENT_TARGET = 17.0`, `SWIFT_VERSION = 6.0`, `TARGETED_DEVICE_FAMILY = 1`, `PRODUCT_BUNDLE_IDENTIFIER = com.andrews.app`, `GENERATE_INFOPLIST_FILE = NO` with `INFOPLIST_FILE = Andrews/Info.plist`, `CODE_SIGNING_ALLOWED = NO` for the simulator, and a shared scheme in `xcshareddata/xcschemes/Andrews.xcscheme` that builds the app and runs the tests. Add `AndrewsApp.swift` with a `Text("Andrew's")` body and one trivial test. Run the build-and-test command from Global Constraints until it passes. Commit `chore: add ios project`.
- [ ] **Step 2: Theme and fonts.** Download the three font families' TTFs from `https://github.com/google/fonts/tree/main/ofl/` (bricolagegrotesque, instrumentsans, jetbrainsmono) with `curl -L` on the raw file URLs into `ios/Andrews/Fonts/`, verify each with `file` is a TrueType font, register them in `Info.plist` under `UIAppFonts`, write `Theme.swift`. Also set `UISupportedInterfaceOrientations` to portrait only and `CFBundleDisplayName` to `Andrew's`. Add the ISU logo and the thirteen meal photos from `public/` as image sets in `Assets.xcassets`, and the app icon from `public/icons/icon-512.png` scaled to 1024 with `sips`. Commit.
- [ ] **Step 3: Types and menu, test first.** `MenuTests`: 5 meal types, 8 presets, 4 locations, 7 time slots, every preset ingredient id resolves, `Menu.ingredient("protein-shake").group == .extras`. Transcribe data from `src/data/menu.ts` exactly. Commit.
- [ ] **Step 4: Pricing, test first.** `PricingTests` with the same cases as `src/lib/pricing.test.ts`: 8.50 bowl; quantity doubles; guac adds 1.75; extras-only item costs the extras alone; `planDiscountRate(.seven, count: 6) == 0`, `(.seven, 7) == 0.05`, `(.ten, 12) == 0.10`; `promoRate("cyclone10") == 0.10`, `promoRate("nope") == 0`; ten 8.50 bowls on `.ten` with `CYCLONE10` gives 85.00 / 17.00 / 4.76 / 72.76; `money(10.25) == "$10.25"`. Commit.
- [ ] **Step 5: Rewards, test first.** Same cases as `rewards.test.ts`. Commit.
- [ ] **Step 6: Storage, test first.** Use `UserDefaults(suiteName: "andrews.tests")` and `removePersistentDomain` in setup. Round-trip a `[BagItem]`, `clearAll` removes every key. Commit.
- [ ] **Step 7: AppStore.** Implement per the interface. Toast auto-clears with a `Task.sleep` of 3 seconds. Bag, plan, and promo persist together under `andrews.bag` as `struct BagState: Codable { items, plan, promo }`. Commit.
- [ ] **Step 8: Components.** All seven, matching the web spec's sections 3 and 4 (the Apple HIG conventions are native here). `TicketView` perforation via `Canvas` drawing cream circles along the top edge over a card background; dotted leaders via a `Rectangle` with a dashed stroke. `PillButton` uses `.animation(.spring(duration: 0.12))` unless reduce motion. Commit after every two or three.
- [ ] **Step 9: Shell and stubs.** `AndrewsApp` injects `AppStore` and shows `LoginView` or `MainTabView`. `MainTabView` with four `NavigationStack` tabs, bag badge, cardinal tint. Every screen file from spec section 7 exists as a stub showing its title so navigation works. Commit.
- [ ] **Step 10: Verify.** Build-and-test command passes. `xcrun simctl boot "iPhone 17 Pro"`, `xcodebuild ... build` then `xcrun simctl install booted <path to Andrews.app in DerivedData>`, `xcrun simctl launch booted com.andrews.app`, and `xcrun simctl io booted screenshot /tmp/shell.png` to confirm the tab bar and stub titles render. Shut the simulator down after. Report with the test count and any deviations.

---

### Task 1: Builder and Bag

**Files:** `ios/Andrews/Screens/Builder/*.swift`, `ios/Andrews/Screens/Bag/*.swift`.

Mirror `src/components/builder/*`, `src/app/menu/[mealType]/*`, `src/app/meal/[presetId]/*`, `src/components/bag/*`, `src/app/bag/page.tsx`. `BuilderView(mode:)` with `enum BuilderMode { case new(MealTypeId), preset(String), edit(String) }`. Sticky ticket bar via `.safeAreaInset(edge: .bottom)`. Sections in spec order, single or multi select rules, disabled state text "Choose a base and a protein". Quantity stepper 1 to 10. Name field saves to `store.save` when present. Bag rows with edit, duplicate, stepper, plan sheet (`PlanSheet` with `.medium` detent), add-ons row, ticket totals, "Check out" navigates to `CheckoutView`. Verify in the simulator: build a bowl, add, edit from bag, set 7-meal plan, see the 5% line.

### Task 2: Login, Home, Order

**Files:** `ios/Andrews/Screens/LoginView.swift` (replace stub), `ios/Andrews/Screens/Home/*.swift`, `ios/Andrews/Screens/Order/*.swift`.

Mirror `src/app/login/page.tsx`, `src/app/page.tsx`, `src/components/home/*`, `src/app/order/page.tsx`, `src/components/order/*`. Login: logo 240pt wide, display title, tagline, two fields, "Sign in" enabled when email is non-empty, "Continue with ISU Net-ID" secondary, both call `store.signIn`. Home: `ScrollView` with rewards bar, usual row or empty card, 2-column `LazyVGrid` with the fifth tile full width, horizontal preset `ScrollView`. Order: `ScrollingSegments` for six segments, filter chips pre-selected from `store.prefs`, pinned "Build your own" card, preset list. Verify in the simulator.

### Task 3: Checkout, Confirmation, Account

**Files:** `ios/Andrews/Screens/Checkout/*.swift`, `ios/Andrews/Screens/Confirmation/*.swift`, `ios/Andrews/Screens/Account/*.swift`.

Mirror `src/app/checkout/page.tsx`, `src/components/checkout/*`, `src/app/order/[orderId]/*`, `src/app/account/*`, `src/components/account/*`. Checkout as a `Form` with location row opening `LocationSheet`, day segmented `Picker`, time row opening `TimeSheet`, payment row, black "Pay with Apple Pay" button using `DarkButtonStyle`, promo field with inline error "That code isn't valid.", ticket with "Place order" calling `store.placeOrder`. Confirmation hides the tab bar, animates the ticket in, "Back to home" pops and switches tab. Account: rewards, order history with Reorder, saved meals, preferences toggles, "Reset demo data" and "Sign out". Verify in the simulator.

### Task 4: Integration

Orchestrator. Build and test, full simulator walkthrough, screenshots into `docs/superpowers/screenshots/ios/`, defect list back to owners.
