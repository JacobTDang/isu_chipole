import Foundation

extension Menu {
    private static let addOnImages: [String: String] = [
        "protein-shake": "protein-shake",
        "cookie": "cookie",
    ]

    /// Asset catalog name for the photo that represents a selection.
    static func image(for selection: Selection) -> String {
        let selected = selection.ingredientIds.map(ingredient)
        let extrasOnly = !selected.isEmpty && selected.allSatisfy { $0.group == .extras }
        if extrasOnly {
            let addOns = selected.compactMap { addOnImages[$0.id] }
            if addOns.count == 1 { return addOns[0] }
        }
        if let presetId = selection.presetId {
            return assetName(preset(presetId).image)
        }
        return assetName(mealType(selection.mealType).image)
    }

    /// Strips a menu image path such as "/meals/bowl.jpg" down to its asset catalog name "bowl".
    static func assetName(_ image: String) -> String {
        let filename = image.components(separatedBy: "/").last ?? image
        return filename.components(separatedBy: ".").first ?? filename
    }
}
