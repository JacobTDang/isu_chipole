import SwiftUI

extension PlanSize {
    var discountLabel: String {
        switch self {
        case .five:
            return "Save 15%"
        case .seven:
            return "Save 20%"
        case .ten:
            return "Save 25%"
        }
    }
}

struct PlanCard: View {
    @Environment(AppStore.self) private var store
    @State private var isPresented = false

    private var count: Int {
        Pricing.mealCount(store.bag)
    }

    private var remaining: Int {
        max(store.plan.rawValue - count, 0)
    }

    var body: some View {
        Button {
            isPresented = true
        } label: {
            HStack(spacing: 12) {
                Text("\(store.plan.rawValue)")
                    .font(.display(18))
                    .foregroundStyle(Color.ink)
                    .frame(width: 44, height: 44)
                    .background(Color.gold)
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 2) {
                    Text("Meals this week")
                        .font(.body(17, weight: .semibold))
                        .foregroundStyle(Color.ink)
                    Text("\(count) of \(store.plan.rawValue) meals · \(store.plan.discountLabel)")
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                    if remaining > 0 {
                        Text("Add \(remaining) more to fill your plan")
                            .font(.body(13, weight: .semibold))
                            .foregroundStyle(Color.cardinal)
                            .padding(.top, 2)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Image(systemName: "chevron.right")
                    .font(.body(15, weight: .medium))
                    .foregroundStyle(Color.inkSoft)
                    .accessibilityHidden(true)
            }
            .padding(16)
            .frame(minHeight: 44)
            .background(Color.card)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay {
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.line, lineWidth: 1)
            }
            .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 16)
        .padding(.vertical, 20)
        .sheet(isPresented: $isPresented) {
            PlanSheet()
                .presentationDetents([.medium])
                .presentationDragIndicator(.visible)
                .presentationBackground(Color.card)
        }
    }
}

struct PlanSheet: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .center, spacing: 16) {
                Text("Meals this week")
                    .font(.display(22))
                    .foregroundStyle(Color.ink)
                Spacer(minLength: 0)
                Button("Done") {
                    dismiss()
                }
                .buttonStyle(SecondaryButtonStyle())
                .fixedSize(horizontal: true, vertical: false)
            }

            VStack(spacing: 0) {
                ForEach(Array(PlanSize.allCases.enumerated()), id: \.element) { index, size in
                    if index > 0 {
                        Rectangle()
                            .fill(Color.line)
                            .frame(height: 1)
                    }
                    option(size)
                }
            }
            .background(Color.card)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay {
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.line, lineWidth: 1)
            }

            Spacer(minLength: 0)
        }
        .padding(.horizontal, 16)
        .padding(.top, 20)
        .padding(.bottom, 16)
    }

    private func option(_ size: PlanSize) -> some View {
        Button {
            store.setPlan(size)
            dismiss()
        } label: {
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(size.rawValue) meals")
                        .font(.body(17, weight: .semibold))
                        .foregroundStyle(Color.ink)
                    Text(size.discountLabel)
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                if store.plan == size {
                    Image(systemName: "checkmark")
                        .font(.body(17, weight: .semibold))
                        .foregroundStyle(Color.cardinal)
                        .accessibilityHidden(true)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .frame(minHeight: 56)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(store.plan == size ? .isSelected : [])
    }
}
