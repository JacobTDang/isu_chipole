import Foundation
import Testing
@testable import Andrews

struct OrderTests {
    @Test
    func storedOrdersWithoutFulfillmentLoadAsPickup() throws {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "date":"2026-09-20","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0}
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
            date: "2026-09-23",
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
    func roundTripsTheCalendarDate() throws {
        let expected = Order(
            id: "PP-0003",
            items: [],
            plan: .five,
            promo: nil,
            location: Menu.locations[0],
            date: "2026-09-24",
            time: "7:00 AM",
            fulfillment: .pickup,
            address: nil,
            deliveryFee: 0,
            subtotal: 10,
            discount: 0,
            tax: Decimal(string: "0.70") ?? 0,
            total: Decimal(string: "10.70") ?? 0,
            placedAt: Date(timeIntervalSince1970: 0)
        )

        let data = try JSONEncoder().encode(expected)
        let actual = try JSONDecoder().decode(Order.self, from: data)

        #expect(actual == expected)
        #expect(actual.date == "2026-09-24")
        #expect(String(decoding: data, as: UTF8.self).contains("\"date\":\"2026-09-24\""))
    }

    /// Orders stored before calendar dates carry a weekday; they load with the
    /// first date on or after the day they were placed that falls on it.
    @Test
    func legacyDayMigratesToTheNextMatchingDate() throws {
        let placedAt = try #require(Calendar.current.date(from: DateComponents(year: 2026, month: 9, day: 18, hour: 10)))
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "day":"Sunday","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,
         "placedAt":\(placedAt.timeIntervalSinceReferenceDate)}
        """.utf8)

        let order = try JSONDecoder().decode(Order.self, from: json)

        #expect(order.date == "2026-09-20")
    }

    @Test
    func legacyDayOnItsOwnWeekdayKeepsThePlacedDate() throws {
        let placedAt = try #require(Calendar.current.date(from: DateComponents(year: 2026, month: 9, day: 18, hour: 10)))
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "day":"Friday","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,
         "placedAt":\(placedAt.timeIntervalSinceReferenceDate)}
        """.utf8)

        let order = try JSONDecoder().decode(Order.self, from: json)

        #expect(order.date == "2026-09-18")
    }

    @Test
    func unknownLegacyDayThrows() {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "day":"Funday","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0}
        """.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Order.self, from: json)
        }
    }

    @Test
    func malformedDateThrows() {
        for date in ["2026-02-30", "Thursday", "2026-9-4", ""] {
            let json = Data("""
            {"id":"PP-0001","items":[],"plan":5,"promo":null,
             "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
             "date":"\(date)","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0}
            """.utf8)

            #expect(throws: DecodingError.self, "\(date)") {
                try JSONDecoder().decode(Order.self, from: json)
            }
        }
    }

    @Test
    func missingDateAndDayThrows() {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0}
        """.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Order.self, from: json)
        }
    }

    @Test
    func wrongFulfillmentValueThrows() {
        let json = Data("""
        {"id":"PP-0001","items":[],"plan":5,"promo":null,
         "location":{"id":"memorial-union","name":"Memorial Union","note":"Main Lounge entrance"},
         "date":"2026-09-20","time":"4:30 PM","subtotal":10,"discount":0,"tax":0.7,"total":10.7,"placedAt":0,
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
            date: "2026-09-20",
            time: "4:30 PM"
        )

        #expect(order.fulfillment == .delivery)
        #expect(order.date == "2026-09-20")
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
            date: "2026-09-23",
            time: "5:00 PM"
        )

        #expect(order.fulfillment == .pickup)
        #expect(order.address == nil)
        #expect(order.deliveryFee == 0)
        #expect(order.total == Decimal(string: "9.10"))
        #expect(order.location == Menu.locations[1])
    }
}
