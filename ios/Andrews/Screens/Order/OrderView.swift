import SwiftUI

struct OrderView: View {
    var body: some View {
        Text("Order")
            .font(.display(34))
            .foregroundStyle(Color.ink)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.cream)
            .navigationTitle("Order")
    }
}
