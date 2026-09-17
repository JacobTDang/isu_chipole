import SwiftUI

struct CheckoutView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var fulfillment: Fulfillment = .pickup
    @State private var address = ""
    @State private var location = Menu.locations[0]
    @State private var day: PickupDay = .sunday
    @State private var time = "4:30 PM"
    @State private var locationOpen = false
    @State private var timeOpen = false
    @State private var isPlacing = false
    @State private var placedOrder: Order?

    var body: some View {
        Group {
            if store.bag.isEmpty && !isPlacing {
                emptyState
            } else {
                form
            }
        }
        .background(Color.cream.ignoresSafeArea())
        .navigationTitle("Checkout")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(item: $placedOrder) { order in
            ConfirmationView(orderId: order.id)
        }
        .onChange(of: placedOrder) { previous, current in
            if previous != nil, current == nil {
                dismiss()
            }
        }
        .sheet(isPresented: $locationOpen) {
            LocationSheet(selection: $location)
        }
        .sheet(isPresented: $timeOpen) {
            TimeSheet(title: "\(fulfillmentLabel) time", selection: $time)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Text("Your bag is empty.")
                .font(.body(17, weight: .semibold))
                .foregroundStyle(Color.ink)
            Button("Back to bag") {
                dismiss()
            }
            .buttonStyle(SecondaryButtonStyle())
            .fixedSize()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var isDelivery: Bool {
        fulfillment == .delivery
    }

    private var fulfillmentLabel: String {
        isDelivery ? "Delivery" : "Pickup"
    }

    private var cleanAddress: String {
        address.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Delivery needs somewhere to go before the order can be placed.
    private var canPlace: Bool {
        !isPlacing && (!isDelivery || !cleanAddress.isEmpty)
    }

    private var form: some View {
        Form {
            Section {
                Picker("Fulfillment", selection: $fulfillment) {
                    Text("Pickup").tag(Fulfillment.pickup)
                    Text("Delivery").tag(Fulfillment.delivery)
                }
                .pickerStyle(.segmented)
                .labelsHidden()
                .listRowInsets(EdgeInsets())
                .listRowBackground(Color.clear)
            }

            Section {
                if isDelivery {
                    addressRow
                        .listRowBackground(Color.card)
                } else {
                    Button {
                        locationOpen = true
                    } label: {
                        detailRow(label: "Pickup spot", value: location.name)
                    }
                    .listRowBackground(Color.card)
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text("\(fulfillmentLabel) day")
                        .font(.body(15))
                        .foregroundStyle(Color.inkSoft)
                    Picker("\(fulfillmentLabel) day", selection: $day) {
                        ForEach(PickupDay.allCases, id: \.self) { pickupDay in
                            Text(pickupDay.rawValue).tag(pickupDay)
                        }
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                }
                .padding(.vertical, 4)
                .listRowBackground(Color.card)

                Button {
                    timeOpen = true
                } label: {
                    detailRow(label: "\(fulfillmentLabel) time", value: time)
                }
                .listRowBackground(Color.card)

                Button {
                    store.showToast("Saved card selected")
                } label: {
                    detailRow(label: "Payment", value: "Visa ending 4242")
                }
                .listRowBackground(Color.card)
            }

            Section {
                Button("Pay with Apple Pay") {
                    placeOrder()
                }
                .buttonStyle(DarkButtonStyle())
                .disabled(!canPlace)
                .listRowInsets(EdgeInsets())
                .listRowBackground(Color.clear)
            }

            Section("Promo code") {
                PromoField()
                    .listRowBackground(Color.card)
            }
        }
        .scrollContentBackground(.hidden)
        .scrollDismissesKeyboard(.interactively)
        .safeAreaInset(edge: .bottom) {
            TicketView(
                lines: ticketLines,
                total: TicketLine(label: "Total", amount: Pricing.money(totals.total))
            ) {
                Button {
                    placeOrder()
                } label: {
                    Text(isPlacing ? "Placing order…" : "Place order")
                }
                .buttonStyle(PrimaryButtonStyle())
                .disabled(!canPlace)
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)
            .background(Color.cream)
        }
    }

    private var addressRow: some View {
        HStack(spacing: 12) {
            Text("Deliver to")
                .font(.body(17))
                .foregroundStyle(Color.ink)
            TextField("Friley Hall, room 2310", text: $address)
                .font(.body(17))
                .foregroundStyle(Color.ink)
                .multilineTextAlignment(.trailing)
                .textInputAutocapitalization(.words)
                .submitLabel(.done)
        }
        .frame(minHeight: 44)
    }

    private func detailRow(label: String, value: String) -> some View {
        HStack(spacing: 8) {
            Text(label)
                .font(.body(17))
                .foregroundStyle(Color.ink)
            Spacer(minLength: 12)
            Text(value)
                .font(.body(17))
                .foregroundStyle(Color.inkSoft)
                .lineLimit(1)
            Image(systemName: "chevron.right")
                .font(.body(13, weight: .semibold))
                .foregroundStyle(Color.inkSoft)
                .accessibilityHidden(true)
        }
        .frame(minHeight: 44)
        .contentShape(Rectangle())
    }

    private var totals: Totals {
        Pricing.orderTotals(
            store.bag,
            plan: store.plan,
            promo: store.promo,
            deliveryFee: isDelivery ? Pricing.deliveryFee : 0
        )
    }

    private var ticketLines: [TicketLine] {
        let totals = totals
        let planRate = Pricing.planDiscountRate(store.plan, count: Pricing.mealCount(store.bag))
        let planDiscount = planRate > 0 ? rounded(totals.subtotal * planRate) : 0
        let promoDiscount = Pricing.promoRate(store.promo) > 0
            ? rounded(totals.discount - planDiscount)
            : 0

        var lines = [TicketLine(label: "Subtotal", amount: Pricing.money(totals.subtotal))]
        if planDiscount > 0 {
            let percent = NSDecimalNumber(decimal: planRate * 100).intValue
            lines.append(TicketLine(
                label: "Plan discount (\(percent)%)",
                amount: "−\(Pricing.money(planDiscount))"
            ))
        }
        if promoDiscount > 0 {
            lines.append(TicketLine(label: "Promo (10%)", amount: "−\(Pricing.money(promoDiscount))"))
        }
        lines.append(TicketLine(label: "Tax · 7%", amount: Pricing.money(totals.tax), muted: true))
        if isDelivery {
            lines.append(TicketLine(label: "Delivery", amount: Pricing.money(totals.delivery)))
        }
        return lines
    }

    private func placeOrder() {
        guard canPlace else { return }
        isPlacing = true
        placedOrder = store.placeOrder(
            fulfillment: fulfillment,
            address: isDelivery ? cleanAddress : nil,
            location: location,
            day: day,
            time: time
        )
    }

    private func rounded(_ value: Decimal) -> Decimal {
        var input = value
        var result = Decimal()
        NSDecimalRound(&result, &input, 2, .plain)
        return result
    }
}
