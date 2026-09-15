import SwiftUI

struct PreferencesSection: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        preferenceToggle("Vegetarian", keyPath: \.vegetarian)
        preferenceToggle("High protein", keyPath: \.highProtein)
        preferenceToggle("Gluten free", keyPath: \.glutenFree)
    }

    private func preferenceToggle(
        _ label: String,
        keyPath: WritableKeyPath<Preferences, Bool>
    ) -> some View {
        Toggle(isOn: Binding(
            get: { store.prefs[keyPath: keyPath] },
            set: { enabled in
                var next = store.prefs
                next[keyPath: keyPath] = enabled
                store.setPrefs(next)
            }
        )) {
            Text(label)
                .font(.body(17))
                .foregroundStyle(Color.ink)
        }
        .tint(.cardinal)
        .frame(minHeight: 44)
        .listRowBackground(Color.card)
    }
}
