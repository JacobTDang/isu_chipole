import XCTest

final class FlowTests: XCTestCase {
    private static let screenshotDirectory = URL(
        fileURLWithPath: "/Users/jacobdang/Desktop/projects/isu_chipole/docs/superpowers/screenshots/ios",
        isDirectory: true
    )

    private let timeout: TimeInterval = 5
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = true
        try FileManager.default.createDirectory(
            at: Self.screenshotDirectory,
            withIntermediateDirectories: true
        )
        app = XCUIApplication()
        app.launch()
    }

    func testFullWalkthrough() throws {
        resetIfSignedIn()

        step("login") {
            let email = try require(app.textFields["you@iastate.edu"], "ISU email field")
            snap("01-login")
            email.tap()
            email.typeText("jordan@iastate.edu")
            try require(app.buttons["Sign in"], "Sign in button").tap()
        }

        step("home") {
            try selectTab("Home")
            try require(app.staticTexts["Hey, Jordan"], "Hey, Jordan title")
            settle()
            snap("02-home")
        }

        step("settings") {
            try selectTab("Account")
            try require(app.staticTexts["Account"], "Account title")
            try setToggle("No budget", to: false)
            try require(app.staticTexts["$10.00 per meal"], "$10.00 per meal after enabling the budget")
            for _ in 0..<4 {
                try incrementBudget()
            }
            try require(app.staticTexts["$12.00 per meal"], "$12.00 per meal after four steps")
            try setToggle("Dairy", to: true)
            settle()
            snap("09-account-settings")
        }

        step("order") {
            try selectTab("Order")
            try require(app.staticTexts["Order"], "Order title")
            try require(app.buttons["In budget"], "In budget chip")
            settle()
            snap("03-order")
        }

        step("build") {
            try require(app.staticTexts["Build your own bowl"], "Build your own bowl card").tap()
            try require(app.staticTexts["Base"], "Base section")
            settle()
            try tapPill("Cilantro-lime rice")
            try tapPill("Grilled chicken")
            try tapPill("Guac")
            try require(staticText(containing: "$10.25"), "ticket price $10.25")
            let cheese = try require(app.buttons.matching(labelBeginsWith: "Cheese").firstMatch, "Cheese pill")
            guard cheese.label.contains("Contains dairy") else {
                throw MissingElement(description: "Contains dairy caption on the Cheese pill, found \(cheese.label)")
            }
            guard !cheese.isEnabled else {
                throw MissingElement(description: "disabled Cheese pill")
            }
            try require(staticText(containing: "left"), "budget line with an amount left")
            settle()
            snap("04-build")
            try require(app.buttons["Add to bag"], "Add to bag button").tap()
        }

        step("bag") {
            try selectTab("Bag")
            try require(app.staticTexts["Bag"], "Bag title")
            let plus = try require(app.buttons["Increase quantity"], "Increase quantity button")
            try scrollListUntilHittable(plus, "Increase quantity button")
            for _ in 0..<6 {
                plus.tap()
                settle(0.3)
            }
            try require(app.staticTexts["$71.75"], "subtotal for 7 meals")
            try require(app.buttons.matching(labelContains: "Meals this week").firstMatch, "Meals this week card").tap()
            try require(app.buttons.matching(labelBeginsWith: "7 meals").firstMatch, "7 meals row").tap()
            try require(staticText(containing: "Plan discount"), "Plan discount line")
            settle()
            snap("05-bag")
        }

        step("checkout") {
            try require(app.buttons["Check out"], "Check out button").tap()
            try require(app.staticTexts["Checkout"], "Checkout title")
            try require(app.buttons["Delivery"], "Delivery segment").tap()
            let placeOrder = try require(app.buttons["Place order"], "Place order button")
            guard !placeOrder.isEnabled else {
                throw MissingElement(description: "disabled Place order button before an address is entered")
            }
            let address = try require(app.textFields["Friley Hall, room 2310"], "Deliver to field")
            address.tap()
            address.typeText("Friley Hall, room 2310\n")
            try require(app.staticTexts["Delivery day"], "Delivery day label")
            let promo = try require(app.textFields["Enter code"], "promo field")
            scrollIntoView(promo, bottomInset: 340)
            promo.tap()
            promo.typeText("CYCLONE10")
            try require(app.buttons["Apply"], "Apply button").tap()
            try require(staticText(containing: "Promo"), "Promo line")
            try require(app.staticTexts["Delivery"], "Delivery ticket line")
            try require(staticText(containing: "$56.73"), "total $56.73")
            settle()
            snap("06-checkout")
        }

        step("confirmation") {
            let placeOrder = try require(app.buttons["Place order"], "Place order button")
            guard placeOrder.isEnabled else {
                throw MissingElement(description: "enabled Place order button after entering an address")
            }
            placeOrder.tap()
            try require(app.staticTexts["See you Sunday."], "See you Sunday.")
            try require(app.staticTexts["Deliver to"], "Deliver to ticket line")
            try require(app.staticTexts["Friley Hall, room 2310"], "delivery address on the ticket")
            try require(app.staticTexts["Arrives at 4:30 PM"], "Arrives at 4:30 PM")
            try require(app.staticTexts["$56.73"], "total $56.73")
            settle()
            snap("07-confirmation")
            try require(app.buttons["Back to home"], "Back to home button").tap()
        }

        step("account") {
            try selectTab("Account")
            try require(app.staticTexts["Account"], "Account title")
            scrollListToTop()
            try require(app.staticTexts["56 pts"], "56 pts")
            settle()
            snap("08-account")
        }
    }

    // MARK: - Flow helpers

    /// A previous run may have left the app signed in with orders and points
    /// from that run. Resetting the demo data clears storage, signs out and
    /// returns the tab selection to Home, so every run starts from Login with
    /// identical state. The Account list is lazy, so the Demo section only
    /// exists once scrolled to; swipe until the row is both present and
    /// hittable before touching it, then let the list stop moving so the tap
    /// cannot land on the neighbouring "Sign out" row.
    private func resetIfSignedIn() {
        let accountTab = app.tabBars.buttons["Account"]
        guard accountTab.waitForExistence(timeout: timeout) else { return }
        step("reset") {
            try selectTab("Account")
            try require(app.staticTexts["Account"], "Account title")
            let reset = app.buttons["Reset demo data"]
            var attempts = 0
            while !(reset.exists && reset.isHittable) && attempts < 8 {
                app.swipeUp(velocity: .slow)
                settle(0.6)
                attempts += 1
            }
            settle(1)
            guard reset.exists && reset.isHittable else {
                throw MissingElement(description: "hittable Reset demo data button")
            }
            reset.tap()
            try require(app.textFields["you@iastate.edu"], "login screen after reset")
        }
    }

    /// Taps a tab and confirms it took: a tap during the tab bar's appearance
    /// animation can be dropped, which would leave the flow on the wrong tab.
    private func selectTab(_ name: String) throws {
        let tab = try tabButton(name)
        var attempts = 0
        while !tab.isSelected && attempts < 3 {
            tab.tap()
            settle(0.5)
            attempts += 1
        }
        guard tab.isSelected else {
            throw MissingElement(description: "selected \(name) tab")
        }
    }

    private func tabButton(_ name: String) throws -> XCUIElement {
        let inTabBar = app.tabBars.buttons[name]
        if inTabBar.waitForExistence(timeout: timeout) {
            return inTabBar
        }
        return try require(app.buttons[name], "\(name) tab")
    }

    /// Account rows live in a lazy list, so a row only exists once scrolled
    /// to. The switch sits at the trailing edge of its row; tapping there
    /// flips it, where a tap on the label would not.
    private func setToggle(_ label: String, to enabled: Bool) throws {
        let toggle = app.switches[label]
        try scrollListUntilHittable(toggle, "\(label) toggle")
        let target = enabled ? "1" : "0"
        guard (toggle.value as? String) != target else { return }
        toggle.coordinate(withNormalizedOffset: CGVector(dx: 0.94, dy: 0.5)).tap()
        settle(0.5)
        guard (toggle.value as? String) == target else {
            throw MissingElement(description: "\(label) toggle switched \(enabled ? "on" : "off")")
        }
    }

    /// SwiftUI derives the stepper buttons' identifiers from the stepper's
    /// own, so the plus button is "budget-stepper-Increment".
    private func incrementBudget() throws {
        let stepper = app.steppers["budget-stepper"]
        try scrollListUntilHittable(stepper, "budget stepper")
        try require(stepper.buttons["budget-stepper-Increment"], "budget stepper increment button").tap()
        settle(0.3)
    }

    /// The Account tab keeps its scroll position between visits, so the
    /// rewards card at the top may be offscreen after changing settings.
    private func scrollListToTop() {
        var attempts = 0
        while !app.staticTexts["Rewards"].isHittable && attempts < 8 {
            app.swipeDown(velocity: .fast)
            settle(0.5)
            attempts += 1
        }
        settle(0.6)
    }

    /// The lazy list only holds rows near the viewport, so a row that has
    /// scrolled off in either direction does not exist: search downwards
    /// first, then back up. A row under the translucent navigation bar or
    /// tab bar still reports as hittable, so after the row exists, nudge it
    /// into the clear band.
    private func scrollListUntilHittable(_ element: XCUIElement, _ description: String) throws {
        var attempts = 0
        while !element.exists && attempts < 8 {
            app.swipeUp(velocity: .slow)
            settle(0.6)
            attempts += 1
        }
        attempts = 0
        while !element.exists && attempts < 8 {
            app.swipeDown(velocity: .slow)
            settle(0.6)
            attempts += 1
        }
        let topInset: CGFloat = 130
        let bottomInset: CGFloat = 140
        func isInBand() -> Bool {
            let frame = element.frame
            return frame.minY >= topInset && frame.maxY <= app.frame.height - bottomInset
        }
        attempts = 0
        while element.exists && !isInBand() && attempts < 8 {
            let delta: CGFloat = element.frame.minY < topInset ? 0.2 : -0.2
            let start = app.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.5))
            let end = app.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: 0.5 + delta))
            start.press(forDuration: 0.1, thenDragTo: end, withVelocity: .slow, thenHoldForDuration: 0.2)
            settle(0.6)
            attempts += 1
        }
        settle(0.6)
        guard element.exists && element.isHittable && isInBand() else {
            throw MissingElement(description: "hittable \(description)")
        }
    }

    private func tapPill(_ name: String) throws {
        let pill = try require(app.buttons.matching(labelBeginsWith: name).firstMatch, "\(name) pill")
        scrollIntoView(pill)
        pill.tap()
        settle(0.3)
    }

    private func staticText(containing text: String) -> XCUIElement {
        app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", text)).firstMatch
    }

    /// Scrolls until the element sits in the band between the navigation bar and
    /// the sticky bottom bar. Drags run along the right-edge gutter, where no
    /// control lives, so scrolling never presses a pill or button on the way.
    private func scrollIntoView(_ element: XCUIElement, bottomInset: CGFloat = 240) {
        let screen = app.frame
        func isInBand() -> Bool {
            let frame = element.frame
            return frame.minY >= 120 && frame.maxY <= screen.height - bottomInset
        }
        var attempts = 0
        while !isInBand() && attempts < 8 {
            dragUp(bottomInset: bottomInset)
            attempts += 1
        }
    }

    private func dragUp(bottomInset: CGFloat) {
        let startY = min(0.7, 1 - (bottomInset / app.frame.height) - 0.08)
        let start = app.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: startY))
        let end = app.coordinate(withNormalizedOffset: CGVector(dx: 0.98, dy: max(0.15, startY - 0.4)))
        start.press(forDuration: 0.1, thenDragTo: end, withVelocity: .default, thenHoldForDuration: 0.2)
        settle(0.4)
    }

    private func settle(_ seconds: TimeInterval = 0.8) {
        RunLoop.current.run(until: Date(timeIntervalSinceNow: seconds))
    }

    // MARK: - Failure handling

    private struct MissingElement: Error {
        let description: String
    }

    private func step(_ name: String, _ body: () throws -> Void) {
        do {
            try body()
        } catch let missing as MissingElement {
            snap("zz-\(name)-missing")
            XCTFail("Step \(name): could not find \(missing.description)")
        } catch {
            snap("zz-\(name)-missing")
            XCTFail("Step \(name): \(error)")
        }
    }

    @discardableResult
    private func require(_ element: XCUIElement, _ description: String) throws -> XCUIElement {
        guard element.waitForExistence(timeout: timeout) else {
            throw MissingElement(description: description)
        }
        return element
    }

    private func snap(_ name: String) {
        let data = XCUIScreen.main.screenshot().pngRepresentation
        let url = Self.screenshotDirectory.appendingPathComponent("\(name).png")
        do {
            try data.write(to: url)
        } catch {
            XCTFail("Could not write screenshot \(name): \(error)")
        }
    }
}

private extension XCUIElementQuery {
    func matching(labelContains text: String) -> XCUIElementQuery {
        matching(NSPredicate(format: "label CONTAINS %@", text))
    }

    func matching(labelBeginsWith text: String) -> XCUIElementQuery {
        matching(NSPredicate(format: "label BEGINSWITH %@", text))
    }
}
