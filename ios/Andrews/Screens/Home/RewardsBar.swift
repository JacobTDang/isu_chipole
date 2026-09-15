import SwiftUI

struct RewardsBar: View {
    let orders: [Order]

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var points: Int { Rewards.points(orders) }
    private var tier: (name: String, nextName: String?, nextAt: Int?) { Rewards.tier(points) }

    private var progress: Double {
        guard let nextAt = tier.nextAt else { return 1 }
        let start = tier.name == "Cardinal" ? 500 : 0
        return min(Double(points - start) / Double(nextAt - start), 1)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .bottom, spacing: 16) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(tier.name) rewards")
                        .font(.body(13, weight: .semibold))
                        .foregroundStyle(Color.inkSoft)
                    Text("\(points) pts")
                        .font(.display(24))
                        .foregroundStyle(Color.ink)
                        .monospacedDigit()
                }
                Spacer(minLength: 0)
                if let nextAt = tier.nextAt, let nextName = tier.nextName {
                    Text("\(nextAt - points) to \(nextName)")
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                        .padding(.bottom, 4)
                }
            }

            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.line)
                    Capsule()
                        .fill(Color.gold)
                        .frame(width: geometry.size.width * progress)
                }
            }
            .frame(height: 8)
            .animation(reduceMotion ? nil : .easeOut(duration: 0.3), value: progress)
            .accessibilityLabel("Progress to next tier")
            .accessibilityValue("\(Int(progress * 100)) percent")
        }
        .padding(16)
        .cardSurface()
        .accessibilityElement(children: .combine)
    }
}
