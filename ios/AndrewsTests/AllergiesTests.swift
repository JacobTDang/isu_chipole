import Testing
@testable import Andrews

struct AllergiesTests {
    @Test
    func captionListsSelectedAllergensTheIngredientContains() {
        #expect(Allergies.caption(for: Menu.ingredient("cheese"), allergies: [.dairy]) == "Contains dairy")
        #expect(Allergies.caption(for: Menu.ingredient("ranch"), allergies: [.eggs, .dairy]) == "Contains dairy, eggs")
        #expect(Allergies.caption(for: Menu.ingredient("ranch"), allergies: [.eggs]) == "Contains eggs")
    }

    @Test
    func captionIsNilWhenNothingConflicts() {
        #expect(Allergies.caption(for: Menu.ingredient("cheese"), allergies: [.nuts]) == nil)
        #expect(Allergies.caption(for: Menu.ingredient("grilled-chicken"), allergies: Allergen.allCases) == nil)
        #expect(Allergies.caption(for: Menu.ingredient("cheese"), allergies: []) == nil)
    }

    @Test
    func removesConflictingIngredientsFromAPreset() {
        let salmon = Menu.preset("lake-laverne-salmon")

        let result = Allergies.removingConflicts(from: salmon.ingredientIds, allergies: [.dairy])

        #expect(result.kept == ["quinoa", "salmon", "broccoli", "cucumber"])
        #expect(result.banner == "We removed feta and ranch. They contain dairy.")
    }

    @Test
    func bannerNamesEveryAllergenInvolved() {
        let pesto = Menu.preset("campanile-pesto-pasta")

        let result = Allergies.removingConflicts(from: pesto.ingredientIds, allergies: [.nuts, .gluten, .dairy])

        #expect(result.kept == ["grilled-chicken", "cherry-tomatoes", "spinach"])
        #expect(result.banner == "We removed pasta, feta, and pesto. They contain dairy, gluten, and nuts.")
    }

    @Test
    func singleRemovalReadsInTheSingular() {
        let cyclone = Menu.preset("cyclone-bowl")

        let result = Allergies.removingConflicts(from: cyclone.ingredientIds, allergies: [.eggs, .dairy])

        #expect(result.kept == ["cilantro-lime-rice", "grilled-chicken", "black-beans", "corn", "corn-salsa"])
        #expect(result.banner == "We removed cheese and chipotle crema. They contain dairy.")

        let teriyaki = Menu.preset("hilton-magic-teriyaki")
        let single = Allergies.removingConflicts(from: teriyaki.ingredientIds, allergies: [.soy])
        #expect(single.kept == ["white-rice", "grilled-chicken", "broccoli", "bell-peppers"])
        #expect(single.banner == "We removed teriyaki. It contains soy.")
    }

    @Test
    func nothingRemovedMeansNoBanner() {
        let cyclone = Menu.preset("cyclone-bowl")

        let result = Allergies.removingConflicts(from: cyclone.ingredientIds, allergies: [.fish])

        #expect(result.kept == cyclone.ingredientIds)
        #expect(result.banner == nil)
    }
}
