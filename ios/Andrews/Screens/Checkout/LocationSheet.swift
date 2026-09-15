import SwiftUI

struct LocationSheet: View {
    @Binding var selection: PickupLocation
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(Menu.locations) { location in
                Button {
                    selection = location
                    dismiss()
                } label: {
                    HStack(spacing: 12) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(location.name)
                                .font(.body(17, weight: .semibold))
                                .foregroundStyle(Color.ink)
                            Text(location.note)
                                .font(.body(15))
                                .foregroundStyle(Color.inkSoft)
                        }
                        Spacer(minLength: 12)
                        SelectionCheck(selected: location.id == selection.id)
                    }
                    .frame(minHeight: 44)
                    .contentShape(Rectangle())
                }
                .listRowBackground(Color.card)
                .accessibilityAddTraits(location.id == selection.id ? .isSelected : [])
            }
            .listStyle(.insetGrouped)
            .scrollContentBackground(.hidden)
            .background(Color.cream)
            .navigationTitle("Pickup spot")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
    }
}

struct SelectionCheck: View {
    let selected: Bool

    var body: some View {
        Circle()
            .fill(selected ? Color.gold : Color.clear)
            .frame(width: 28, height: 28)
            .overlay {
                Circle().stroke(selected ? Color.cardinal : Color.line, lineWidth: 1)
            }
            .overlay {
                if selected {
                    Image(systemName: "checkmark")
                        .font(.body(14, weight: .semibold))
                        .foregroundStyle(Color.cardinal)
                }
            }
            .accessibilityHidden(true)
    }
}
