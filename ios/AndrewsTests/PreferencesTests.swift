import Foundation
import Testing
@testable import Andrews

struct PreferencesTests {
    @Test
    func storedPreferencesWithoutNewFieldsLoadWithDefaults() throws {
        let json = Data(#"{"vegetarian":true,"highProtein":false,"glutenFree":true}"#.utf8)

        let prefs = try JSONDecoder().decode(Preferences.self, from: json)

        #expect(prefs.vegetarian == true)
        #expect(prefs.highProtein == false)
        #expect(prefs.glutenFree == true)
        #expect(prefs.allergies == [])
        #expect(prefs.goal == nil)
        #expect(prefs.budget == nil)
    }

    @Test
    func roundTripsNewFields() throws {
        let expected = Preferences(
            vegetarian: false,
            highProtein: true,
            glutenFree: false,
            allergies: [.dairy, .nuts],
            goal: .muscle,
            budget: 12.5
        )

        let data = try JSONEncoder().encode(expected)
        let actual = try JSONDecoder().decode(Preferences.self, from: data)

        #expect(actual == expected)
    }

    @Test
    func wrongTypeForOriginalFieldStillThrows() {
        let json = Data(#"{"vegetarian":"yes","highProtein":false,"glutenFree":false}"#.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Preferences.self, from: json)
        }
    }

    @Test
    func wrongTypeForNewFieldStillThrows() {
        let json = Data(#"{"vegetarian":false,"highProtein":false,"glutenFree":false,"budget":"ten"}"#.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Preferences.self, from: json)
        }
    }

    @Test
    func unknownAllergenThrows() {
        let json = Data(#"{"vegetarian":false,"highProtein":false,"glutenFree":false,"allergies":["peanuts"]}"#.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Preferences.self, from: json)
        }
    }

    @Test
    func missingOriginalFieldStillThrows() {
        let json = Data(#"{"vegetarian":false,"highProtein":false}"#.utf8)

        #expect(throws: DecodingError.self) {
            try JSONDecoder().decode(Preferences.self, from: json)
        }
    }
}
