import Foundation
import Testing
@testable import Andrews

@Suite(.serialized)
struct StorageTests {
    private let suiteName = "andrews.tests"

    @Test
    func roundTripsBagItems() throws {
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        let storage = Storage(defaults: defaults)
        let expected = [
            BagItem(
                id: "item-1",
                selection: Selection(
                    mealType: .bowl,
                    ingredientIds: ["white-rice", "tofu"],
                    quantity: 1,
                    name: nil,
                    presetId: nil
                )
            ),
        ]

        storage.save(expected, .bag)
        let actual: [BagItem]? = storage.load(.bag)

        #expect(actual == expected)
    }

    @Test
    func returnsNilForMissingValue() throws {
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        let storage = Storage(defaults: defaults)

        let user: User? = storage.load(.user)

        #expect(user == nil)
    }

    @Test
    func savingNilRemovesAValue() throws {
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        let storage = Storage(defaults: defaults)
        storage.save(User(email: "jordan@iastate.edu", firstName: "Jordan"), .user)

        storage.save(Optional<User>.none, .user)

        #expect(defaults.object(forKey: StorageKey.user.rawValue) == nil)
    }

    @Test
    func clearAllRemovesEveryKey() throws {
        let defaults = try #require(UserDefaults(suiteName: suiteName))
        defaults.removePersistentDomain(forName: suiteName)
        let storage = Storage(defaults: defaults)
        for key in StorageKey.allCases {
            defaults.set(Data([0x01]), forKey: key.rawValue)
        }

        storage.clearAll()

        for key in StorageKey.allCases {
            #expect(defaults.object(forKey: key.rawValue) == nil)
        }
    }
}
