import SwiftUI

extension Color {
    static let cardinal = Color(hex: 0xC8102E)
    static let cardinalDeep = Color(hex: 0x8E0B21)
    static let gold = Color(hex: 0xF1BE48)
    static let cream = Color(hex: 0xFBF5E6)
    static let card = Color(hex: 0xFFFDF8)
    static let ink = Color(hex: 0x2B1114)
    static let inkSoft = Color(hex: 0x7A5C60)
    static let line = Color(hex: 0xEADFC8)
    static let veg = Color(hex: 0x5B7A3A)

    private init(hex: UInt32) {
        self.init(
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255
        )
    }
}

extension Font {
    static func display(_ size: CGFloat) -> Font {
        .custom("Bricolage Grotesque", size: size).weight(.heavy)
    }

    static func body(_ size: CGFloat, weight: Weight = .regular) -> Font {
        .custom("Instrument Sans", size: size).weight(weight)
    }

    static func ticket(_ size: CGFloat) -> Font {
        .custom("JetBrains Mono", size: size).weight(.medium)
    }
}
