import SwiftUI

struct ToastView: View {
    @Environment(AppStore.self) private var store
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Group {
            if let message = store.toast {
                Text(message)
                    .font(.body(15, weight: .semibold))
                    .foregroundStyle(Color.card)
                    .padding(.horizontal, 18)
                    .frame(minHeight: 44)
                    .background(Color.ink)
                    .clipShape(Capsule())
                    .shadow(color: Color.ink.opacity(0.18), radius: 12, y: 6)
                    .transition(
                        reduceMotion
                            ? .opacity
                            : .move(edge: .bottom).combined(with: .opacity)
                    )
            }
        }
        .animation(reduceMotion ? nil : .easeOut(duration: 0.2), value: store.toast)
    }
}
