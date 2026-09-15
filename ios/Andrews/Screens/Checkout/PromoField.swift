import SwiftUI

struct PromoField: View {
    @Environment(AppStore.self) private var store
    @State private var code = ""
    @State private var error: String?

    private var applied: Bool {
        Pricing.promoRate(store.promo) > 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                TextField("Enter code", text: $code)
                    .font(.body(16))
                    .foregroundStyle(Color.ink)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .submitLabel(.done)
                    .onSubmit(apply)
                    .padding(.horizontal, 12)
                    .frame(minHeight: 44)
                    .background(Color.cream)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay {
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.line, lineWidth: 1)
                    }

                Button {
                    apply()
                } label: {
                    Text("Apply")
                        .padding(.horizontal, 16)
                }
                .buttonStyle(SecondaryButtonStyle())
                .fixedSize()
            }

            if let error {
                Text(error)
                    .font(.body(13, weight: .semibold))
                    .foregroundStyle(Color.cardinal)
            } else if applied, let promo = store.promo {
                Text("10% off applied.")
                    .font(.body(13, weight: .semibold))
                    .foregroundStyle(Color.veg)
                    .accessibilityLabel("\(promo) applied. 10% off applied.")
            }
        }
        .padding(.vertical, 4)
        .onAppear {
            if code.isEmpty, let promo = store.promo {
                code = promo
            }
        }
        .onChange(of: code) {
            error = nil
        }
    }

    private func apply() {
        let normalized = code.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        guard Pricing.promoRate(normalized) > 0 else {
            error = "That code isn't valid."
            return
        }
        error = nil
        store.setPromo(normalized)
    }
}
