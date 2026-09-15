import Foundation

enum IngredientGroup: String, Codable, CaseIterable, Hashable {
    case base
    case protein
    case veggies
    case toppings
    case sauce
    case extras
}

enum IngredientTag: String, Codable, Hashable {
    case veg
    case gf
    case spicy
}

struct Ingredient: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let group: IngredientGroup
    let price: Decimal
    let calories: Int
    let protein: Int
    let tags: [IngredientTag]
}

enum MealTypeId: String, Codable, CaseIterable, Identifiable, Hashable {
    case bowl
    case wrap
    case pasta
    case salad
    case breakfast

    var id: String { rawValue }
}

struct MealType: Codable, Identifiable, Hashable {
    let id: MealTypeId
    let name: String
    let basePrice: Decimal
    let blurb: String
    let image: String
}

enum PresetTag: String, Codable, Hashable {
    case veg
    case highProtein = "high-protein"
}

struct PresetMeal: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let mealType: MealTypeId
    let blurb: String
    let image: String
    let ingredientIds: [String]
    let tags: [PresetTag]
}

struct Selection: Codable, Hashable {
    var mealType: MealTypeId
    var ingredientIds: [String]
    var quantity: Int
    var name: String?
    var presetId: String?
}

struct BagItem: Codable, Identifiable, Hashable {
    let id: String
    var selection: Selection
}

enum PlanSize: Int, Codable, CaseIterable, Hashable {
    case five = 5
    case seven = 7
    case ten = 10
}

struct PickupLocation: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let note: String
}

enum PickupDay: String, Codable, CaseIterable, Hashable {
    case sunday = "Sunday"
    case wednesday = "Wednesday"
}

struct Order: Codable, Identifiable, Hashable {
    let id: String
    let items: [BagItem]
    let plan: PlanSize
    let promo: String?
    let location: PickupLocation
    let day: PickupDay
    let time: String
    let subtotal: Decimal
    let discount: Decimal
    let tax: Decimal
    let total: Decimal
    let placedAt: Date
}

struct User: Codable, Hashable {
    let email: String
    let firstName: String
}

struct Preferences: Codable, Hashable {
    var vegetarian = false
    var highProtein = false
    var glutenFree = false
}

struct Totals: Hashable {
    let subtotal: Decimal
    let discount: Decimal
    let tax: Decimal
    let total: Decimal
}
