import SwiftUI

struct AllergySection: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        ForEach(Allergen.allCases, id: \.self) { allergen in
            Toggle(isOn: binding(for: allergen)) {
                Text(allergen.label)
                    .font(.body(17))
                    .foregroundStyle(Color.ink)
            }
            .tint(.cardinal)
            .frame(minHeight: 44)
            .listRowBackground(Color.card)
        }
    }

    private func binding(for allergen: Allergen) -> Binding<Bool> {
        Binding(
            get: { store.prefs.allergies.contains(allergen) },
            set: { enabled in
                var prefs = store.prefs
                prefs.allergies.removeAll { $0 == allergen }
                if enabled {
                    prefs.allergies.append(allergen)
                }
                store.setPrefs(prefs)
            }
        )
    }
}
