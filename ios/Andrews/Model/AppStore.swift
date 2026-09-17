import Foundation
import Observation

enum Tab: Hashable {
    case home
    case order
    case bag
    case account
}

struct BagState: Codable, Hashable {
    var items: [BagItem]
    var plan: PlanSize
    var promo: String?
}

@MainActor
@Observable
final class AppStore {
    var user: User?
    var bag: [BagItem]
    var plan: PlanSize
    var promo: String?
    var orders: [Order]
    var saved: [Selection]
    var prefs: Preferences
    var toast: String?
    var selectedTab: Tab

    @ObservationIgnored private let storage: Storage
    @ObservationIgnored private var toastTask: Task<Void, Never>?

    init(storage: Storage = Storage()) {
        self.storage = storage
        user = storage.load(.user)
        let bagState: BagState? = storage.load(.bag)
        bag = bagState?.items ?? []
        plan = bagState?.plan ?? .five
        promo = bagState?.promo
        orders = storage.load(.orders) ?? []
        saved = storage.load(.saved) ?? []
        prefs = storage.load(.prefs) ?? Preferences()
        toast = nil
        selectedTab = .home
    }

    func signIn(email: String) {
        let trimmed = email.trimmingCharacters(in: .whitespacesAndNewlines)
        let prefix = trimmed.components(separatedBy: "@").first ?? ""
        let firstName = prefix.isEmpty
            ? "Cyclone"
            : prefix.prefix(1).uppercased() + prefix.dropFirst()
        let next = User(email: trimmed, firstName: firstName)
        user = next
        storage.save(next, .user)
    }

    func signOut() {
        user = nil
        storage.save(Optional<User>.none, .user)
    }

    func add(_ sel: Selection) {
        bag.append(BagItem(id: UUID().uuidString, selection: sel))
        persistBag()
        showToast("Added to bag.")
    }

    func update(_ id: String, _ sel: Selection) {
        guard let index = bag.firstIndex(where: { $0.id == id }) else {
            preconditionFailure("Unknown bag item: \(id)")
        }
        bag[index].selection = sel
        persistBag()
    }

    func remove(_ id: String) {
        bag.removeAll { $0.id == id }
        persistBag()
    }

    func duplicate(_ id: String) {
        guard let item = bag.first(where: { $0.id == id }) else {
            preconditionFailure("Unknown bag item: \(id)")
        }
        bag.append(BagItem(id: UUID().uuidString, selection: item.selection))
        persistBag()
    }

    func setQuantity(_ id: String, _ q: Int) {
        if q <= 0 {
            remove(id)
            return
        }
        guard 1...10 ~= q else {
            preconditionFailure("Quantity must be from 1 to 10")
        }
        guard let index = bag.firstIndex(where: { $0.id == id }) else {
            preconditionFailure("Unknown bag item: \(id)")
        }
        bag[index].selection.quantity = q
        persistBag()
    }

    func setPlan(_ p: PlanSize) {
        plan = p
        persistBag()
    }

    func setPromo(_ code: String?) {
        promo = code
        persistBag()
    }

    func replaceBag(with items: [BagItem]) {
        bag = items
        persistBag()
    }

    func clearBag() {
        bag = []
        promo = nil
        persistBag()
    }

    @discardableResult
    func placeOrder(
        fulfillment: Fulfillment,
        address: String?,
        location: PickupLocation,
        day: PickupDay,
        time: String
    ) -> Order {
        let cleanAddress = address?.trimmingCharacters(in: .whitespacesAndNewlines)
        let deliveryFee: Decimal
        switch fulfillment {
        case .pickup:
            deliveryFee = 0
        case .delivery:
            guard let cleanAddress, !cleanAddress.isEmpty else {
                preconditionFailure("Delivery orders need an address")
            }
            deliveryFee = Pricing.deliveryFee
        }
        let totals = Pricing.orderTotals(bag, plan: plan, promo: promo, deliveryFee: deliveryFee)
        let order = Order(
            id: String(format: "PP-%04d", Int.random(in: 0...9_999)),
            items: bag,
            plan: plan,
            promo: promo,
            location: location,
            day: day,
            time: time,
            fulfillment: fulfillment,
            address: fulfillment == .delivery ? cleanAddress : nil,
            deliveryFee: totals.delivery,
            subtotal: totals.subtotal,
            discount: totals.discount,
            tax: totals.tax,
            total: totals.total,
            placedAt: Date()
        )
        orders.append(order)
        storage.save(orders, .orders)
        clearBag()
        return order
    }

    func save(_ sel: Selection) {
        saved.append(sel)
        storage.save(saved, .saved)
    }

    func setPrefs(_ p: Preferences) {
        prefs = p
        storage.save(prefs, .prefs)
    }

    func resetDemoData() {
        toastTask?.cancel()
        storage.clearAll()
        user = nil
        bag = []
        plan = .five
        promo = nil
        orders = []
        saved = []
        prefs = Preferences()
        toast = nil
        selectedTab = .home
    }

    func showToast(_ message: String) {
        toastTask?.cancel()
        toast = message
        toastTask = Task { [weak self] in
            do {
                try await Task.sleep(for: .seconds(3))
            } catch {
                return
            }
            guard !Task.isCancelled else { return }
            self?.toast = nil
        }
    }

    private func persistBag() {
        storage.save(BagState(items: bag, plan: plan, promo: promo), .bag)
    }
}
