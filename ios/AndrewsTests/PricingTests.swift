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
        #expect(Pricing.planDiscountRate(.five, count: 4) == 0)
        #expect(Pricing.planDiscountRate(.five, count: 5) == 0.15)
        #expect(Pricing.planDiscountRate(.seven, count: 6) == 0.15)
        #expect(Pricing.planDiscountRate(.seven, count: 7) == 0.20)
        #expect(Pricing.planDiscountRate(.ten, count: 12) == 0.25)
        #expect(Pricing.planDiscountRate(.five, count: 10) == 0.25)
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
        #expect(totals.discount == 29.75)
        #expect(totals.tax == Decimal(string: "3.87"))
        #expect(totals.total == Decimal(string: "59.12"))
    }

    @Test
    func addsUntaxedDeliveryFeeToOrderTotals() {
        var selection = bowl
        selection.quantity = 10
        let totals = Pricing.orderTotals(
            [BagItem(id: "ten", selection: selection)],
            plan: .ten,
            promo: "CYCLONE10",
            deliveryFee: Pricing.deliveryFee
        )
        #expect(totals.subtotal == 85.00)
        #expect(totals.discount == 29.75)
        #expect(totals.tax == Decimal(string: "3.87"))
        #expect(totals.delivery == Decimal(string: "2.99"))
        #expect(totals.total == Decimal(string: "62.11"))
    }

    @Test
    func pickupOrdersHaveNoDeliveryLine() {
        let totals = Pricing.orderTotals([BagItem(id: "one", selection: bowl)], plan: .five, promo: nil)
        #expect(totals.delivery == 0)
        #expect(totals.total == Decimal(string: "9.10"))
    }

    @Test
    func deliveryFeeIsTwoNinetyNine() {
        #expect(Pricing.deliveryFee == Decimal(string: "2.99"))
    }

    @Test
    func goalStatusMuscleOnTarget() {
        let status = Pricing.goalStatus(.muscle, macros: (calories: 805, protein: 59))
        #expect(status.onTarget == true)
        #expect(status.message == "On target")
    }

    @Test
    func goalStatusLoseReportsCaloriesOver() {
        let status = Pricing.goalStatus(.lose, macros: (calories: 805, protein: 59))
        #expect(status.onTarget == false)
        #expect(status.message == "305 cal over")
    }

    @Test
    func goalStatusProteinShortWinsOverCalorieMiss() {
        let status = Pricing.goalStatus(.muscle, macros: (calories: 600, protein: 30))
        #expect(status.onTarget == false)
        #expect(status.message == "15g protein short")
    }

    @Test
    func goalStatusMaintainOnTargetAtUpperBound() {
        let status = Pricing.goalStatus(.maintain, macros: (calories: 690, protein: 30))
        #expect(status.onTarget == true)
        #expect(status.message == "On target")
    }

    @Test
    func goalStatusReportsCaloriesUnder() {
        let status = Pricing.goalStatus(.muscle, macros: (calories: 515, protein: 50))
        #expect(status.onTarget == false)
        #expect(status.message == "80 cal under")
    }

    @Test
    func budgetStatusWithinBudget() {
        let status = Pricing.budgetStatus(budget: 10, price: 7.75)
        #expect(status.over == false)
        #expect(status.remaining == Decimal(string: "2.25"))
    }

    @Test
    func budgetStatusOverBudget() {
        let status = Pricing.budgetStatus(budget: 10, price: 11.50)
        #expect(status.over == true)
        #expect(status.remaining == Decimal(string: "-1.50"))
    }

    @Test
    func formatsMoneyWithTwoDecimalPlaces() {
        #expect(Pricing.money(10.25) == "$10.25")
        #expect(Pricing.money(8.5) == "$8.50")
    }

    @Test
    func sumsMacros() {
        let result = Pricing.macros(bowl)
        #expect(result.calories == 395)
        #expect(result.protein == 39)
    }

    @Test
    func sumsCycloneBowlPresetMacros() {
        let cyclone = Menu.preset("cyclone-bowl")
        let selection = Selection(
            mealType: cyclone.mealType,
            ingredientIds: cyclone.ingredientIds,
            quantity: 1,
            name: nil,
            presetId: cyclone.id
        )
        let result = Pricing.macros(selection)
        #expect(result.calories == 805)
        #expect(result.protein == 59)
    }
}
