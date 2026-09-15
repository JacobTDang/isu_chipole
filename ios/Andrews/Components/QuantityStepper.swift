import SwiftUI

struct QuantityStepper: View {
    @Binding private var value: Int
    private let range: ClosedRange<Int>

    init(value: Binding<Int>, range: ClosedRange<Int>) {
        _value = value
        self.range = range
    }

    var body: some View {
        HStack(spacing: 2) {
            stepButton(systemName: "minus", disabled: value <= range.lowerBound) {
                value -= 1
            }

            Text("\(value)")
                .font(.body(15, weight: .semibold))
                .foregroundStyle(Color.ink)
                .frame(minWidth: 32)
                .monospacedDigit()
                .accessibilityLabel("Quantity \(value)")

            stepButton(systemName: "plus", disabled: value >= range.upperBound) {
                value += 1
            }
        }
        .background(Color.card)
        .clipShape(Capsule())
        .overlay {
            Capsule().stroke(Color.line, lineWidth: 1)
        }
    }

    private func stepButton(
        systemName: String,
        disabled: Bool,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            Image(systemName: systemName)
                .font(.body(14, weight: .semibold))
                .foregroundStyle(Color.cardinal)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .opacity(disabled ? 0.35 : 1)
    }
}
