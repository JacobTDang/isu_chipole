import SwiftUI

enum BuilderMode: Hashable {
    case new(MealTypeId)
    case preset(String)
    case edit(String)
}

struct BuilderView: View {
    @Environment(AppStore.self) private var store

    let mode: BuilderMode

    init(mode: BuilderMode) {
        self.mode = mode
    }

    var body: some View {
        switch mode {
        case .new(let typeId):
            let type = Menu.mealType(typeId)
            BuilderForm(
                mode: mode,
                initial: Selection(
                    mealType: type.id,
                    ingredientIds: type.id == .pasta ? ["pasta"] : [],
                    quantity: 1
                ),
                title: type.name,
                image: type.image
            )
        case .preset(let presetId):
            let preset = Menu.preset(presetId)
            let safe = Allergies.removingConflicts(from: preset.ingredientIds, allergies: store.prefs.allergies)
            BuilderForm(
                mode: mode,
                initial: Selection(
                    mealType: preset.mealType,
                    ingredientIds: safe.kept,
                    quantity: 1,
                    presetId: preset.id
                ),
                title: preset.name,
                image: preset.image,
                banner: safe.banner
            )
        case .edit(let itemId):
            let item = bagItem(itemId)
            let type = Menu.mealType(item.selection.mealType)
            BuilderForm(mode: mode, initial: item.selection, title: type.name, image: type.image)
        }
    }

    private func bagItem(_ id: String) -> BagItem {
        guard let item = store.bag.first(where: { $0.id == id }) else {
            preconditionFailure("Unknown bag item: \(id)")
        }
        return item
    }
}

private struct SectionSpec {
    let group: IngredientGroup
    let title: String
    let rule: String
    let mode: BuilderSectionMode
}

private let sectionSpecs: [SectionSpec] = [
    SectionSpec(group: .base, title: "Base", rule: "Choose one · required", mode: .one),
    SectionSpec(group: .protein, title: "Protein", rule: "Choose one · required", mode: .one),
    SectionSpec(group: .veggies, title: "Veggies", rule: "Choose any", mode: .many),
    SectionSpec(group: .toppings, title: "Toppings", rule: "Choose any", mode: .many),
    SectionSpec(group: .sauce, title: "Sauce", rule: "Choose one", mode: .one),
    SectionSpec(group: .extras, title: "Extras", rule: "Choose any", mode: .many),
]

private struct BuilderForm: View {
    @Environment(AppStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    let mode: BuilderMode
    let title: String
    let image: String
    let banner: String?
    @State private var selection: Selection

    init(mode: BuilderMode, initial: Selection, title: String, image: String, banner: String? = nil) {
        self.mode = mode
        self.title = title
        self.image = image
        self.banner = banner
        _selection = State(initialValue: initial)
    }

    private var isEditing: Bool {
        if case .edit = mode { return true }
        return false
    }

    private var requiredComplete: Bool {
        selectedIds(in: .base).count == 1 && selectedIds(in: .protein).count == 1
    }

    private var nameBinding: Binding<String> {
        Binding(
            get: { selection.name ?? "" },
            set: { selection.name = $0 }
        )
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                hero
                MacroLine(calories: macros.calories, protein: macros.protein, goalStatus: goalStatus)

                if let banner {
                    removedBanner(banner)
                }

                ForEach(Array(sectionSpecs.enumerated()), id: \.offset) { index, spec in
                    if index > 0 {
                        hairline
                    }
                    BuilderSection(
                        title: spec.title,
                        rule: spec.rule,
                        options: Menu.ingredients(in: spec.group, mealType: selection.mealType),
                        selected: selectedIds(in: spec.group),
                        mode: spec.mode,
                        allergies: store.prefs.allergies
                    ) { ids in
                        change(group: spec.group, to: ids)
                    }
                }

                hairline
                nameAndQuantity
            }
        }
        .background(Color.cream)
        .scrollDismissesKeyboard(.interactively)
        .safeAreaInset(edge: .bottom, spacing: 0) {
            ticketBar
        }
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var macros: (calories: Int, protein: Int) {
        Pricing.macros(selection)
    }

    private var goalStatus: (onTarget: Bool, message: String)? {
        guard let goal = store.prefs.goal else { return nil }
        return Pricing.goalStatus(goal, macros: macros)
    }

    private func removedBanner(_ text: String) -> some View {
        Text(text)
            .font(.body(15, weight: .semibold))
            .foregroundStyle(Color.cardinal)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.cardinal.opacity(0.08))
    }

    private var hero: some View {
        MealImage(name: image, fallbackLetter: title)
            .frame(height: 200)
            .frame(maxWidth: .infinity)
            .clipped()
            .overlay(alignment: .bottom) {
                LinearGradient(
                    colors: [Color.ink.opacity(0), Color.ink.opacity(0.45)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(height: 56)
                .allowsHitTesting(false)
            }
            .background(Color.card)
    }

    private var hairline: some View {
        Rectangle()
            .fill(Color.line)
            .frame(height: 1)
    }

    private var nameAndQuantity: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Name this meal")
                .font(.display(22))
                .foregroundStyle(Color.ink)
            Text("Optional — save a favorite for next time.")
                .font(.body(13))
                .foregroundStyle(Color.inkSoft)
                .padding(.top, 4)

            TextField("My post-workout bowl", text: nameBinding)
                .font(.body(17))
                .foregroundStyle(Color.ink)
                .textInputAutocapitalization(.sentences)
                .padding(.horizontal, 16)
                .frame(minHeight: 44)
                .background(Color.card)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay {
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.line, lineWidth: 1)
                }
                .padding(.top, 12)

            HStack {
                Text("Quantity")
                    .font(.body(17, weight: .semibold))
                    .foregroundStyle(Color.ink)
                Spacer()
                QuantityStepper(value: $selection.quantity, range: 1...10)
            }
            .padding(.top, 20)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 24)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var ticketBar: some View {
        TicketView(lines: [], prominentLine: ticketLine) {
            if let budgetLine {
                Text(budgetLine.text)
                    .font(.ticket(13))
                    .foregroundStyle(budgetLine.over ? Color.cardinal : Color.inkSoft)
                    .monospacedDigit()
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
            Button(isEditing ? "Save changes" : "Add to bag") {
                submit()
            }
            .buttonStyle(PrimaryButtonStyle())
            .disabled(!requiredComplete)
        }
        .padding(.horizontal, 12)
        .padding(.top, 6)
        .padding(.bottom, 8)
        .background(Color.cream)
    }

    private var ticketLine: TicketLine {
        guard requiredComplete else {
            return TicketLine(label: "Choose a base and a protein", amount: "")
        }
        let count = selection.quantity
        return TicketLine(
            label: "\(count) meal\(count == 1 ? "" : "s")",
            amount: Pricing.money(Pricing.itemPrice(selection))
        )
    }

    /// "Budget $10.00 · $2.25 left", or "$1.50 over budget" once the meal
    /// costs more than the budget. Guidance only; adding stays enabled.
    private var budgetLine: (text: String, over: Bool)? {
        guard requiredComplete, let budget = store.prefs.budget else { return nil }
        let status = Pricing.budgetStatus(budget: budget, price: Pricing.itemPrice(selection))
        if status.over {
            return ("\(Pricing.money(-status.remaining)) over budget", true)
        }
        return ("Budget \(Pricing.money(budget)) · \(Pricing.money(status.remaining)) left", false)
    }

    private func selectedIds(in group: IngredientGroup) -> [String] {
        selection.ingredientIds.filter { Menu.ingredient($0).group == group }
    }

    private func change(group: IngredientGroup, to ids: [String]) {
        let kept = selection.ingredientIds.filter { Menu.ingredient($0).group != group }
        selection.ingredientIds = kept + ids
    }

    private func submit() {
        guard requiredComplete else { return }
        var final = selection
        let cleanName = (selection.name ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
        final.name = cleanName.isEmpty ? nil : cleanName

        switch mode {
        case .edit(let id):
            store.update(id, final)
            store.showToast("Saved changes.")
        case .new, .preset:
            store.add(final)
            if final.name != nil {
                store.save(final)
            }
        }
        dismiss()
    }
}
