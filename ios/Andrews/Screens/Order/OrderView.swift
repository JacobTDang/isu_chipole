import SwiftUI

private enum OrderSegment: String, CaseIterable, Hashable {
    case all
    case bowl
    case wrap
    case pasta
    case salad
    case breakfast

    var label: String {
        switch self {
        case .all:
            return "All"
        case .bowl:
            return "Bowls"
        case .wrap:
            return "Wraps"
        case .pasta:
            return "Pasta"
        case .salad:
            return "Salads"
        case .breakfast:
            return "Breakfast"
        }
    }

    var mealType: MealTypeId? {
        switch self {
        case .all:
            return nil
        case .bowl:
            return .bowl
        case .wrap:
            return .wrap
        case .pasta:
            return .pasta
        case .salad:
            return .salad
        case .breakfast:
            return .breakfast
        }
    }
}

struct OrderView: View {
    @Environment(AppStore.self) private var store
    @State private var segment: OrderSegment = .all
    @State private var filters: Set<OrderFilter> = []
    @State private var seededFromPrefs = false

    private var buildType: MealType {
        Menu.mealType(segment.mealType ?? .bowl)
    }

    private var meals: [PresetMeal] {
        Menu.presets.filter { meal in
            if let type = segment.mealType, meal.mealType != type { return false }
            return filters.allSatisfy { $0.matches(meal) }
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                ScrollingSegments(
                    options: OrderSegment.allCases.map { (id: $0, label: $0.label) },
                    selection: $segment
                )

                VStack(alignment: .leading, spacing: 16) {
                    FilterChips(selected: $filters)

                    VStack(spacing: 12) {
                        buildYourOwnCard
                        ForEach(meals) { meal in
                            presetRow(meal)
                        }
                        if meals.isEmpty {
                            Text("No preset meals match these filters. Build your own instead.")
                                .font(.body(15))
                                .foregroundStyle(Color.inkSoft)
                                .multilineTextAlignment(.center)
                                .frame(maxWidth: .infinity)
                                .padding(20)
                                .cardSurface()
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
            .padding(.bottom, 32)
        }
        .background(Color.cream.ignoresSafeArea())
        .navigationTitle("Order")
        .navigationBarTitleDisplayMode(.large)
        .onAppear(perform: seedFilters)
    }

    private func seedFilters() {
        guard !seededFromPrefs else { return }
        seededFromPrefs = true
        if store.prefs.highProtein { filters.insert(.highProtein) }
        if store.prefs.vegetarian { filters.insert(.vegetarian) }
    }

    private var buildYourOwnCard: some View {
        NavigationLink {
            BuilderView(mode: .new(buildType.id))
        } label: {
            HStack(spacing: 16) {
                Circle()
                    .fill(Color.gold)
                    .frame(width: 48, height: 48)
                    .overlay {
                        Image(systemName: "plus")
                            .font(.body(22, weight: .semibold))
                            .foregroundStyle(Color.ink)
                    }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Build your own \(buildType.name.lowercased())")
                        .font(.display(20))
                        .foregroundStyle(Color.card)
                    Text("Start from \(Pricing.money(buildType.basePrice))")
                        .font(.body(13))
                        .foregroundStyle(Color.card.opacity(0.8))
                        .monospacedDigit()
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Image(systemName: "arrow.right")
                    .font(.body(20, weight: .semibold))
                    .foregroundStyle(Color.card)
            }
            .padding(16)
            .frame(maxWidth: .infinity, minHeight: 96, alignment: .leading)
            .background(
                LinearGradient(
                    colors: [.cardinal, .cardinalDeep],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .shadow(color: Color.ink.opacity(0.05), radius: 2, y: 1)
            .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }

    private func presetRow(_ meal: PresetMeal) -> some View {
        let selection = Selection(mealType: meal.mealType, ingredientIds: meal.ingredientIds, quantity: 1, presetId: meal.id)
        let nutrition = Pricing.macros(selection)
        return NavigationLink {
            BuilderView(mode: .preset(meal.id))
        } label: {
            HStack(alignment: .top, spacing: 12) {
                Color.clear
                    .frame(width: 96, height: 96)
                    .overlay {
                        MealImage(name: meal.image, fallbackLetter: meal.name)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                VStack(alignment: .leading, spacing: 4) {
                    HStack(alignment: .top, spacing: 8) {
                        Text(meal.name)
                            .font(.display(18))
                            .foregroundStyle(Color.ink)
                            .multilineTextAlignment(.leading)
                        Spacer(minLength: 0)
                        Text(Pricing.money(Pricing.itemPrice(selection)))
                            .font(.body(15, weight: .semibold))
                            .foregroundStyle(Color.cardinal)
                            .monospacedDigit()
                    }
                    Text(meal.blurb)
                        .font(.body(13))
                        .foregroundStyle(Color.inkSoft)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    Text("\(nutrition.calories) cal · \(nutrition.protein)g protein")
                        .font(.body(13, weight: .semibold))
                        .foregroundStyle(Color.inkSoft)
                        .padding(.top, 4)
                }
                .padding(.vertical, 4)
            }
            .padding(12)
            .frame(maxWidth: .infinity, minHeight: 112, alignment: .leading)
            .cardSurface()
            .contentShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }
}
