import SwiftUI

struct TicketLine: Identifiable {
    let id = UUID()
    let label: String
    let amount: String
    var muted = false

    init(label: String, amount: String, muted: Bool = false) {
        self.label = label
        self.amount = amount
        self.muted = muted
    }
}

struct TicketView<Content: View>: View {
    let title: String?
    let lines: [TicketLine]
    let total: TicketLine?
    let prominentLine: TicketLine?
    private let footer: Content

    /// - Parameters:
    ///   - title: Display-weight heading above the lines, such as an order id.
    ///   - total: Rendered below a cardinal dashed rule in display weight.
    ///   - prominentLine: A single line whose amount is display weight with no
    ///     rule, for a live price in a sticky bar.
    init(
        title: String? = nil,
        lines: [TicketLine],
        total: TicketLine? = nil,
        prominentLine: TicketLine? = nil,
        @ViewBuilder footer: () -> Content
    ) {
        self.title = title
        self.lines = lines
        self.total = total
        self.prominentLine = prominentLine
        self.footer = footer()
    }

    var body: some View {
        VStack(spacing: 12) {
            if let title {
                Text(title)
                    .font(.display(28))
                    .foregroundStyle(Color.ink)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            ForEach(lines) { line in
                ticketLine(line)
            }

            if let prominentLine {
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    Text(prominentLine.label)
                        .font(.ticket(13))
                    Spacer(minLength: 12)
                    Text(prominentLine.amount)
                        .font(.display(24))
                }
                .foregroundStyle(Color.ink)
                .monospacedDigit()
            }

            if let total {
                Rectangle()
                    .stroke(
                        Color.cardinal,
                        style: StrokeStyle(lineWidth: 1.5, dash: [6, 5])
                    )
                    .frame(height: 1)
                    .padding(.vertical, 2)

                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    Text(total.label)
                    Spacer(minLength: 12)
                    Text(total.amount)
                }
                .font(.display(24))
                .foregroundStyle(Color.ink)
            }

            footer
        }
        .padding(.horizontal, 18)
        .padding(.top, 22)
        .padding(.bottom, 18)
        .background(Color.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay {
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.line, lineWidth: 1)
        }
        .overlay(alignment: .top) {
            perforatedEdge
        }
    }

    private func ticketLine(_ line: TicketLine) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            Text(line.label)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
                .layoutPriority(1)
            Rectangle()
                .stroke(
                    line.muted ? Color.line : Color.inkSoft,
                    style: StrokeStyle(lineWidth: 1, dash: [1.5, 3])
                )
                .frame(height: 1)
            Text(line.amount)
                .lineLimit(1)
                .fixedSize(horizontal: true, vertical: false)
        }
        .font(.ticket(13))
        .foregroundStyle(line.muted ? Color.inkSoft : Color.ink)
        .monospacedDigit()
    }

    private var perforatedEdge: some View {
        Canvas { context, size in
            var path = Path()
            var x: CGFloat = 8
            while x < size.width {
                path.addEllipse(in: CGRect(x: x - 4, y: -4, width: 8, height: 8))
                x += 14
            }
            context.fill(path, with: .color(.cream))
        }
        .frame(height: 8)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}
