import Foundation
import Testing
@testable import Andrews

struct RewardsTests {
    @Test
    func startsAtZeroPoints() {
        #expect(Rewards.points([]) == 0)
    }

    @Test
    func floorsTotalDollarsSpent() {
        #expect(Rewards.points([order(total: "72.76"), order(total: "40.10")]) == 112)
    }

    @Test
    func returnsCycloneTier() {
        let value = Rewards.tier(0)
        #expect(value.name == "Cyclone")
        #expect(value.nextName == "Cardinal")
        #expect(value.nextAt == 500)
    }

    @Test
    func returnsCardinalTier() {
        let value = Rewards.tier(500)
        #expect(value.name == "Cardinal")
        #expect(value.nextName == "Gold")
        #expect(value.nextAt == 1500)
    }

    @Test
    func returnsGoldTier() {
        let value = Rewards.tier(1500)
        #expect(value.name == "Gold")
        #expect(value.nextName == nil)
        #expect(value.nextAt == nil)
    }

    private func order(total: String) -> Order {
        Order(
            id: "PP-1234",
            items: [],
            plan: .five,
            promo: nil,
            location: Menu.locations[0],
            date: "2026-09-20",
            time: "4:30 PM",
            fulfillment: .pickup,
            address: nil,
            deliveryFee: 0,
            subtotal: Decimal(string: total) ?? 0,
            discount: 0,
            tax: 0,
            total: Decimal(string: total) ?? 0,
            placedAt: Date(timeIntervalSince1970: 0)
        )
    }
}
