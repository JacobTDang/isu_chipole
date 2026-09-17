import Testing
@testable import Andrews

struct MenuTests {
    @Test
    func hasExpectedCatalogCounts() {
        #expect(Menu.mealTypes.count == 5)
        #expect(Menu.presets.count == 8)
        #expect(Menu.locations.count == 4)
        #expect(Menu.timeSlots.count == 7)
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
}
