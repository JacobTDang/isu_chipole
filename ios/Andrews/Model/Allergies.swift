import Foundation

enum Allergies {
    /// The selected allergens this ingredient contains, in the ingredient's
    /// own order.
    static func conflicts(in ingredient: Ingredient, allergies: [Allergen]) -> [Allergen] {
        ingredient.allergens.filter { allergies.contains($0) }
    }

    /// "Contains dairy, eggs", or nil when the ingredient is safe.
    static func caption(for ingredient: Ingredient, allergies: [Allergen]) -> String? {
        let found = conflicts(in: ingredient, allergies: allergies)
        guard !found.isEmpty else { return nil }
        return "Contains " + found.map(\.rawValue).joined(separator: ", ")
    }

    /// Drops every ingredient that conflicts and describes what was dropped:
    /// "We removed cheese and ranch. They contain dairy."
    static func removingConflicts(
        from ingredientIds: [String],
        allergies: [Allergen]
    ) -> (kept: [String], banner: String?) {
        var kept: [String] = []
        var removed: [Ingredient] = []
        for id in ingredientIds {
            let ingredient = Menu.ingredient(id)
            if conflicts(in: ingredient, allergies: allergies).isEmpty {
                kept.append(id)
            } else {
                removed.append(ingredient)
            }
        }
        guard !removed.isEmpty else { return (kept, nil) }

        let names = removed.map { $0.name.lowercased() }
        let involved = Allergen.allCases.filter { allergen in
            allergies.contains(allergen) && removed.contains { $0.allergens.contains(allergen) }
        }
        let verb = removed.count == 1 ? "It contains" : "They contain"
        return (kept, "We removed \(list(names)). \(verb) \(list(involved.map(\.rawValue))).")
    }

    private static func list(_ items: [String]) -> String {
        switch items.count {
        case 0:
            preconditionFailure("Cannot list nothing")
        case 1:
            return items[0]
        case 2:
            return "\(items[0]) and \(items[1])"
        default:
            return items.dropLast().joined(separator: ", ") + ", and " + items[items.count - 1]
        }
    }
}
