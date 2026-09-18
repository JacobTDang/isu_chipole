import Foundation

/// Calendar dates for pickup and delivery. Dates travel as ISO "YYYY-MM-DD"
/// strings in the device's local time zone and every helper takes `now`
/// so it stays deterministic under test.
enum Schedule {
    static let weekdayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ]

    /// Slots that start less than this far from now are not offered today.
    static let leadTime: TimeInterval = 30 * 60

    static func todayISO(now: Date, calendar: Calendar = .current) -> String {
        iso(from: calendar.dateComponents([.year, .month, .day], from: now))
    }

    /// "Thu, Sep 24"
    static func formatDate(_ iso: String) -> String {
        formatter("EEE, MMM d").string(from: date(iso))
    }

    /// "Thursday"
    static func weekdayName(_ iso: String) -> String {
        formatter("EEEE").string(from: date(iso))
    }

    /// Every slot for a date after today, the slots still far enough away
    /// for today, and nothing for a date that has passed.
    static func availableSlots(dateISO: String, now: Date) -> [String] {
        let today = todayISO(now: now)
        if dateISO < today {
            return []
        }
        if dateISO > today {
            return Menu.timeSlots
        }
        let day = date(dateISO)
        let cutoff = now.addingTimeInterval(leadTime)
        return Menu.timeSlots.filter { slot in
            slotStart(slot, on: day) >= cutoff
        }
    }

    /// Today and its first open slot, or tomorrow at 7:00 AM once today is done.
    static func defaultSchedule(now: Date) -> (date: String, time: String) {
        let today = todayISO(now: now)
        if let first = availableSlots(dateISO: today, now: now).first {
            return (today, first)
        }
        let tomorrow = adding(days: 1, to: today)
        guard let first = availableSlots(dateISO: tomorrow, now: now).first else {
            preconditionFailure("Tomorrow has no time slots")
        }
        return (tomorrow, first)
    }

    /// The first date on or after `iso` that falls on `weekday` ("Sunday").
    static func nextDateForWeekday(from iso: String, weekday: String) -> String {
        guard let target = weekdayNames.firstIndex(of: weekday) else {
            preconditionFailure("Unknown weekday: \(weekday)")
        }
        let current = Calendar.current.component(.weekday, from: date(iso)) - 1
        let offset = (target - current + 7) % 7
        return adding(days: offset, to: iso)
    }

    /// Six rows of seven starting on Sunday. Cells outside the month are nil.
    static func monthGrid(yearMonth: String) -> [String?] {
        let first = date("\(yearMonth)-01")
        let calendar = Calendar.current
        guard let range = calendar.range(of: .day, in: .month, for: first) else {
            preconditionFailure("No day range for \(yearMonth)")
        }
        let leading = calendar.component(.weekday, from: first) - 1
        var cells: [String?] = Array(repeating: nil, count: leading)
        for day in range {
            cells.append(String(format: "%@-%02d", yearMonth, day))
        }
        cells.append(contentsOf: Array(repeating: nil, count: 42 - cells.count))
        return cells
    }

    /// "September 2026"
    static func monthTitle(yearMonth: String) -> String {
        formatter("MMMM yyyy").string(from: date("\(yearMonth)-01"))
    }

    /// "2026-09" for the month holding `iso`.
    static func yearMonth(of iso: String) -> String {
        String(iso.prefix(7))
    }

    static func yearMonth(adding months: Int, to yearMonth: String) -> String {
        let calendar = Calendar.current
        guard let moved = calendar.date(byAdding: .month, value: months, to: date("\(yearMonth)-01")) else {
            preconditionFailure("Could not move \(yearMonth) by \(months) months")
        }
        return String(todayISO(now: moved).prefix(7))
    }

    /// The local midnight for a well-formed ISO date, or nil when the string
    /// is not a real "YYYY-MM-DD" calendar date.
    static func parse(_ iso: String) -> Date? {
        let parts = iso.split(separator: "-", omittingEmptySubsequences: false)
        guard parts.count == 3,
              parts[0].count == 4, parts[1].count == 2, parts[2].count == 2,
              parts.allSatisfy({ $0.allSatisfy(\.isNumber) }),
              let year = Int(parts[0]), let month = Int(parts[1]), let day = Int(parts[2])
        else {
            return nil
        }
        let components = DateComponents(year: year, month: month, day: day)
        let calendar = Calendar.current
        guard let date = calendar.date(from: components),
              calendar.dateComponents([.year, .month, .day], from: date) == components
        else {
            return nil
        }
        return date
    }

    // MARK: - Private

    private static func date(_ iso: String) -> Date {
        guard let date = parse(iso) else {
            preconditionFailure("Malformed date: \(iso)")
        }
        return date
    }

    private static func iso(from components: DateComponents) -> String {
        guard let year = components.year, let month = components.month, let day = components.day else {
            preconditionFailure("Missing date components: \(components)")
        }
        return String(format: "%04d-%02d-%02d", year, month, day)
    }

    private static func adding(days: Int, to iso: String) -> String {
        guard let moved = Calendar.current.date(byAdding: .day, value: days, to: date(iso)) else {
            preconditionFailure("Could not move \(iso) by \(days) days")
        }
        return todayISO(now: moved)
    }

    /// "10:30 AM" on the given day, in local time.
    private static func slotStart(_ slot: String, on day: Date) -> Date {
        let pieces = slot.split(separator: " ")
        guard pieces.count == 2 else {
            preconditionFailure("Malformed slot: \(slot)")
        }
        let clock = pieces[0].split(separator: ":")
        guard clock.count == 2, var hour = Int(clock[0]), let minute = Int(clock[1]) else {
            preconditionFailure("Malformed slot: \(slot)")
        }
        switch pieces[1] {
        case "AM":
            if hour == 12 { hour = 0 }
        case "PM":
            if hour != 12 { hour += 12 }
        default:
            preconditionFailure("Malformed slot: \(slot)")
        }
        let calendar = Calendar.current
        guard let start = calendar.date(bySettingHour: hour, minute: minute, second: 0, of: day) else {
            preconditionFailure("No \(slot) on \(day)")
        }
        return start
    }

    private static func formatter(_ pattern: String) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.calendar = Calendar.current
        formatter.timeZone = Calendar.current.timeZone
        formatter.dateFormat = pattern
        return formatter
    }
}
