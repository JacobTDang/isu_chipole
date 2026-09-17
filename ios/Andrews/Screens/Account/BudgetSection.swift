import SwiftUI

struct BudgetSection: View {
    @Environment(AppStore.self) private var store

    private static let minimum: Decimal = 6
    private static let maximum: Decimal = 20
    private static let step: Decimal = 0.5
    private static let starting: Decimal = 10

    private var budget: Decimal? {
        store.prefs.budget
    }

    private var stepperValue: Binding<Double> {
        Binding(
            get: { NSDecimalNumber(decimal: budget ?? Self.starting).doubleValue },
            set: { next in
                var prefs = store.prefs
                prefs.budget = min(max(Decimal(next), Self.minimum), Self.maximum)
                store.setPrefs(prefs)
            }
        )
    }

    private var noBudget: Binding<Bool> {
        Binding(
            get: { budget == nil },
            set: { disabled in
                var prefs = store.prefs
                prefs.budget = disabled ? nil : Self.starting
                store.setPrefs(prefs)
            }
        )
    }

    private var summary: String {
        guard let budget else { return "No budget" }
        return "\(Pricing.money(budget)) per meal"
    }

    var body: some View {
        Stepper(
            value: stepperValue,
            in: NSDecimalNumber(decimal: Self.minimum).doubleValue...NSDecimalNumber(decimal: Self.maximum).doubleValue,
            step: NSDecimalNumber(decimal: Self.step).doubleValue
        ) {
            Text(summary)
                .font(.body(17))
                .foregroundStyle(Color.ink)
                .monospacedDigit()
        }
        .tint(.cardinal)
        .disabled(budget == nil)
        .frame(minHeight: 44)
        .listRowBackground(Color.card)
        .accessibilityIdentifier("budget-stepper")

        Toggle(isOn: noBudget) {
            Text("No budget")
                .font(.body(17))
                .foregroundStyle(Color.ink)
        }
        .tint(.cardinal)
        .frame(minHeight: 44)
        .listRowBackground(Color.card)
    }
}
