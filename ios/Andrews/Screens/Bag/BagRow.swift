import SwiftUI

struct BagRow: View {
    @Environment(AppStore.self) private var store

    let item: BagItem

    init(item: BagItem) {
        self.item = item
    }

    private var type: MealType {
        Menu.mealType(item.selection.mealType)
    }

    private var preset: PresetMeal? {
        item.selection.presetId.map(Menu.preset)
    }

    private var title: String {
        item.selection.name ?? preset?.name ?? "Custom \(type.name)"
    }

    private var image: String {
        Menu.image(for: item.selection)
    }

    private var summary: String {
        item.selection.ingredientIds.map { Menu.ingredient($0).name }.joined(separator: ", ")
    }

    private var unitPrice: Decimal {
        var single = item.selection
        single.quantity = 1
        return Pricing.itemPrice(single)
    }

    private var quantity: Binding<Int> {
        Binding(
            get: { item.selection.quantity },
            set: { store.setQuantity(item.id, $0) }
        )
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 12) {
                MealImage(name: image, fallbackLetter: title)
                    .frame(width: 80, height: 80)
                    .background(Color.cream)
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 4) {
                    HStack(alignment: .top, spacing: 8) {
                        Text(title)
                            .font(.display(19))
                            .foregroundStyle(Color.ink)
                            .lineLimit(2)
                        Spacer(minLength: 0)
                        Text(Pricing.money(unitPrice))
                            .font(.body(15, weight: .semibold))
                            .foregroundStyle(Color.cardinal)
                            .monospacedDigit()
                            .fixedSize()
                    }
                    Text(summary)
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                        .lineLimit(1)
                        .truncationMode(.tail)
                }
            }

            HStack(spacing: 8) {
                QuantityStepper(value: quantity, range: 1...10)
                    .accessibilityLabel("Quantity for \(title)")
                Spacer(minLength: 0)
                NavigationLink {
                    BuilderView(mode: .edit(item.id))
                } label: {
                    actionLabel("Edit")
                }
                .buttonStyle(.plain)
                Button {
                    store.duplicate(item.id)
                } label: {
                    actionLabel("Duplicate")
                }
                .buttonStyle(.plain)
                Button(role: .destructive) {
                    store.remove(item.id)
                } label: {
                    actionLabel("Remove")
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 20)
        .background(Color.card)
    }

    private func actionLabel(_ text: String) -> some View {
        Text(text)
            .font(.body(15, weight: .semibold))
            .foregroundStyle(Color.cardinal)
            .padding(.horizontal, 12)
            .frame(minHeight: 44)
            .contentShape(Rectangle())
    }
}
