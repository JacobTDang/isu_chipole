# PrepPal

Meal prep for Iowa State students. Pick a preset meal or build your own Chipotle-style, choose a weekly plan, and pick up on campus.

## Download

Mac users: get the newest build at https://github.com/JacobTDang/isu_chipole/releases/latest and download `PrepPal-mac.dmg`. It runs on both Intel and Apple Silicon Macs.

1. Open the dmg and drag PrepPal into Applications.
2. On first launch, open System Settings, go to Privacy & Security, scroll down, and click Open Anyway next to PrepPal. This only happens once.
3. Sign in with any email. The promo code `CYCLONE10` takes 10% off.

Every push to `main` rebuilds this download automatically.

This repo holds two versions of the same app:

- **Web app** in the root folder. Runs in any browser and installs to an iPhone home screen.
- **Native iOS app** in `ios/`. SwiftUI, runs in the iOS Simulator or on an iPhone.

Both are prototypes. There is no backend; orders and sign-in live on the device.

## Easiest way to try it

If there is a live link, open it on your phone. In Safari tap Share, then "Add to Home Screen". It opens full screen with its own icon. Nothing to install.

## Run the web app on your computer

You need [Node.js](https://nodejs.org) (the LTS version). Then:

```
npm install
npm run dev
```

Open http://localhost:3000. Sign in with any email. The promo code `CYCLONE10` takes 10% off.

## Run the iOS app

You need a Mac with [Xcode](https://apps.apple.com/app/xcode/id497799835) from the Mac App Store (a large download).

1. Open `ios/Andrews.xcodeproj` in Xcode.
2. At the top, pick a simulator such as iPhone 17 Pro.
3. Press the Run button.

To run on your own iPhone: plug it in, choose it as the destination, and under the Andrews target's Signing settings pick your personal Apple ID as the team. The first run asks you to trust the developer on the phone under Settings, General, VPN and Device Management.

## Mac desktop app

The web app can also be built as a double-clickable Mac app. You need Node.js, [Rust](https://rustup.rs), and Xcode's command line tools (`xcode-select --install`). Then:

```
npm install
npm run tauri build
```

The installer lands at `src-tauri/target/release/bundle/dmg/PrepPal_0.1.0_aarch64.dmg`. Open it and drag PrepPal into Applications.

The app is not signed with an Apple developer certificate, so the first launch says it is from an unidentified developer. Open System Settings, go to Privacy & Security, scroll down, and click Open Anyway next to PrepPal. This only happens once.

## Change the menu

- Web: meals, ingredients, and prices are in `src/data/menu.ts`. Photos are in `public/meals/`.
- iOS: the same data is in `ios/Andrews/Model/Menu.swift`. Photos are in `ios/Andrews/Assets.xcassets`.

## Tests

```
npm test
```

iOS unit and UI tests run from Xcode with Product, Test, or:

```
xcodebuild -project ios/Andrews.xcodeproj -scheme Andrews -destination 'platform=iOS Simulator,name=iPhone 17 Pro' test
```
