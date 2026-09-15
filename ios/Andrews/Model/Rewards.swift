import Foundation

enum Rewards {
    static func points(_ orders: [Order]) -> Int {
        let total = orders.reduce(Decimal.zero) { $0 + $1.total }
        var rounded = Decimal.zero
        var value = total
        NSDecimalRound(&rounded, &value, 0, .down)
        return NSDecimalNumber(decimal: rounded).intValue
    }

    static func tier(_ points: Int) -> (name: String, nextName: String?, nextAt: Int?) {
        if points >= 1_500 {
            return ("Gold", nil, nil)
        }
        if points >= 500 {
            return ("Cardinal", "Gold", 1_500)
        }
        return ("Cyclone", "Cardinal", 500)
    }
}
