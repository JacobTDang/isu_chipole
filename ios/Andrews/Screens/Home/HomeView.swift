import SwiftUI

struct HomeView: View {
    var body: some View {
        Text("Home")
            .font(.display(34))
            .foregroundStyle(Color.ink)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.cream)
            .navigationTitle("Home")
    }
}
