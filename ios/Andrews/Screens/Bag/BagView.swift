import SwiftUI

struct BagView: View {
    var body: some View {
        Text("Bag")
            .font(.display(34))
            .foregroundStyle(Color.ink)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.cream)
            .navigationTitle("Bag")
    }
}
