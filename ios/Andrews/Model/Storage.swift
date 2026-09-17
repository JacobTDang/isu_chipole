import Foundation

enum StorageKey: String, CaseIterable {
    case user = "preppal.user"
    case bag = "preppal.bag"
    case orders = "preppal.orders"
    case saved = "preppal.saved"
    case prefs = "preppal.prefs"

    var legacyRawValue: String {
        switch self {
        case .user: return "andrews.user"
        case .bag: return "andrews.bag"
        case .orders: return "andrews.orders"
        case .saved: return "andrews.saved"
        case .prefs: return "andrews.prefs"
        }
    }
}

struct Storage {
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func load<T: Decodable>(_ key: StorageKey) -> T? {
        guard let data = defaults.data(forKey: key.rawValue) ?? defaults.data(forKey: key.legacyRawValue) else { return nil }
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            preconditionFailure("preppal storage: \(key.rawValue) is invalid: \(error)")
        }
    }

    func save<T: Encodable>(_ value: T?, _ key: StorageKey) {
        guard let value else {
            defaults.removeObject(forKey: key.rawValue)
            defaults.removeObject(forKey: key.legacyRawValue)
            return
        }
        do {
            defaults.set(try JSONEncoder().encode(value), forKey: key.rawValue)
        } catch {
            preconditionFailure("preppal storage: \(key.rawValue) could not be encoded: \(error)")
        }
    }

    func clearAll() {
        for key in StorageKey.allCases {
            defaults.removeObject(forKey: key.rawValue)
            defaults.removeObject(forKey: key.legacyRawValue)
        }
    }
}
