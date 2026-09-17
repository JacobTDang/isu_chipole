import SwiftUI
import UIKit

struct MealImage: View {
    let name: String
    let fallbackLetter: String

    init(name: String, fallbackLetter: String) {
        self.name = name
        self.fallbackLetter = fallbackLetter
    }

    var body: some View {
        Group {
            if let image = UIImage(named: assetName) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
            } else {
                ZStack {
                    LinearGradient(
                        colors: [.cardinal, .cardinalDeep],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    Text(String(fallbackLetter.prefix(1)).uppercased())
                        .font(.display(54))
                        .foregroundStyle(Color.gold)
                }
            }
        }
        .clipped()
        .accessibilityHidden(true)
    }

    private var assetName: String {
        Menu.assetName(name)
    }
}
