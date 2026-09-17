import SwiftUI

enum OrderFilter: String, CaseIterable, Identifiable {
    case highProtein
    case vegetarian
    case underTen
    case inBudget

    var id: String { rawValue }

    var label: String {
        switch self {
        case .highProtein:
            return "High protein"
        case .vegetarian:
            return "Vegetarian"
        case .underTen:
            return "Under $10"
        case .inBudget:
            return "In budget"
        }
    }

    /// The chips to show; "In budget" only exists once a budget is set.
    static func available(budget: Decimal?) -> [OrderFilter] {
        allCases.filter { $0 != .inBudget || budget != nil }
    }

    func matches(_ meal: PresetMeal, budget: Decimal?) -> Bool {
        let selection = Selection(mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id)
        switch self {
        case .highProtein:
            return Pricing.macros(selection).protein >= 30
        case .vegetarian:
            return meal.tags.contains(.veg)
        case .underTen:
            return Pricing.itemPrice(selection) < 10
        case .inBudget:
            guard let budget else {
                preconditionFailure("The In budget filter needs a budget")
            }
            return Pricing.itemPrice(selection) <= budget
        }
    }
}

struct FilterChips: View {
    let available: [OrderFilter]
    @Binding var selected: Set<OrderFilter>

    var body: some View {
        HStack(spacing: 8) {
            ForEach(available) { filter in
                PillButton(
                    label: filter.label,
                    price: nil,
                    veg: false,
                    selected: selected.contains(filter)
                ) {
                    if selected.contains(filter) {
                        selected.remove(filter)
                    } else {
                        selected.insert(filter)
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
