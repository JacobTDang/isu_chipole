import Foundation

enum Pricing {
    static let taxRate: Decimal = 0.07

    static func itemPrice(_ sel: Selection) -> Decimal {
        let selected = sel.ingredientIds.map(Menu.ingredient)
        let extrasOnly = !selected.isEmpty && selected.allSatisfy { $0.group == .extras }
        let base = extrasOnly ? Decimal.zero : Menu.mealType(sel.mealType).basePrice
        let upcharges = selected.reduce(Decimal.zero) { $0 + $1.price }
        return rounded((base + upcharges) * Decimal(sel.quantity))
    }

    static func bagSubtotal(_ items: [BagItem]) -> Decimal {
        rounded(items.reduce(Decimal.zero) { $0 + itemPrice($1.selection) })
    }

    static func mealCount(_ items: [BagItem]) -> Int {
        items.reduce(0) { $0 + $1.selection.quantity }
    }

    static func planDiscountRate(_ plan: PlanSize, count: Int) -> Decimal {
        guard count >= plan.rawValue else { return 0 }
        switch plan {
        case .five:
            return 0
        case .seven:
            return 0.05
        case .ten:
            return 0.10
        }
    }

    static func promoRate(_ code: String?) -> Decimal {
        code?.trimmingCharacters(in: .whitespacesAndNewlines).uppercased() == "CYCLONE10"
            ? 0.10
            : 0
    }

    static func orderTotals(_ items: [BagItem], plan: PlanSize, promo: String?) -> Totals {
        let subtotalRaw = items.reduce(Decimal.zero) { $0 + itemPrice($1.selection) }
        let discountRate = planDiscountRate(plan, count: mealCount(items)) + promoRate(promo)
        let discountRaw = subtotalRaw * discountRate
        let taxRaw = (subtotalRaw - discountRaw) * taxRate
        return Totals(
            subtotal: rounded(subtotalRaw),
            discount: rounded(discountRaw),
            tax: rounded(taxRaw),
            total: rounded(subtotalRaw - discountRaw + taxRaw)
        )
    }

    static func macros(_ sel: Selection) -> (calories: Int, protein: Int) {
        let sum = sel.ingredientIds.map(Menu.ingredient).reduce(into: (calories: 0, protein: 0)) {
            $0.calories += $1.calories
            $0.protein += $1.protein
        }
        return (sum.calories * sel.quantity, sum.protein * sel.quantity)
    }

    static func money(_ d: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.numberStyle = .decimal
        formatter.positivePrefix = "$"
        formatter.negativePrefix = "-$"
        formatter.usesGroupingSeparator = true
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return formatter.string(from: NSDecimalNumber(decimal: rounded(d))) ?? "$0.00"
    }

    private static func rounded(_ value: Decimal) -> Decimal {
        NSDecimalNumber(decimal: value).rounding(
            accordingToBehavior: NSDecimalNumberHandler(
                roundingMode: .plain,
                scale: 2,
                raiseOnExactness: false,
                raiseOnOverflow: true,
                raiseOnUnderflow: true,
                raiseOnDivideByZero: true
            )
        ).decimalValue
    }
}
