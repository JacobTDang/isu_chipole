import SwiftUI

struct AccountView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        List {
            Section("Rewards") {
                rewardsSummary
                    .listRowBackground(Color.card)
            }

            Section("Order history") {
                OrderHistory()
            }

            Section("Saved meals") {
                SavedMeals()
            }

            Section("Dietary preferences") {
                PreferencesSection()
            }

            Section("Demo") {
                demoRow("Reset demo data") {
                    store.resetDemoData()
                }
                demoRow("Sign out") {
                    store.signOut()
                }
            }
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
        .background(Color.cream.ignoresSafeArea())
        .navigationTitle("Account")
        .navigationBarTitleDisplayMode(.large)
    }

    private var rewardsSummary: some View {
        let points = Rewards.points(store.orders)
        let tier = Rewards.tier(points)
        let tierStart: Int
        switch tier.name {
        case "Cardinal":
            tierStart = 500
        case "Gold":
            tierStart = 1_500
        default:
            tierStart = 0
        }
        let progress: Double
        if let nextAt = tier.nextAt {
            progress = min(1, Double(points - tierStart) / Double(nextAt - tierStart))
        } else {
            progress = 1
        }

        return VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .bottom, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(points) pts")
                        .font(.display(30))
                        .foregroundStyle(Color.ink)
                    Text(tier.name)
                        .font(.body(15, weight: .semibold))
                        .foregroundStyle(Color.cardinal)
                }
                Spacer(minLength: 12)
                Text(nextTierText(points: points, tier: tier))
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
                    .multilineTextAlignment(.trailing)
            }

            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.line)
                    Capsule()
                        .fill(Color.gold)
                        .frame(width: proxy.size.width * progress)
                }
            }
            .frame(height: 8)
            .accessibilityElement()
            .accessibilityLabel("Rewards progress")
            .accessibilityValue("\(Int((progress * 100).rounded())) percent")
        }
        .padding(.vertical, 8)
    }

    private func nextTierText(points: Int, tier: (name: String, nextName: String?, nextAt: Int?)) -> String {
        guard let nextAt = tier.nextAt, let nextName = tier.nextName else {
            return "Top tier reached"
        }
        return "\(nextAt - points) pts to \(nextName)"
    }

    private func demoRow(_ label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.body(17))
                .foregroundStyle(Color.cardinal)
                .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                .contentShape(Rectangle())
        }
        .listRowBackground(Color.card)
    }
}
