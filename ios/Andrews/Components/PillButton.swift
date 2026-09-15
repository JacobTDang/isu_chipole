import SwiftUI

struct PillButton: View {
    let label: String
    let price: Decimal?
    let veg: Bool
    let selected: Bool
    let action: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(
        label: String,
        price: Decimal?,
        veg: Bool,
        selected: Bool,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.price = price
        self.veg = veg
        self.selected = selected
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 7) {
                if veg {
                    Circle()
                        .fill(Color.veg)
                        .frame(width: 7, height: 7)
                        .accessibilityHidden(true)
                }
                Text(label)
                    .font(.body(15, weight: .semibold))
                    .foregroundStyle(Color.ink)
                if let price, price > 0 {
                    Text("+\(Pricing.money(price))")
                        .font(.body(13, weight: .semibold))
                        .foregroundStyle(Color.cardinal)
                }
            }
            .padding(.horizontal, 14)
            .frame(minHeight: 44)
            .background(selected ? Color.gold : Color.cream)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(selected ? Color.cardinal : Color.line, lineWidth: selected ? 1.5 : 1)
            }
            .scaleEffect(selected ? 1 : 0.96)
        }
        .buttonStyle(.plain)
        .animation(reduceMotion ? nil : .spring(duration: 0.12), value: selected)
    }
}
