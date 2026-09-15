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
