import SwiftUI

struct LoginView: View {
    @Environment(AppStore.self) private var store
    @State private var email = ""
    @State private var password = ""

    private var trimmedEmail: String {
        email.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 24)

            VStack(spacing: 0) {
                Image("ISULogo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 240)
                    .accessibilityLabel("Iowa State University")

                Text("Andrew's")
                    .font(.display(34))
                    .foregroundStyle(Color.ink)
                    .padding(.top, 28)

                Text("Meal prep for Cyclones. Pick up on campus.")
                    .font(.body(15))
                    .foregroundStyle(Color.inkSoft)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 288)
                    .padding(.top, 8)
            }

            Spacer(minLength: 24)

            VStack(spacing: 12) {
                field("ISU email") {
                    TextField("you@iastate.edu", text: $email)
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .submitLabel(.next)
                }

                field("Password") {
                    SecureField("Password", text: $password)
                        .textContentType(.password)
                        .submitLabel(.go)
                        .onSubmit(signIn)
                }

                Button("Sign in", action: signIn)
                    .buttonStyle(PrimaryButtonStyle())
                    .disabled(trimmedEmail.isEmpty)

                Button("Continue with ISU Net-ID") {
                    store.signIn(email: trimmedEmail.isEmpty ? "cyclone@iastate.edu" : trimmedEmail)
                }
                .buttonStyle(SecondaryButtonStyle())
            }
        }
        .padding(.horizontal, 24)
        .padding(.bottom, 32)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.cream.ignoresSafeArea())
    }

    private func signIn() {
        guard !trimmedEmail.isEmpty else { return }
        store.signIn(email: trimmedEmail)
    }

    private func field<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.body(13, weight: .semibold))
                .foregroundStyle(Color.inkSoft)
            content()
                .font(.body(17))
                .foregroundStyle(Color.ink)
                .padding(.horizontal, 16)
                .frame(minHeight: 44)
                .background(Color.card)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.line, lineWidth: 1)
                }
        }
    }
}
