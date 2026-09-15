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
    let lines: [TicketLine]
    let total: TicketLine?
    private let footer: Content

    init(
        lines: [TicketLine],
        total: TicketLine?,
        @ViewBuilder footer: () -> Content
    ) {
        self.lines = lines
        self.total = total
        self.footer = footer()
    }

    var body: some View {
        VStack(spacing: 12) {
            ForEach(lines) { line in
                ticketLine(line)
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
            Rectangle()
                .stroke(
                    line.muted ? Color.line : Color.inkSoft,
                    style: StrokeStyle(lineWidth: 1, dash: [1.5, 3])
                )
                .frame(height: 1)
            Text(line.amount)
                .lineLimit(1)
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
