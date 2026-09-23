# Pawlog – mobilapp

En dagbok för hunden. Varje dag lägger du upp en bild, en kort rubrik, en
berättelse om vad hunden gjorde och ett träningsmål som du kan bocka av när det
sitter.

Det här repot innehåller **mobilappen** (React Native med Expo). Den är en av
tre delar i plattformen:

| Del | Teknik | Repo |
| --- | --- | --- |
| Webbapp | React + TypeScript | [WebappIsak](https://github.com/isakpro/WebappIsak) |
| Backend / API | ASP.NET WebAPI | [pawlog-api](https://github.com/isakpro/pawlog-api) |
| Mobilapp | React Native (Expo) | det här repot |

Mobilappen ska använda samma API som webbappen och alltså visa samma inlägg.

## Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) 20.19.4, 22.13 eller 24.3 och senare
  (React Native 0.86 kräver det)
- npm (följer med Node)
- Ett sätt att köra appen, något av:
  - [Expo Go](https://expo.dev/go) på en Android- eller iPhone-telefon
  - en Android-emulator via [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)
  - en webbläsare

Kontrollera versionen:

```bash
node -v
```

### Starta appen

```bash
git clone https://github.com/isakpro/pawlog-app.git
cd pawlog-app
npm install
npx expo start
```

Terminalen visar en QR-kod och en meny. Välj sedan var appen ska köras:

- **Expo Go:** skanna QR-koden med kameran (iPhone) eller i Expo Go-appen
  (Android). Telefonen och datorn måste vara på samma nätverk
- **Android-emulator:** tryck `a` medan emulatorn är igång
- **Webbläsare:** tryck `w`

Stoppa servern med `Ctrl + C`.

### Övriga kommandon

| Kommando | Gör |
| --- | --- |
| `npx expo start` | Startar utvecklingsservern (Metro) |
| `npm run android` | Startar och öppnar appen i Android-emulatorn |
| `npm run web` | Startar och öppnar appen i webbläsaren |
| `npm run lint` | Kör ESLint via Expo |

## Projektstruktur

```
src/
  app/             skärmarna, en fil per route (Expo Router)
  components/      ThemedText och ThemedView, text och ytor som följer temat
  constants/       theme.ts - färger för ljust och mörkt läge, typsnitt, spacing
  hooks/           useTheme - väljer färger efter telefonens inställning
assets/            appikon och startskärm
```

## Tekniska val

**Expo istället för ren React Native.** Appen går att starta med ett enda
kommando och testa direkt i Expo Go, utan att bygga något med Xcode eller
Android Studio. Samma kod körs på Android, iOS och webben.

**Expo Router för navigeringen.** Skärmarna är filer i `src/app`, på samma sätt
som sidor i en webbapp. Appen har en `Stack` istället för flikar, eftersom den
bara har en huvudvy (listan med inlägg). Nya skärmar, som formuläret för ett
nytt inlägg, läggs ovanpå listan.

**TypeScript.** Samma val som i webbappen. Typerna för inläggen kan spegla
API:ets modeller, så att fel fångas vid kompilering.

**Temat från mallen är kvar.** Färgerna för ljust och mörkt läge ligger i
`src/constants/theme.ts` och `ThemedText`/`ThemedView` läser dem. Appen följer
telefonens inställning utan något extra bibliotek.

## Status

Projektet är uppsatt och startar, men visar än så länge bara en startskärm.
Nästa steg är att hämta inläggen från pawlog-api och visa dem i en lista.
