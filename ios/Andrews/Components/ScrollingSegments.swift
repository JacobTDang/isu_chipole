import SwiftUI

private struct SegmentOption<ID: Hashable>: Identifiable {
    let id: ID
    let label: String
}

struct ScrollingSegments<ID: Hashable>: View {
    private let options: [SegmentOption<ID>]
    @Binding private var selection: ID

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(options: [(id: ID, label: String)], selection: Binding<ID>) {
        var segments: [SegmentOption<ID>] = []
        for option in options {
            segments.append(SegmentOption(id: option.id, label: option.label))
        }
        self.options = segments
        _selection = selection
    }

    var body: some View {
        ScrollView(.horizontal) {
            HStack(spacing: 6) {
                ForEach(options) { option in
                    Button {
                        selection = option.id
                    } label: {
                        Text(option.label)
                            .font(.body(13, weight: .semibold))
                            .foregroundStyle(selection == option.id ? Color.card : Color.ink)
                            .padding(.horizontal, 13)
                            .frame(minHeight: 44)
                            .background(selection == option.id ? Color.cardinal : Color.card)
                            .clipShape(Capsule())
                            .overlay {
                                Capsule().stroke(Color.line, lineWidth: selection == option.id ? 0 : 1)
                            }
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(selection == option.id ? .isSelected : [])
                }
            }
            .padding(.horizontal, 16)
        }
        .scrollIndicators(.hidden)
        .animation(reduceMotion ? nil : .easeOut(duration: 0.12), value: selection)
    }
}
