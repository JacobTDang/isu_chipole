import SwiftUI

struct BagView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        Group {
            if store.bag.isEmpty {
                emptyState
            } else {
                content
            }
        }
        .background(Color.cream)
        .navigationTitle("Bag")
        .navigationBarTitleDisplayMode(.large)
    }

    private var emptyState: some View {
        ScrollView {
            VStack(spacing: 0) {
                Image(systemName: "bag")
                    .font(.body(26, weight: .light))
                    .foregroundStyle(Color.cardinal)
                    .frame(width: 64, height: 64)
                    .background(Color.gold)
                    .clipShape(Circle())
                    .accessibilityHidden(true)
                Text("Your bag is empty")
                    .font(.display(22))
                    .foregroundStyle(Color.ink)
                    .padding(.top, 20)
                Text("Build a bowl or grab a preset.")
                    .font(.body(15))
                    .foregroundStyle(Color.inkSoft)
                    .multilineTextAlignment(.center)
                    .padding(.top, 8)
                Button("Start an order") {
                    store.selectedTab = .order
                }
                .buttonStyle(PrimaryButtonStyle())
                .padding(.top, 24)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 36)
            .frame(maxWidth: .infinity)
            .background(Color.card)
            .clipShape(RoundedRectangle(cornerRadius: 24))
            .overlay {
                RoundedRectangle(cornerRadius: 24)
                    .stroke(Color.line, lineWidth: 1)
            }
            .padding(.horizontal, 16)
            .padding(.top, 40)
        }
    }

    private var content: some View {
        ScrollView {
            VStack(spacing: 0) {
                rows
                PlanCard()
                AddOnsRow()
            }
        }
        .safeAreaInset(edge: .bottom, spacing: 0) {
            ticket
        }
    }

    private var rows: some View {
        VStack(spacing: 0) {
            ForEach(Array(store.bag.enumerated()), id: \.element.id) { index, item in
                if index > 0 {
                    Rectangle()
                        .fill(Color.line)
                        .frame(height: 1)
                }
                BagRow(item: item)
            }
        }
        .background(Color.card)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay {
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.line, lineWidth: 1)
        }
        .padding(.horizontal, 16)
    }

    private var ticket: some View {
        let totals = Pricing.orderTotals(store.bag, plan: store.plan, promo: store.promo)
        var lines = [TicketLine(label: "Subtotal", amount: Pricing.money(totals.subtotal))]
        if totals.discount > 0 {
            lines.append(TicketLine(label: "Plan discount", amount: "−\(Pricing.money(totals.discount))"))
        }
        lines.append(TicketLine(label: "Tax · 7%", amount: Pricing.money(totals.tax), muted: true))

        return TicketView(
            lines: lines,
            total: TicketLine(label: "Total", amount: Pricing.money(totals.total))
        ) {
            NavigationLink {
                CheckoutView()
            } label: {
                Text("Check out")
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(.horizontal, 12)
        .padding(.top, 6)
        .padding(.bottom, 8)
        .background(Color.cream)
    }
}
