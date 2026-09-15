import SwiftUI

struct ConfirmationView: View {
    let orderId: String

    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var revealed = false

    var body: some View {
        Group {
            if let order = store.orders.first(where: { $0.id == orderId }) {
                content(order)
            } else {
                Text("Order not found.")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Color.cream.ignoresSafeArea())
        .toolbar(.hidden, for: .tabBar)
        .navigationBarBackButtonHidden(true)
        .safeAreaInset(edge: .bottom) {
            Button("Back to home") {
                store.selectedTab = .home
                dismiss()
            }
            .buttonStyle(SecondaryButtonStyle())
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)
            .background(Color.cream)
        }
    }

    private func content(_ order: Order) -> some View {
        ScrollView {
            VStack(spacing: 0) {
                ZStack {
                    Circle()
                        .fill(Color.cardinal)
                        .frame(width: 100, height: 100)
                        .shadow(color: Color.ink.opacity(0.18), radius: 14, y: 8)
                    Image(systemName: "checkmark")
                        .font(.body(52, weight: .bold))
                        .foregroundStyle(Color.gold)
                }
                .accessibilityHidden(true)

                Text("Order confirmed")
                    .textCase(.uppercase)
                    .font(.body(13, weight: .semibold))
                    .tracking(2)
                    .foregroundStyle(Color.cardinal)
                    .padding(.top, 20)

                Text("See you \(order.day.rawValue).")
                    .font(.display(34))
                    .foregroundStyle(Color.ink)
                    .multilineTextAlignment(.center)
                    .padding(.top, 4)

                VStack(alignment: .leading, spacing: 12) {
                    Text(order.id)
                        .font(.display(28))
                        .foregroundStyle(Color.ink)
                        .padding(.horizontal, 18)
                    TicketView(
                        lines: ticketLines(order),
                        total: TicketLine(label: "Total", amount: Pricing.money(order.total))
                    ) {
                        EmptyView()
                    }
                }
                .padding(.top, 32)
                .opacity(revealed ? 1 : 0)
                .offset(y: revealed ? 0 : 16)

                Text("Ready at \(order.time)")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                    .padding(.top, 20)

                Text(order.location.note)
                    .font(.body(15))
                    .foregroundStyle(Color.inkSoft)
                    .multilineTextAlignment(.center)
                    .padding(.top, 4)
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 16)
            .padding(.top, 28)
            .padding(.bottom, 20)
        }
        .onAppear {
            if reduceMotion {
                revealed = true
            } else {
                withAnimation(.easeOut(duration: 0.3)) {
                    revealed = true
                }
            }
        }
    }

    private func ticketLines(_ order: Order) -> [TicketLine] {
        var lines = [
            TicketLine(label: "Pickup", amount: order.location.name),
            TicketLine(label: "Day", amount: order.day.rawValue),
            TicketLine(label: "Time", amount: order.time),
        ]
        for item in order.items {
            lines.append(TicketLine(
                label: "\(item.selection.quantity)× \(itemName(item.selection))",
                amount: Pricing.money(Pricing.itemPrice(item.selection))
            ))
        }
        return lines
    }

    private func itemName(_ selection: Selection) -> String {
        if let name = selection.name, !name.trimmingCharacters(in: .whitespaces).isEmpty {
            return name
        }
        if let presetId = selection.presetId {
            return Menu.preset(presetId).name
        }
        return "Custom \(Menu.mealType(selection.mealType).name)"
    }
}
