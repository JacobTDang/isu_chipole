import SwiftUI

enum OrderFilter: String, CaseIterable, Identifiable {
    case highProtein
    case vegetarian
    case underTen

    var id: String { rawValue }

    var label: String {
        switch self {
        case .highProtein:
            return "High protein"
        case .vegetarian:
            return "Vegetarian"
        case .underTen:
            return "Under $10"
        }
    }

    func matches(_ meal: PresetMeal) -> Bool {
        let selection = Selection(mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id)
        switch self {
        case .highProtein:
            return Pricing.macros(selection).protein >= 30
        case .vegetarian:
            return meal.tags.contains(.veg)
        case .underTen:
            return Pricing.itemPrice(selection) < 10
        }
    }
}

struct FilterChips: View {
    @Binding var selected: Set<OrderFilter>

    var body: some View {
        HStack(spacing: 8) {
            ForEach(OrderFilter.allCases) { filter in
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
