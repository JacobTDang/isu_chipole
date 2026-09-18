import SwiftUI

/// One month at a time, Sunday first. Days that have passed are disabled,
/// today is outlined, and the chosen day is filled. Picking a day closes
/// the sheet.
struct DateSheet: View {
    let title: String
    @Binding var selection: String
    private let now: Date

    @Environment(\.dismiss) private var dismiss
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var month: String

    private static let weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    private static let cellSize: CGFloat = 44
    private static let columns = Array(repeating: GridItem(.flexible(), spacing: 4), count: 7)

    init(title: String, selection: Binding<String>, now: Date = Date()) {
        self.title = title
        _selection = selection
        self.now = now
        _month = State(initialValue: Schedule.yearMonth(of: selection.wrappedValue))
    }

    private var today: String {
        Schedule.todayISO(now: now)
    }

    private var isOnCurrentMonth: Bool {
        month == Schedule.yearMonth(of: today)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    header
                    grid
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .background(Color.cream)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    private var header: some View {
        HStack(spacing: 8) {
            monthButton("chevron.left", label: "Previous month", disabled: isOnCurrentMonth) {
                move(by: -1)
            }
            Spacer(minLength: 0)
            Text(Schedule.monthTitle(yearMonth: month))
                .font(.body(17, weight: .semibold))
                .foregroundStyle(Color.ink)
            Spacer(minLength: 0)
            monthButton("chevron.right", label: "Next month", disabled: false) {
                move(by: 1)
            }
        }
    }

    private func monthButton(
        _ symbol: String,
        label: String,
        disabled: Bool,
        action: @escaping () -> Void
    ) -> some View {
        Button(action: action) {
            Image(systemName: symbol)
                .font(.body(15, weight: .semibold))
                .foregroundStyle(disabled ? Color.inkSoft.opacity(0.4) : Color.cardinal)
                .frame(width: Self.cellSize, height: Self.cellSize)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(disabled)
        .accessibilityLabel(label)
    }

    private var grid: some View {
        LazyVGrid(columns: Self.columns, spacing: 4) {
            ForEach(Self.weekdayHeaders, id: \.self) { name in
                Text(name)
                    .font(.body(13, weight: .semibold))
                    .foregroundStyle(Color.inkSoft)
                    .frame(maxWidth: .infinity, minHeight: 24)
                    .accessibilityHidden(true)
            }
            ForEach(Array(Schedule.monthGrid(yearMonth: month).enumerated()), id: \.offset) { _, iso in
                if let iso {
                    dayCell(iso)
                } else {
                    Color.clear
                        .frame(height: Self.cellSize)
                        .accessibilityHidden(true)
                }
            }
        }
    }

    private func dayCell(_ iso: String) -> some View {
        let isSelected = iso == selection
        let isToday = iso == today
        let isOpen = !Schedule.availableSlots(dateISO: iso, now: now).isEmpty
        let borderColor: Color = isSelected || isToday ? Color.cardinal : Color.clear
        return Button {
            selection = iso
            dismiss()
        } label: {
            Text(dayNumber(iso))
                .font(.body(17, weight: isSelected || isToday ? .semibold : .regular))
                .foregroundStyle(isOpen ? Color.ink : Color.inkSoft)
                .monospacedDigit()
                .frame(maxWidth: .infinity, minHeight: Self.cellSize)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(isSelected ? Color.gold : Color.card)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(borderColor, lineWidth: 1.5)
                )
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(!isOpen)
        .accessibilityLabel(iso)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }

    private func dayNumber(_ iso: String) -> String {
        guard let day = Int(iso.suffix(2)) else {
            preconditionFailure("Malformed date: \(iso)")
        }
        return String(day)
    }

    private func move(by months: Int) {
        let next = Schedule.yearMonth(adding: months, to: month)
        if reduceMotion {
            month = next
        } else {
            withAnimation(.easeOut(duration: 0.15)) {
                month = next
            }
        }
    }
}
