import Foundation
import Testing
@testable import Andrews

struct OrderTests {
    @Test
    func storedOrdersWithoutFulfillmentLoadAsPickup() throws {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "day":"Sunday","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0}
        """.utf8)

        let order = try JSONDecoder().decode(Order.self, from: json)

        #expect(order.fulfillment == .pickup)
        #expect(order.address == nil)
        #expect(order.deliveryFee == 0)
        #expect(order.total == Decimal(string: "10.7"))
    }

    @Test
    func roundTripsDeliveryOrders() throws {
        let expected = Order(
            id: "PP-0002",
            items: [],
            plan: .five,
            promo: nil,
            location: Menu.locations[0],
            day: .wednesday,
            time: "5:00 PM",
            fulfillment: .delivery,
            address: "Friley Hall, room 2310",
            deliveryFee: Pricing.deliveryFee,
            subtotal: 10,
            discount: 0,
            tax: Decimal(string: "0.70") ?? 0,
            total: Decimal(string: "13.69") ?? 0,
            placedAt: Date(timeIntervalSince1970: 0)
        )

        let data = try JSONEncoder().encode(expected)
        let actual = try JSONDecoder().decode(Order.self, from: data)

        #expect(actual == expected)
    }

    @Test
    func wrongFulfillmentValueThrows() {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "day":"Sunday","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0,
         "fulfillment":"drone"}
        """.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Order.self, from: json)
        }
    }
}

@MainActor
struct PlaceOrderTests {
    private func freshStore(_ suiteName: String) throws -> AppStore {
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        return AppStore(storage: Storage(defaults: defaults))
    }

    private var bowl: Selection {
        Selection(mealType: .bowl, ingredientIds: ["cilantro-lime-rice", "grilled-chicken"], quantity: 1)
    }

    @Test
    func deliveryOrderStoresAddressAndFee() throws {
        let store = try freshStore("andrews.tests.delivery")
        store.add(bowl)

        let order = store.placeOrder(
            fulfillment: .delivery,
            address: "Friley Hall, room 2310",
            location: Menu.locations[0],
            day: .sunday,
            time: "4:30 PM"
        )

        #expect(order.fulfillment == .delivery)
        #expect(order.address == "Friley Hall, room 2310")
        #expect(order.deliveryFee == Decimal(string: "2.99"))
        #expect(order.total == Decimal(string: "12.09"))
    }

    @Test
    func pickupOrderHasNoFee() throws {
        let store = try freshStore("andrews.tests.pickup")
        store.add(bowl)

        let order = store.placeOrder(
            fulfillment: .pickup,
            address: nil,
            location: Menu.locations[1],
            day: .wednesday,
            time: "5:00 PM"
        )

        #expect(order.fulfillment == .pickup)
        #expect(order.address == nil)
        #expect(order.deliveryFee == 0)
        #expect(order.total == Decimal(string: "9.10"))
        #expect(order.location == Menu.locations[1])
    }
}
