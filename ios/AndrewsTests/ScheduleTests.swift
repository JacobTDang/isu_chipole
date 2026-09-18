import Foundation
import Testing
@testable import Andrews

struct ScheduleTests {
    private func at(_ hour: Int, _ minute: Int, day: Int = 18) -> Date {
        let components = DateComponents(year: 2026, month: 9, day: day, hour: hour, minute: minute)
        guard let date = Calendar.current.date(from: components) else {
            preconditionFailure("Could not build \(components)")
        }
        return date
    }

    @Test
    func todayISOUsesTheLocalCalendarDate() {
        #expect(Schedule.todayISO(now: at(10, 5)) == "2026-09-18")
        #expect(Schedule.todayISO(now: at(23, 59)) == "2026-09-18")
        #expect(Schedule.todayISO(now: at(0, 0)) == "2026-09-18")
    }

    @Test
    func formatsDatesAsWeekdayMonthDay() {
        #expect(Schedule.formatDate("2026-09-24") == "Thu, Sep 24")
        #expect(Schedule.formatDate("2026-10-04") == "Sun, Oct 4")
    }

    @Test
    func weekdayNameIsTheFullWeekday() {
        #expect(Schedule.weekdayName("2026-09-24") == "Thursday")
        #expect(Schedule.weekdayName("2026-09-20") == "Sunday")
    }

    @Test
    func todaysSlotsHideAnythingLessThanThirtyMinutesAway() {
        let slots = Schedule.availableSlots(dateISO: "2026-09-18", now: at(10, 5))
        #expect(slots.first == "11:00 AM")
        #expect(slots.last == "8:00 PM")
        #expect(!slots.contains("10:30 AM"))
    }

    @Test
    func todayHasNoSlotsOnceTheLastOneIsTooClose() {
        #expect(Schedule.availableSlots(dateISO: "2026-09-18", now: at(19, 45)).isEmpty)
    }

    @Test
    func earlyMorningKeepsEveryTodaySlot() {
        let slots = Schedule.availableSlots(dateISO: "2026-09-18", now: at(6, 0))
        #expect(slots.first == "7:00 AM")
        #expect(slots.count == 27)
    }

    @Test
    func futureDatesReturnEverySlot() {
        let slots = Schedule.availableSlots(dateISO: "2026-09-19", now: at(19, 45))
        #expect(slots.count == 27)
        #expect(slots == Menu.timeSlots)
    }

    @Test
    func pastDatesReturnNothing() {
        #expect(Schedule.availableSlots(dateISO: "2026-09-17", now: at(6, 0)).isEmpty)
    }

    @Test
    func defaultScheduleIsTodayAndItsFirstSlot() {
        let schedule = Schedule.defaultSchedule(now: at(10, 5))
        #expect(schedule.date == "2026-09-18")
        #expect(schedule.time == "11:00 AM")
    }

    @Test
    func defaultScheduleRollsToTomorrowWhenTodayIsDone() {
        let schedule = Schedule.defaultSchedule(now: at(19, 45))
        #expect(schedule.date == "2026-09-19")
        #expect(schedule.time == "7:00 AM")
    }

    @Test
    func nextDateForWeekdayFindsTheFirstMatchOnOrAfter() {
        #expect(Schedule.nextDateForWeekday(from: "2026-09-18", weekday: "Sunday") == "2026-09-20")
        #expect(Schedule.nextDateForWeekday(from: "2026-09-18", weekday: "Friday") == "2026-09-18")
        #expect(Schedule.nextDateForWeekday(from: "2026-09-18", weekday: "Thursday") == "2026-09-24")
    }

    @Test
    func monthGridStartsOnSundayAndHasSixWeeks() {
        let grid = Schedule.monthGrid(yearMonth: "2026-09")
        #expect(grid.count == 42)
        #expect(grid[2] == "2026-09-01")
        #expect(grid[0] == nil)
        #expect(grid[1] == nil)
        #expect(grid[31] == "2026-09-30")
        #expect(grid[32] == nil)
        #expect(grid.compactMap { $0 }.count == 30)
    }

    @Test
    func monthGridHandlesLeapFebruary() {
        let grid = Schedule.monthGrid(yearMonth: "2028-02")
        #expect(grid.compactMap { $0 }.count == 29)
        #expect(grid[2] == "2028-02-01")
    }

    @Test
    func parsesOnlyRealCalendarDates() {
        #expect(Schedule.parse("2026-09-24") != nil)
        #expect(Schedule.parse("2026-02-30") == nil)
        #expect(Schedule.parse("2026-13-01") == nil)
        #expect(Schedule.parse("Thursday") == nil)
        #expect(Schedule.parse("2026-9-4") == nil)
        #expect(Schedule.parse("") == nil)
    }
}
