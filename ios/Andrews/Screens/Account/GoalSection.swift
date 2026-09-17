import SwiftUI

/// Four choices as a radio list; "Build muscle" truncates in a four-way
/// segmented control at phone width.
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
        Section {
            Picker("Health goal", selection: goal) {
                goalRow("None").tag(Optional<Goal>.none)
                ForEach(Goal.allCases, id: \.self) { option in
                    goalRow(option.label).tag(Optional(option))
                }
            }
            .pickerStyle(.inline)
            .labelsHidden()
            .tint(.cardinal)
            .listRowBackground(Color.card)
        } header: {
            Text("Health goal")
        } footer: {
            Text(store.prefs.goal?.targetDescription ?? "No target set.")
        }
    }

    private func goalRow(_ label: String) -> some View {
        Text(label)
            .font(.body(17))
            .foregroundStyle(Color.ink)
            .frame(minHeight: 44)
    }
}
