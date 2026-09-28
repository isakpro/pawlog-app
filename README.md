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

Mobilappen sparar ingenting själv. Allt går via samma API som webbappen, så den
visar samma inlägg, och **backend måste köra** för att appen ska visa något.

## Kom igång

### Förutsättningar

- [Node.js](https://nodejs.org/) 20.19.4, 22.13 eller 24.3 och senare
  (React Native 0.86 kräver det)
- npm (följer med Node)
- [.NET SDK 10](https://dotnet.microsoft.com/download) eller senare (för API:et)
- En webbläsare. Expo Go eller en Android-emulator går också, se
  [Köra på telefon eller emulator](#köra-på-telefon-eller-emulator)

Kontrollera versionerna:

```bash
node -v
dotnet --version
```

Du behöver **två terminalfönster**, ett för API:et och ett för mobilappen.
Börja med API:et.

### 1. Starta API:et

```bash
git clone https://github.com/isakpro/pawlog-api.git
cd pawlog-api
dotnet run --project Pawlog.Api
```

API:et lyssnar på **http://localhost:5005**. Databasen är en SQLite-fil som
skapas automatiskt vid första starten med två exempelinlägg.

Kontrollera i ett annat fönster att det svarar:

```bash
curl http://localhost:5005/api/entries
```

Låt terminalen stå kvar med API:et igång.

### 2. Starta mobilappen i webbläsaren

I ett nytt terminalfönster:

```bash
git clone https://github.com/isakpro/pawlog-app.git
cd pawlog-app
npm install
npm run web
```

Appen öppnas på **http://localhost:8081**. Första starten tar en stund medan
Metro bygger appen. Vill du se den i mobilstorlek öppnar du DevTools (`F12`),
slår på enhetsläget (`Ctrl + Shift + M`) och väljer en telefon.

Webbversionen körs med React Native Web, som gör om appens komponenter till
HTML. Det är samma kod som körs på telefonen.

Stoppa respektive server med `Ctrl + C`.

### Prova appen

- **Lista:** inläggen hämtas från API:et när appen startar, nyast först. Dra
  listan nedåt för att hämta om den
- **Lägg till:** tryck *+ New* uppe till höger, fyll i formuläret och tryck
  *Save entry*. Datumet är ifyllt med dagens datum
- **Bild:** tryck *Choose photo* i formuläret. Bilden laddas upp när inlägget
  sparas och visas sedan på kortet i listan
- **Uppdatera:** tryck *Mark as done* på ett kort för att bocka av
  träningsmålet. Tryck på *✓ Done* för att ångra

Allt sparas i API:ets databas och syns också i webbappen.

### Om något går fel

Stäng av API:et och ladda om appen. Då visas ett felmeddelande med en
*Try again*-knapp istället för att appen kraschar. Samma sak gäller när du
sparar ett inlägg eller bockar av ett mål: felet visas där du tryckte, och det
du skrivit ligger kvar.

Visar appen *Could not reach the server* fast API:et kör, kontrollera att den
körs på port **8081**. Är porten upptagen frågar Expo om en annan port, men
API:et släpper bara in anrop från `localhost:8081` (CORS), så anropen blockeras.
Stäng det som använder 8081 och starta om med `npm run web`.

### API-adressen

Adressen till API:et ligger i `.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:5005
```

Filen är incheckad, så appen fungerar direkt efter kloning. Vill du använda en
annan adress lägger du den i `.env.local`, som git ignorerar, och startar om
Expo.

### Köra på telefon eller emulator

En telefon eller emulator når inte datorns `localhost`, så de behöver en annan
API-adress i `.env.local`.

**Android-emulator.** Emulatorn når datorns `localhost` via `10.0.2.2`:

```
EXPO_PUBLIC_API_URL=http://10.0.2.2:5005
```

Starta sedan med `npm run android` medan emulatorn är igång.

**Expo Go på en telefon.** Telefonen och datorn måste vara på samma nätverk, och
API:et måste lyssna på nätverket och inte bara på `localhost`:

```bash
dotnet run --project Pawlog.Api --urls http://0.0.0.0:5005
```

Lägg datorns IP-adress (visas med `ipconfig`) i `.env.local`:

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:5005
```

Starta med `npx expo start` och skanna QR-koden med kameran (iPhone) eller i
Expo Go (Android). Windows brandvägg kan behöva släppa igenom port 5005.

### Övriga kommandon

| Kommando | Gör |
| --- | --- |
| `npm run web` | Startar appen och öppnar den i webbläsaren |
| `npx expo start` | Startar utvecklingsservern (Metro) med QR-kod för Expo Go |
| `npm run android` | Startar appen och öppnar den i Android-emulatorn |
| `npx tsc --noEmit` | Typkollar hela projektet |

## Så pratar appen med API:et

| I appen | Anrop |
| --- | --- |
| Listan laddas eller dras nedåt | `GET /api/entries` |
| *Save entry* | `POST /api/entries` |
| Vald bild | `POST /api/entries/{id}/photo` (`multipart/form-data`) |
| *Mark as done* / *✓ Done* | `PUT /api/entries/{id}` |

Bilden laddas upp i ett andra anrop eftersom uppladdningen behöver inläggets id.
Det är samma anrop som webbappen gör.

## Projektstruktur

```
src/
  api/             client.ts (anrop och felhantering) och entries.ts (endpoints)
  app/             skärmarna, en fil per route (Expo Router)
    _layout.tsx    navigeringen (Stack), temat och EntriesProvider
    index.tsx      listan med inlägg
    new-entry.tsx  formuläret för ett nytt inlägg, öppnas som modal
  components/      EntryCard, ErrorMessage, FormField, PhotoPicker m.fl.
  constants/       theme.ts - färger för ljust och mörkt läge, spacing, radier
  context/         entries.tsx - inläggen, laddning, fel och sparning
  hooks/           useTheme - väljer färger efter telefonens inställning
  types/           TypeScript-typer som speglar API:ets modeller
assets/            appikon och startskärm
```

## Tekniska val

**Expo istället för ren React Native.** Appen startar med ett kommando och kan
testas i webbläsaren, i Expo Go eller i en emulator, utan att bygga något med
Xcode eller Android Studio. Samma kod körs på Android, iOS och webben.

**Samma API-lager som webbappen.** `src/api` och `src/types` följer webbappen:
all trafik går genom `request()`, som gör om nätverksfel och felsvar till ett
`ApiError` med ett meddelande som kan visas direkt. De två klienterna pratar
med API:et på samma sätt och är lätta att jämföra.

**Expo Router och en `Stack`.** Skärmarna är filer i `src/app`. Appen har en
huvudvy, listan, och formuläret öppnas som en modal ovanpå den. Det är det
vanliga mönstret för att skapa något i en mobilapp. Knappen *+ New* är en
`Link`, så på webben blir den en riktig länk till `/new-entry`.

**En React-context för inläggen.** Listan och formuläret ligger på olika
skärmar och måste se samma inlägg. `EntriesProvider` i `_layout.tsx` äger dem,
och ett nytt inlägg syns direkt i listan utan en ny hämtning. Inget bibliotek
för state behövs, eftersom appen bara har en resurs.

**`FlatList` för listan.** Den ritar bara korten som syns på skärmen och ger
dra-för-att-uppdatera, som är det vanliga sättet att hämta om data i en
mobilapp.

**Ingen optimistisk uppdatering.** Knapparna visar *Saving…* och är inaktiverade
medan anropet pågår, och gränssnittet uppdateras med det API:et svarar med.
Appen visar aldrig ett läge som servern inte har sparat, och dubbeltryck skapar
inte två inlägg.

**Fel visas där de uppstår.** Misslyckas listan visas felet med *Try again*.
Misslyckas en sparning visas det i formuläret, och misslyckas en avbockning
visas det på just det kortet.

**Bilden kontrolleras innan den skickas.** `expo-image-picker` öppnar
bildbiblioteket på telefonen och filväljaren på webben. Bara jpg, png, webp och
gif upp till 5 MB släpps igenom, samma regler som API:et har. Filnamnet får
alltid en ändelse som matchar bildens typ, eftersom iOS kan kalla en
JPEG-bild för `.HEIC`. Bilden skickas som en `File` på webben och som `uri`,
`name` och `type` på telefonen, eftersom `FormData` fungerar olika där.

**Datumet är ett textfält.** React Native har ingen inbyggd datumväljare, och
den i `@expo/ui` fungerar inte i webbversionen. Fältet är ifyllt med dagens
datum i lokal tid och kontrolleras innan inlägget skickas.

**Pawlogs färger och mörkt läge.** Temat i `src/constants/theme.ts` har samma
färger som webbappen, plus ett mörkt läge som följer telefonens inställning.
Navigeringens header använder samma färger.

**Tillgänglighet.** Knappen för träningsmålet har `role="checkbox"` och
`aria-checked`, så att skärmläsare säger om målet är avbockat. Formulärfälten
har sina etiketter som `aria-label`.

## Status

Lista, lägg till med bild och uppdatera fungerar mot det egna API:et, i
webbläsaren via React Native Web. Misslyckade anrop visas som felmeddelanden i
gränssnittet.

Att ta bort inlägg finns inte, varken i mobilappen eller i webbappen.
