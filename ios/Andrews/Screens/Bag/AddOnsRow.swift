import SwiftUI

struct AddOnsRow: View {
    @Environment(AppStore.self) private var store

    private static let addOns = ["protein-shake", "cookie"]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Add-ons")
                .font(.display(22))
                .foregroundStyle(Color.ink)

            HStack(spacing: 12) {
                ForEach(Self.addOns, id: \.self) { id in
                    card(ingredient: Menu.ingredient(id))
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }

    private func selection(for ingredient: Ingredient) -> Selection {
        Selection(
            mealType: .bowl,
            ingredientIds: [ingredient.id],
            quantity: 1,
            name: ingredient.name
        )
    }

    private func card(ingredient: Ingredient) -> some View {
        Button {
            store.add(selection(for: ingredient))
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                MealImage(name: Menu.image(for: selection(for: ingredient)), fallbackLetter: ingredient.name)
                    .frame(width: 48, height: 48)
                    .background(Color.cream)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                Text(ingredient.name)
                    .font(.body(15, weight: .semibold))
                    .foregroundStyle(Color.ink)
                    .padding(.top, 12)
                Text(Pricing.money(ingredient.price))
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
                    .monospacedDigit()
                    .padding(.top, 4)
            }
            .frame(maxWidth: .infinity, minHeight: 96, alignment: .topLeading)
            .padding(16)
            .background(Color.card)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay {
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.line, lineWidth: 1)
            }
            .overlay(alignment: .topTrailing) {
                Image(systemName: "plus")
                    .font(.body(15, weight: .medium))
                    .foregroundStyle(Color.ink)
                    .frame(width: 32, height: 32)
                    .background(Color.gold)
                    .clipShape(Circle())
                    .padding(12)
                    .accessibilityHidden(true)
            }
            .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Add \(ingredient.name), \(Pricing.money(ingredient.price))")
    }
}
