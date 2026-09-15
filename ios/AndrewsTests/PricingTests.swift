import Foundation
import Testing
@testable import Andrews

struct PricingTests {
    private let bowl = Selection(
        mealType: .bowl,
        ingredientIds: ["cilantro-lime-rice", "grilled-chicken"],
        quantity: 1,
        name: nil,
        presetId: nil
    )

    @Test
    func pricesABasicBowl() {
        #expect(Pricing.itemPrice(bowl) == 8.50)
    }

    @Test
    func multipliesByQuantity() {
        var selection = bowl
        selection.quantity = 2
        #expect(Pricing.itemPrice(selection) == 17)
    }

    @Test
    func addsIngredientUpcharges() {
        var selection = bowl
        selection.ingredientIds.append("guac")
        #expect(Pricing.itemPrice(selection) == 10.25)
    }

    @Test
    func pricesAnExtrasOnlyItemWithoutAMealBase() {
        let selection = Selection(
            mealType: .bowl,
            ingredientIds: ["protein-shake"],
            quantity: 1,
            name: nil,
            presetId: nil
        )
        #expect(Pricing.itemPrice(selection) == 3.50)
    }

    @Test
    func calculatesBagSubtotalAndMealCount() {
        var selection = bowl
        selection.quantity = 2
        let items = [BagItem(id: "one", selection: selection)]
        #expect(Pricing.bagSubtotal(items) == 17)
        #expect(Pricing.mealCount(items) == 2)
    }

    @Test
    func appliesPlanDiscountsOnlyWhenFilled() {
        #expect(Pricing.planDiscountRate(.seven, count: 6) == 0)
        #expect(Pricing.planDiscountRate(.seven, count: 7) == 0.05)
        #expect(Pricing.planDiscountRate(.ten, count: 12) == 0.10)
    }

    @Test
    func recognizesPromoCodeCaseInsensitively() {
        #expect(Pricing.promoRate("cyclone10") == 0.10)
        #expect(Pricing.promoRate("nope") == 0)
    }

    @Test
    func calculatesOrderTotals() {
        var selection = bowl
        selection.quantity = 10
        let totals = Pricing.orderTotals(
            [BagItem(id: "ten", selection: selection)],
            plan: .ten,
            promo: "CYCLONE10"
        )
        #expect(totals.subtotal == 85.00)
        #expect(totals.discount == 17.00)
        #expect(totals.tax == Decimal(string: "4.76"))
        #expect(totals.total == Decimal(string: "72.76"))
    }

    @Test
    func formatsMoneyWithTwoDecimalPlaces() {
        #expect(Pricing.money(10.25) == "$10.25")
        #expect(Pricing.money(8.5) == "$8.50")
    }

    @Test
    func sumsMacros() {
        let result = Pricing.macros(bowl)
        #expect(result.calories == 440)
        #expect(result.protein == 47)
    }
}
