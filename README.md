# Lockr

A React Native app built with [Expo](https://expo.dev).

## Stack

| Concern    | Library                                                          |
| ---------- | ---------------------------------------------------------------- |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/)        |
| Styling    | [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)         |
| Backend    | [Firebase](https://firebase.google.com/) — Firestore, Auth, FCM  |
| State      | [Zustand](https://zustand.docs.pmnd.rs/)                         |

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure Firebase. Copy the example env file and fill in the values from
   your Firebase project settings:

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npx expo start
   ```

## Project structure

```
src/
├── app/                 # Expo Router routes (file-based navigation)
├── components/          # Reusable UI components
├── constants/           # Theme and shared constants
├── features/            # Feature modules (components + logic per feature)
├── hooks/               # Reusable React hooks
├── lib/
│   └── firebase/        # Firebase init + Auth / Firestore / Messaging helpers
├── services/            # Domain/business-logic services
├── store/               # Zustand stores
├── types/               # Shared TypeScript types
├── utils/               # Utilities (e.g. `cn` className helper)
└── global.css           # Tailwind directives + theme variables
```

## Styling

NativeWind is wired through `babel.config.js`, `metro.config.js`, and
`tailwind.config.js`. `src/global.css` is imported once in
`src/app/_layout.tsx`. Use Tailwind classes via the `className` prop:

```tsx
<View className="flex-1 items-center justify-center bg-white dark:bg-black">
  <Text className="text-lg font-bold">Hello Lockr</Text>
</View>
```

## Firebase

Initialization lives in `src/lib/firebase/config.ts` (reads `EXPO_PUBLIC_*`
env vars). Auth persistence uses AsyncStorage on native. Push messaging
(`messaging.ts`) uses `firebase/messaging` on web and `expo-notifications`
(brokering FCM/APNs) on native — native push requires a dev/standalone build
with FCM credentials configured.
