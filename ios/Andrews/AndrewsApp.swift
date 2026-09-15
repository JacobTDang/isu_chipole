import SwiftUI

@main
struct AndrewsApp: App {
    @State private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            ZStack(alignment: .bottom) {
                Color.cream
                    .ignoresSafeArea()

                Group {
                    if store.user == nil {
                        LoginView()
                    } else {
                        MainTabView()
                    }
                }

                ToastView()
                    .padding(.bottom, store.user == nil ? 24 : 82)
            }
            .environment(store)
            .tint(.cardinal)
            .dynamicTypeSize(...DynamicTypeSize.xLarge)
        }
    }
}
