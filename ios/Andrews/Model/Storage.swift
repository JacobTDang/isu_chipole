import Foundation

enum StorageKey: String, CaseIterable {
    case user = "andrews.user"
    case bag = "andrews.bag"
    case orders = "andrews.orders"
    case saved = "andrews.saved"
    case prefs = "andrews.prefs"
}

struct Storage {
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func load<T: Decodable>(_ key: StorageKey) -> T? {
        guard let data = defaults.data(forKey: key.rawValue) else { return nil }
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            preconditionFailure("andrews storage: \(key.rawValue) is invalid: \(error)")
        }
    }

    func save<T: Encodable>(_ value: T?, _ key: StorageKey) {
        guard let value else {
            defaults.removeObject(forKey: key.rawValue)
            return
        }
        do {
            defaults.set(try JSONEncoder().encode(value), forKey: key.rawValue)
        } catch {
            preconditionFailure("andrews storage: \(key.rawValue) could not be encoded: \(error)")
        }
    }

    func clearAll() {
        for key in StorageKey.allCases {
            defaults.removeObject(forKey: key.rawValue)
        }
    }
}
