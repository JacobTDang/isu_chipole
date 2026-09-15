import SwiftUI

struct HomeView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        Group {
            if let user = store.user {
                content(firstName: user.firstName)
            }
        }
        .background(Color.cream.ignoresSafeArea())
    }

    private func content(firstName: String) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                RewardsBar(orders: store.orders)
                    .padding(.horizontal, 16)

                section("Your usual") {
                    UsualRow(orders: store.orders)
                }

                section("Start an order") {
                    MealTypeGrid()
                        .padding(.horizontal, 16)
                }

                section("Preset meals") {
                    PresetRow()
                }
            }
            .padding(.bottom, 32)
        }
        .navigationTitle("Hey, \(firstName)")
        .navigationBarTitleDisplayMode(.large)
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.display(22))
                .foregroundStyle(Color.ink)
                .padding(.horizontal, 16)
            content()
        }
        .padding(.top, 28)
    }
}

struct CardSurface: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(Color.card)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay {
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.line, lineWidth: 1)
            }
            .shadow(color: Color.ink.opacity(0.05), radius: 2, y: 1)
    }
}

extension View {
    func cardSurface() -> some View {
        modifier(CardSurface())
    }
}
