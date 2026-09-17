import Testing
@testable import Andrews

struct OrderFilterTests {
    private let cyclone = Menu.preset("cyclone-bowl")
    private let salmon = Menu.preset("lake-laverne-salmon")

    @Test
    func inBudgetKeepsPresetsAtOrUnderTheBudget() {
        #expect(OrderFilter.inBudget.matches(cyclone, budget: 9) == true)
        #expect(OrderFilter.inBudget.matches(cyclone, budget: 8.5) == false)
        #expect(OrderFilter.inBudget.matches(salmon, budget: 10) == false)
        #expect(OrderFilter.inBudget.matches(salmon, budget: 12.25) == true)
    }

    @Test
    func otherFiltersIgnoreTheBudget() {
        #expect(OrderFilter.underTen.matches(cyclone, budget: nil) == true)
        #expect(OrderFilter.underTen.matches(salmon, budget: nil) == false)
        #expect(OrderFilter.highProtein.matches(cyclone, budget: nil) == true)
        #expect(OrderFilter.vegetarian.matches(cyclone, budget: nil) == false)
    }

    @Test
    func inBudgetChipAppearsOnlyWithABudget() {
        #expect(OrderFilter.available(budget: nil) == [.highProtein, .vegetarian, .underTen])
        #expect(OrderFilter.available(budget: 10) == [.highProtein, .vegetarian, .underTen, .inBudget])
    }
}
