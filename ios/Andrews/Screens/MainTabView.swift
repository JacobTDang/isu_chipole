import SwiftUI

struct MainTabView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        @Bindable var store = store

        TabView(selection: $store.selectedTab) {
            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label("Home", systemImage: "house")
            }
            .tag(Tab.home)

            NavigationStack {
                OrderView()
            }
            .tabItem {
                Label("Order", systemImage: "fork.knife")
            }
            .tag(Tab.order)

            NavigationStack {
                BagView()
            }
            .tabItem {
                Label("Bag", systemImage: "bag")
            }
            .badge(Pricing.mealCount(store.bag))
            .tag(Tab.bag)

            NavigationStack {
                AccountView()
            }
            .tabItem {
                Label("Account", systemImage: "person")
            }
            .tag(Tab.account)
        }
        .tint(.cardinal)
    }
}
