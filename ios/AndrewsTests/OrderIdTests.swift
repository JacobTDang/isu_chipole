import Foundation
import Testing
@testable import Andrews

@MainActor
struct OrderIdTests {
    @Test
    func placedOrderUsesPrepPalPrefix() throws {
        let suiteName = "andrews.tests.orderid"
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        let store = AppStore(storage: Storage(defaults: defaults))

        let order = store.placeOrder(fulfillment: .pickup, address: nil, location: Menu.locations[0], day: .sunday, time: "4:30 PM")

        #expect(order.id.wholeMatch(of: /PP-\d{4}/) != nil)
    }
}
