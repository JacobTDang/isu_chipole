import SwiftUI

struct GoalSection: View {
    @Environment(AppStore.self) private var store

    private var goal: Binding<Goal?> {
        Binding(
            get: { store.prefs.goal },
            set: { next in
                var prefs = store.prefs
                prefs.goal = next
                store.setPrefs(prefs)
            }
        )
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Picker("Health goal", selection: goal) {
                Text("None").tag(Optional<Goal>.none)
                ForEach(Goal.allCases, id: \.self) { option in
                    Text(option.label).tag(Optional(option))
                }
            }
            .pickerStyle(.segmented)
            .labelsHidden()

            Text(store.prefs.goal?.targetDescription ?? "No target set.")
                .font(.body(13))
                .foregroundStyle(Color.inkSoft)
        }
        .padding(.vertical, 4)
        .listRowBackground(Color.card)
    }
}
