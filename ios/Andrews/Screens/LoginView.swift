import SwiftUI

struct LoginView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        VStack(spacing: 22) {
            Image("ISULogo")
                .resizable()
                .scaledToFit()
                .frame(width: 240)
                .accessibilityLabel("Iowa State University")

            Text("Andrew's")
                .font(.display(34))
                .foregroundStyle(Color.ink)

            Text("Meal prep for Cyclones. Pick up on campus.")
                .font(.body(17))
                .foregroundStyle(Color.inkSoft)
                .multilineTextAlignment(.center)

            Button("Sign in") {
                store.signIn(email: "jordan@iastate.edu")
            }
            .buttonStyle(PrimaryButtonStyle())
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.cream)
    }
}
