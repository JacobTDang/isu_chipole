import SwiftUI

struct PillButton: View {
    let label: String
    let price: Decimal?
    let veg: Bool
    let selected: Bool
    let disabled: Bool
    let caption: String?
    let action: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// - Parameters:
    ///   - disabled: Greys the pill out and ignores taps.
    ///   - caption: A small line under the label, such as "Contains dairy".
    init(
        label: String,
        price: Decimal?,
        veg: Bool,
        selected: Bool,
        disabled: Bool = false,
        caption: String? = nil,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.price = price
        self.veg = veg
        self.selected = selected
        self.disabled = disabled
        self.caption = caption
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
                VStack(alignment: .leading, spacing: 1) {
                    Text(label)
                        .font(.body(15, weight: .semibold))
                        .foregroundStyle(Color.ink)
                    if let caption {
                        Text(caption)
                            .font(.body(11, weight: .semibold))
                            .foregroundStyle(Color.cardinal)
                    }
                }
                if let price, price > 0 {
                    Text("+\(Pricing.money(price))")
                        .font(.body(13, weight: .semibold))
                        .foregroundStyle(Color.cardinal)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, caption == nil ? 0 : 6)
            .frame(minHeight: 44)
            .background(selected ? Color.gold : Color.cream)
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(selected ? Color.cardinal : Color.line, lineWidth: selected ? 1.5 : 1)
            }
            .scaleEffect(selected ? 1 : 0.96)
            .opacity(disabled ? 0.45 : 1)
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .animation(reduceMotion ? nil : .spring(duration: 0.12), value: selected)
    }
}
