import SwiftUI

struct TimeSheet: View {
    let title: String
    let slots: [String]
    @Binding var selection: String
    @Environment(\.dismiss) private var dismiss

    init(title: String = "Pickup time", slots: [String], selection: Binding<String>) {
        self.title = title
        self.slots = slots
        _selection = selection
    }

    var body: some View {
        NavigationStack {
            List(slots, id: \.self) { slot in
                Button {
                    selection = slot
                    dismiss()
                } label: {
                    HStack(spacing: 12) {
                        Text(slot)
                            .font(.body(17, weight: .semibold))
                            .foregroundStyle(Color.ink)
                        Spacer(minLength: 12)
                        SelectionCheck(selected: slot == selection)
                    }
                    .frame(minHeight: 44)
                    .contentShape(Rectangle())
                }
                .listRowBackground(Color.card)
                .accessibilityAddTraits(slot == selection ? .isSelected : [])
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
            .background(Color.cream)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }
}
