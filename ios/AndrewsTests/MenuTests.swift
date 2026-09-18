import Testing
@testable import Andrews

struct MenuTests {
    @Test
    func hasExpectedCatalogCounts() {
        #expect(Menu.mealTypes.count == 5)
        #expect(Menu.presets.count == 8)
        #expect(Menu.locations.count == 4)
        #expect(Menu.timeSlots.count == 27)
    }

    @Test
    func timeSlotsRunEveryHalfHourFromSevenToEight() {
        #expect(Menu.timeSlots.first == "7:00 AM")
        #expect(Menu.timeSlots.last == "8:00 PM")
        #expect(Menu.timeSlots.contains("12:30 PM"))
        #expect(Menu.timeSlots.contains("4:30 PM"))
        #expect(Set(Menu.timeSlots).count == Menu.timeSlots.count)
    }

    @Test
    func pickupDaysCoverTheWholeWeekStartingSunday() {
        #expect(PickupDay.allCases.count == 7)
        #expect(PickupDay.allCases.first == .sunday)
        #expect(PickupDay.allCases.map(\.rawValue) == [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        ])
    }

    @Test
    func everyPresetIngredientResolves() {
        for preset in Menu.presets {
            for id in preset.ingredientIds {
                #expect(Menu.ingredient(id).id == id)
            }
        }
    }

    @Test
    func proteinShakeIsAnExtra() {
        #expect(Menu.ingredient("protein-shake").group == .extras)
    }

    @Test
    func cookieCarriesGlutenDairyAndEggs() {
        #expect(Menu.ingredient("cookie").allergens == [.gluten, .dairy, .eggs])
    }

    @Test
    func grilledChickenHasNoAllergens() {
        #expect(Menu.ingredient("grilled-chicken").allergens.isEmpty)
    }

    @Test
    func assignsAllergensPerContract() {
        let expected: [String: [Allergen]] = [
            "pasta": [.gluten],
            "tofu": [.soy],
            "eggs": [.eggs],
            "salmon": [.fish],
            "cheese": [.dairy],
            "sour-cream": [.dairy],
            "feta": [.dairy],
            "chipotle-crema": [.dairy],
            "buffalo": [.dairy],
            "teriyaki": [.soy, .gluten],
            "ranch": [.dairy, .eggs],
            "pesto": [.dairy, .nuts],
            "protein-shake": [.dairy],
            "cookie": [.gluten, .dairy, .eggs],
        ]
        for ingredient in Menu.ingredients {
            #expect(ingredient.allergens == (expected[ingredient.id] ?? []), "\(ingredient.id)")
        }
    }

    @Test
    func everyAllergenValueIsOneOfTheSix() {
        #expect(Allergen.allCases.count == 6)
        for ingredient in Menu.ingredients {
            for allergen in ingredient.allergens {
                #expect(Allergen.allCases.contains(allergen))
            }
        }
    }
}

struct MenuImageTests {
    @Test
    func singleAddOnUsesItsOwnPhoto() {
        let cookie = Selection(mealType: .bowl, ingredientIds: ["cookie"], quantity: 1, name: nil, presetId: nil)
        let shake = Selection(mealType: .bowl, ingredientIds: ["protein-shake"], quantity: 1, name: nil, presetId: nil)
        #expect(Menu.image(for: cookie) == "cookie")
        #expect(Menu.image(for: shake) == "protein-shake")
    }

    @Test
    func presetUsesPresetPhoto() {
        let selection = Selection(mealType: .bowl, ingredientIds: ["cilantro-lime-rice", "cookie"], quantity: 1, name: nil, presetId: "cyclone-bowl")
        #expect(Menu.image(for: selection) == "cyclone-bowl")
    }

    @Test
    func otherwiseUsesMealTypePhoto() {
        let wrap = Selection(mealType: .wrap, ingredientIds: ["mixed-greens", "tofu"], quantity: 1, name: nil, presetId: nil)
        let twoAddOns = Selection(mealType: .salad, ingredientIds: ["cookie", "protein-shake"], quantity: 1, name: nil, presetId: nil)
        let otherExtra = Selection(mealType: .pasta, ingredientIds: ["double-protein"], quantity: 1, name: nil, presetId: nil)
        #expect(Menu.image(for: wrap) == "wrap")
        #expect(Menu.image(for: twoAddOns) == "salad")
        #expect(Menu.image(for: otherExtra) == "pasta")
    }

    @Test
    func pastaBasesExcludeRice() {
        let pastaBases = Menu.ingredients(in: .base, mealType: .pasta)
        #expect(pastaBases.map(\.id) == ["pasta"])
        #expect(!pastaBases.contains { $0.id.contains("rice") })

        let bowlBases = Menu.ingredients(in: .base, mealType: .bowl)
        #expect(!bowlBases.contains { $0.id == "pasta" })
        #expect(bowlBases.contains { $0.id == "white-rice" })
    }
}
