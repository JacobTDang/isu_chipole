import SwiftUI

struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body(17, weight: .semibold))
            .foregroundStyle(Color.card)
            .frame(maxWidth: .infinity, minHeight: 50)
            .background(configuration.isPressed ? Color.cardinalDeep : Color.cardinal)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .opacity(isEnabled ? 1 : 0.45)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body(17, weight: .semibold))
            .foregroundStyle(Color.cardinal)
            .frame(maxWidth: .infinity, minHeight: 50)
            .background(configuration.isPressed ? Color.line : Color.cream)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay {
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Color.line, lineWidth: 1)
            }
            .opacity(isEnabled ? 1 : 0.45)
    }
}

struct DarkButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body(17, weight: .semibold))
            .foregroundStyle(Color.card)
            .frame(maxWidth: .infinity, minHeight: 50)
            .background(configuration.isPressed ? Color.cardinalDeep : Color.ink)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .opacity(isEnabled ? 1 : 0.45)
    }
}
