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

enum Allergen: String, Codable, CaseIterable, Hashable {
    case dairy
    case gluten
    case nuts
    case soy
    case eggs
    case fish

    var label: String {
        rawValue.capitalized
    }
}

struct Ingredient: Codable, Identifiable, Hashable {
    let id: String
    let name: String
    let group: IngredientGroup
    let price: Decimal
    let calories: Int
    let protein: Int
    let tags: [IngredientTag]
    let allergens: [Allergen]

    init(
        id: String,
        name: String,
        group: IngredientGroup,
        price: Decimal,
        calories: Int,
        protein: Int,
        tags: [IngredientTag],
        allergens: [Allergen] = []
    ) {
        self.id = id
        self.name = name
        self.group = group
        self.price = price
        self.calories = calories
        self.protein = protein
        self.tags = tags
        self.allergens = allergens
    }
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

enum Fulfillment: String, Codable, Hashable {
    case pickup
    case delivery
}

struct Order: Codable, Identifiable, Hashable {
    let id: String
    let items: [BagItem]
    let plan: PlanSize
    let promo: String?
    /// For delivery this holds the default location and is not shown.
    let location: PickupLocation
    /// ISO calendar date "YYYY-MM-DD" in the device's local time zone.
    let date: String
    let time: String
    let fulfillment: Fulfillment
    let address: String?
    let deliveryFee: Decimal
    let subtotal: Decimal
    let discount: Decimal
    let tax: Decimal
    let total: Decimal
    let placedAt: Date
}

extension Order {
    private enum LegacyKeys: String, CodingKey {
        case day
    }

    /// Orders stored before delivery existed lack the fulfillment keys and
    /// load as pickup with no fee. Orders stored before calendar dates carry
    /// a weekday instead of a date; they load with the first date on or after
    /// the day they were placed that falls on that weekday.
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        items = try container.decode([BagItem].self, forKey: .items)
        plan = try container.decode(PlanSize.self, forKey: .plan)
        promo = try container.decodeIfPresent(String.self, forKey: .promo)
        location = try container.decode(PickupLocation.self, forKey: .location)
        time = try container.decode(String.self, forKey: .time)
        fulfillment = try container.decodeIfPresent(Fulfillment.self, forKey: .fulfillment) ?? .pickup
        address = try container.decodeIfPresent(String.self, forKey: .address)
        deliveryFee = try container.decodeIfPresent(Decimal.self, forKey: .deliveryFee) ?? 0
        subtotal = try container.decode(Decimal.self, forKey: .subtotal)
        discount = try container.decode(Decimal.self, forKey: .discount)
        tax = try container.decode(Decimal.self, forKey: .tax)
        total = try container.decode(Decimal.self, forKey: .total)
        placedAt = try container.decode(Date.self, forKey: .placedAt)

        let legacy = try decoder.container(keyedBy: LegacyKeys.self)
        if let stored = try container.decodeIfPresent(String.self, forKey: .date) {
            guard Schedule.parse(stored) != nil else {
                throw DecodingError.dataCorruptedError(
                    forKey: .date,
                    in: container,
                    debugDescription: "\(stored) is not a YYYY-MM-DD calendar date"
                )
            }
            date = stored
        } else if let day = try legacy.decodeIfPresent(String.self, forKey: .day) {
            guard Schedule.weekdayNames.contains(day) else {
                throw DecodingError.dataCorruptedError(
                    forKey: .day,
                    in: legacy,
                    debugDescription: "\(day) is not a weekday"
                )
            }
            date = Schedule.nextDateForWeekday(from: Schedule.todayISO(now: placedAt), weekday: day)
        } else {
            throw DecodingError.keyNotFound(
                CodingKeys.date,
                DecodingError.Context(codingPath: container.codingPath, debugDescription: "Order has neither date nor day")
            )
        }
    }
}

struct User: Codable, Hashable {
    let email: String
    let firstName: String
}

enum Goal: String, Codable, CaseIterable, Hashable {
    case muscle
    case lose
    case maintain

    var label: String {
        switch self {
        case .muscle:
            return "Build muscle"
        case .lose:
            return "Lose weight"
        case .maintain:
            return "Maintain"
        }
    }

    /// Calorie target per meal. `range` is the on-target band; `lose` has
    /// only a ceiling.
    var calorieRange: ClosedRange<Int> {
        switch self {
        case .muscle:
            return 595...805
        case .lose:
            return 0...500
        case .maintain:
            return 510...690
        }
    }

    var minimumProtein: Int {
        switch self {
        case .muscle:
            return 45
        case .lose:
            return 35
        case .maintain:
            return 30
        }
    }

    var targetDescription: String {
        switch self {
        case .muscle:
            return "About 700 cal and 45g+ protein per meal"
        case .lose:
            return "At most 500 cal and 35g+ protein per meal"
        case .maintain:
            return "About 600 cal and 30g+ protein per meal"
        }
    }
}

struct Preferences: Codable, Hashable {
    var vegetarian = false
    var highProtein = false
    var glutenFree = false
    var allergies: [Allergen] = []
    var goal: Goal? = nil
    var budget: Decimal? = nil
}

extension Preferences {
    /// Preferences stored before allergies, goal, and budget existed lack
    /// those keys; they load with their defaults. A key that is present with
    /// the wrong type still throws.
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        vegetarian = try container.decode(Bool.self, forKey: .vegetarian)
        highProtein = try container.decode(Bool.self, forKey: .highProtein)
        glutenFree = try container.decode(Bool.self, forKey: .glutenFree)
        allergies = try container.decodeIfPresent([Allergen].self, forKey: .allergies) ?? []
        goal = try container.decodeIfPresent(Goal.self, forKey: .goal)
        budget = try container.decodeIfPresent(Decimal.self, forKey: .budget)
    }
}

struct Totals: Hashable {
    let subtotal: Decimal
    let discount: Decimal
    let tax: Decimal
    let delivery: Decimal
    let total: Decimal
}
