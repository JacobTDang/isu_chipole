import SwiftUI

struct OrderHistory: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        if store.orders.isEmpty {
            VStack(alignment: .leading, spacing: 4) {
                Text("No orders yet.")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                Text("Your first week starts here.")
                    .font(.body(15))
                    .foregroundStyle(Color.inkSoft)
            }
            .padding(.vertical, 8)
            .listRowBackground(Color.card)
        } else {
            ForEach(store.orders.reversed()) { order in
                row(order)
                    .listRowBackground(Color.card)
            }
        }
    }

    private func row(_ order: Order) -> some View {
        let count = Pricing.mealCount(order.items)
        return HStack(spacing: 8) {
            NavigationLink {
                ConfirmationView(orderId: order.id)
            } label: {
                VStack(alignment: .leading, spacing: 2) {
                    Text(order.id)
                        .font(.body(17, weight: .semibold))
                        .foregroundStyle(Color.ink)
                    Text("\(dateText(order.placedAt)) · \(count) \(count == 1 ? "item" : "items") · \(Pricing.money(order.total))")
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                }
                .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                .contentShape(Rectangle())
            }

            Button {
                reorder(order)
            } label: {
                Text("Reorder")
                    .padding(.horizontal, 12)
            }
            .buttonStyle(SecondaryButtonStyle())
            .fixedSize()
        }
        .padding(.vertical, 4)
    }

    private func dateText(_ date: Date) -> String {
        date.formatted(.dateTime.month(.abbreviated).day().year())
    }

    private func reorder(_ order: Order) {
        store.replaceBag(with: order.items.map { item in
            BagItem(id: UUID().uuidString, selection: item.selection)
        })
        store.showToast("Added to bag.")
    }
}
