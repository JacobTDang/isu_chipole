import SwiftUI

enum BuilderSectionMode {
    case one
    case many
}

struct BuilderSection: View {
    let title: String
    let rule: String
    let options: [Ingredient]
    let selected: [String]
    let mode: BuilderSectionMode
    let onChange: ([String]) -> Void

    init(
        title: String,
        rule: String,
        options: [Ingredient],
        selected: [String],
        mode: BuilderSectionMode,
        onChange: @escaping ([String]) -> Void
    ) {
        self.title = title
        self.rule = rule
        self.options = options
        self.selected = selected
        self.mode = mode
        self.onChange = onChange
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .firstTextBaseline, spacing: 12) {
                Text(title)
                    .font(.display(22))
                    .foregroundStyle(Color.ink)
                Spacer(minLength: 0)
                Text(rule)
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
                    .lineLimit(1)
                    .fixedSize()
            }

            FlowLayout(spacing: 8) {
                ForEach(options) { option in
                    PillButton(
                        label: option.name,
                        price: option.price,
                        veg: option.tags.contains(.veg),
                        selected: selected.contains(option.id)
                    ) {
                        toggle(option.id)
                    }
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 24)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func toggle(_ id: String) {
        switch mode {
        case .one:
            onChange(selected.contains(id) ? [] : [id])
        case .many:
            onChange(selected.contains(id) ? selected.filter { $0 != id } : selected + [id])
        }
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        arrange(width: proposal.width ?? .infinity, subviews: subviews).size
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let origins = arrange(width: bounds.width, subviews: subviews).origins
        for (index, origin) in origins.enumerated() {
            subviews[index].place(
                at: CGPoint(x: bounds.minX + origin.x, y: bounds.minY + origin.y),
                proposal: .unspecified
            )
        }
    }

    private func arrange(width: CGFloat, subviews: Subviews) -> (size: CGSize, origins: [CGPoint]) {
        var origins: [CGPoint] = []
        var x: CGFloat = 0
        var y: CGFloat = 0
        var rowHeight: CGFloat = 0
        var widest: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x > 0, x + size.width > width {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            origins.append(CGPoint(x: x, y: y))
            rowHeight = max(rowHeight, size.height)
            x += size.width + spacing
            widest = max(widest, x - spacing)
        }

        let finalWidth = width.isFinite ? width : widest
        return (CGSize(width: finalWidth, height: y + rowHeight), origins)
    }
}
