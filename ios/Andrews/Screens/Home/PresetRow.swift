import SwiftUI

struct PresetRow: View {
    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 12) {
                ForEach(Menu.presets) { meal in
                    card(meal)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 8)
        }
        .scrollIndicators(.hidden)
    }

    private func card(_ meal: PresetMeal) -> some View {
        let selection = Selection(mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id)
        let nutrition = Pricing.macros(selection)
        return NavigationLink {
            BuilderView(mode: .preset(meal.id))
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                Color.clear
                    .frame(height: 128)
                    .overlay {
                        MealImage(name: meal.image, fallbackLetter: meal.name)
                    }
                    .clipped()

                VStack(alignment: .leading, spacing: 8) {
                    HStack(alignment: .top, spacing: 8) {
                        Text(meal.name)
                            .font(.display(19))
                            .foregroundStyle(Color.ink)
                            .multilineTextAlignment(.leading)
                        Spacer(minLength: 0)
                        Text(Pricing.money(Pricing.itemPrice(selection)))
                            .font(.body(15, weight: .semibold))
                            .foregroundStyle(Color.cardinal)
                            .monospacedDigit()
                    }
                    Text("\(nutrition.calories) cal · \(nutrition.protein)g protein")
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                }
                .padding(16)
            }
            .frame(width: 220, alignment: .leading)
            .cardSurface()
            .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }
}
