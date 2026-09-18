import SwiftUI

struct UsualRow: View {
    let orders: [Order]

    @Environment(AppStore.self) private var store

    private var recent: [Order] {
        Array(orders.sorted { $0.placedAt > $1.placedAt }.prefix(3))
    }

    var body: some View {
        if recent.isEmpty {
            emptyCard
                .padding(.horizontal, 16)
        } else {
            ScrollView(.horizontal) {
                HStack(spacing: 12) {
                    ForEach(recent) { order in
                        orderCard(order)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
            }
            .scrollIndicators(.hidden)
        }
    }

    private var emptyCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("No orders yet. Your first week starts here.")
                .font(.body(17, weight: .semibold))
                .foregroundStyle(Color.ink)
            NavigationLink {
                BuilderView(mode: .new(.bowl))
            } label: {
                Text("Build a bowl")
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .cardSurface()
    }

    private func orderCard(_ order: Order) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                Text(order.id)
                    .font(.ticket(13))
                    .foregroundStyle(Color.cardinal)
                Spacer(minLength: 0)
                Text(Pricing.money(order.total))
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
                    .monospacedDigit()
            }

            VStack(alignment: .leading, spacing: 2) {
                Text("\(Pricing.mealCount(order.items)) meals")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                Text(Schedule.formatDate(order.date))
                    .font(.body(13))
                    .foregroundStyle(Color.inkSoft)
            }

            Button {
                reorder(order)
            } label: {
                Label("Reorder", systemImage: "arrow.counterclockwise")
                    .font(.body(15, weight: .semibold))
                    .foregroundStyle(Color.cardinal)
                    .frame(minHeight: 44)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
        }
        .padding(16)
        .frame(width: 240, alignment: .leading)
        .cardSurface()
    }

    private func reorder(_ order: Order) {
        store.replaceBag(with: order.items.map { BagItem(id: UUID().uuidString, selection: $0.selection) })
        store.showToast("Added to bag.")
    }
}
