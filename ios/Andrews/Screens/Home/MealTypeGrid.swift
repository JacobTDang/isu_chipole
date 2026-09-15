import SwiftUI

struct MealTypeGrid: View {
    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    private var paired: [MealType] { Array(Menu.mealTypes.dropLast()) }
    private var fullWidth: MealType? { Menu.mealTypes.last }

    var body: some View {
        VStack(spacing: 12) {
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(paired) { type in
                    tile(type)
                }
            }
            if let fullWidth {
                tile(fullWidth)
            }
        }
    }

    private func tile(_ type: MealType) -> some View {
        NavigationLink {
            BuilderView(mode: .new(type.id))
        } label: {
            Color.clear
                .frame(height: 144)
                .overlay {
                    MealImage(name: type.image, fallbackLetter: type.name)
                }
                .overlay {
                    LinearGradient(
                        stops: [
                            .init(color: Color.ink.opacity(0.8), location: 0),
                            .init(color: Color.ink.opacity(0.15), location: 0.5),
                            .init(color: .clear, location: 1),
                        ],
                        startPoint: .bottom,
                        endPoint: .top
                    )
                }
                .overlay(alignment: .bottomLeading) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(type.name)
                            .font(.display(22))
                            .foregroundStyle(Color.card)
                        Text("from \(Pricing.money(type.basePrice))")
                            .font(.body(13, weight: .semibold))
                            .foregroundStyle(Color.card.opacity(0.85))
                            .monospacedDigit()
                    }
                    .padding(12)
                }
                .cardSurface()
                .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(type.name), from \(Pricing.money(type.basePrice))")
    }
}
