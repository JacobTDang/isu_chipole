import SwiftUI

struct MacroLine: View {
    let calories: Int
    let protein: Int
    let goalStatus: (onTarget: Bool, message: String)?

    /// - Parameter goalStatus: When a goal is set, "On target" in veg green
    ///   or the miss, such as "12g protein short", in cardinal.
    init(calories: Int, protein: Int, goalStatus: (onTarget: Bool, message: String)? = nil) {
        self.calories = calories
        self.protein = protein
        self.goalStatus = goalStatus
    }

    var body: some View {
        HStack(spacing: 24) {
            macro(systemName: "flame", text: "\(calories) cal")
            macro(systemName: "dumbbell", text: "\(protein)g protein")
            if let goalStatus {
                macro(systemName: "target", text: goalStatus.message)
                    .foregroundStyle(goalStatus.onTarget ? Color.veg : Color.cardinal)
            }
        }
        .font(.body(13, weight: .semibold))
        .foregroundStyle(Color.inkSoft)
        .monospacedDigit()
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(Color.card)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(Color.line)
                .frame(height: 1)
        }
    }

    private func macro(systemName: String, text: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: systemName)
                .font(.body(15, weight: .light))
                .foregroundStyle(Color.cardinal)
                .accessibilityHidden(true)
            Text(text)
        }
    }
}
