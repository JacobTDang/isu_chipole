# PrepPal — Calendar date picker

Addendum. Date: 2026-09-18. Applies to web (`src/`) and iOS (`ios/`). Replaces the weekday chip row from the previous addendum with a real calendar date.

## Behavior

- Checkout has a "Pickup date" row (labeled "Delivery date" in delivery mode) showing the chosen date as "Thu, Sep 24". Tapping it opens a calendar sheet.
- The calendar shows one month at a time with previous and next month controls, weekday headers, and day cells. Days before today are disabled and greyed. Today is outlined in cardinal. The selected day is filled gold with a cardinal border. Selecting a day closes the sheet. Month navigation cannot go before the current month.
- Default date is today.
- Time slots stay every 30 minutes from 7:00 AM to 8:00 PM. When the selected date is today, slots that start less than 30 minutes from now are hidden. If none remain for today, the date defaults to tomorrow instead. The default time is the first available slot for the selected date. Changing the date resets the time to the first available slot if the current one is no longer available.
- Confirmation title stays "See you {weekday}." using the chosen date's weekday. The ticket's day line becomes "Date … Thu, Sep 24". "Ready at {time}" and "Arrives at {time}" unchanged.
- Account order history shows the chosen date as "Thu, Sep 24" instead of the placed date.

## Data contract

```
Order.date: string   // ISO calendar date "YYYY-MM-DD" in the device's local time zone, replaces Order.day
```

Web stores the string as is. iOS stores a `String` too, so both serialize identically. The `PickupDay` type and `PICKUP_DAYS` constant are removed on both platforms.

Legacy orders that have `day` and no `date` load with `date` set to the first date on or after their `placedAt` date whose weekday matches `day`. Orders with neither, or with a malformed `date`, are invalid and throw as before.

## Pure helpers, unit tested on both platforms, all taking `now` as a parameter for determinism

- `todayISO(now)` returns the local calendar date as "YYYY-MM-DD".
- `formatDate(iso)` returns "Thu, Sep 24". `weekdayName(iso)` returns "Thursday".
- `availableSlots(dateISO, now)` returns the full slot list for any date after today, the filtered list for today, and an empty list for past dates.
- `defaultSchedule(now)` returns `{ date, time }`: today and its first available slot, or tomorrow and "7:00 AM" when today has no slots left.
- `nextDateForWeekday(fromISO, weekday)` for the legacy migration.
- `monthGrid(yearMonth)` returns the six-by-seven grid of ISO dates or nulls used by the calendar, starting on Sunday.

Test cases: at 2026-09-18 10:05 local, `availableSlots` for today starts at "11:00 AM" (a slot is shown only when it starts at least 30 minutes from now, so 10:30 is excluded) and ends at "8:00 PM"; at 19:30 today has "8:00 PM" only; at 19:45 today has none and `defaultSchedule` gives tomorrow at "7:00 AM"; at 06:00 today starts at "7:00 AM"; a date after today returns all 27; a past date returns none. `formatDate("2026-09-24")` is "Thu, Sep 24". `nextDateForWeekday("2026-09-18", "Sunday")` is "2026-09-20" and for "Friday" is "2026-09-18". `monthGrid("2026-09")` puts "2026-09-01" at index 2 (Tuesday) and has 30 dates.

## Tests

- Unit tests above on both platforms.
- The iOS UI walkthrough asserts the checkout date row shows today's formatted date, opens the calendar, picks a day at least one day ahead within the visible month (or navigates to next month if today is the last day), and asserts the confirmation title matches that day's weekday and the ticket shows the formatted date. It must not hard-code a weekday.
- The web click-through does the same.
