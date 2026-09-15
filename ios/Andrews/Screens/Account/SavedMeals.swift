import SwiftUI

struct SavedMeals: View {
    @Environment(AppStore.self) private var store

    private var namedMeals: [Selection] {
        store.saved.filter { meal in
            !(meal.name ?? "").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }
    }

    var body: some View {
        let meals = namedMeals
        if meals.isEmpty {
            VStack(alignment: .leading, spacing: 4) {
                Text("No saved meals yet.")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                Text("Name a custom build to save it here.")
                    .font(.body(15))
                    .foregroundStyle(Color.inkSoft)
            }
            .padding(.vertical, 8)
            .listRowBackground(Color.card)
        } else {
            ForEach(Array(meals.enumerated()), id: \.offset) { _, meal in
                row(meal)
                    .listRowBackground(Color.card)
            }
        }
    }

    private func row(_ meal: Selection) -> some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(meal.name ?? "")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                    .lineLimit(1)
                Text(summary(meal))
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
                    .lineLimit(2)
                Text(Pricing.money(Pricing.itemPrice(meal)))
                    .font(.body(13, weight: .semibold))
                    .foregroundStyle(Color.cardinal)
            }
            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)

            Button {
                store.add(meal)
            } label: {
                Text("Add to bag")
                    .padding(.horizontal, 12)
            }
            .buttonStyle(SecondaryButtonStyle())
            .fixedSize()
        }
        .padding(.vertical, 4)
    }

    private func summary(_ meal: Selection) -> String {
        let names = meal.ingredientIds.map { Menu.ingredient($0).name }
        let type = Menu.mealType(meal.mealType).name
        return names.isEmpty ? type : "\(type) · \(names.joined(separator: ", "))"
    }
}
