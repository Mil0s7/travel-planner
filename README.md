# Travel Planner

Aplikacja webowa Angular do planowania podróży w widoku kalendarza tygodniowego — projekt zaliczeniowy na przedmiot RIA (Case study: Angular).

## Funkcjonalność

- Interfejs w formie tygodniowego kalendarza z boczną nawigacją (Calendar, Day, Agenda, Schedule, Classes, Years, Settings), zbliżony do wzoru z treści zadania.
- Kliknięcie w dowolną komórkę kalendarza (dzień + godzina) otwiera formularz umożliwiający wprowadzenie: kraju, miasta, kosztu wycieczki oraz notatek.
- Pogoda dla wpisanego miasta pobierana jest z darmowego REST API [Open-Meteo](https://open-meteo.com/) (geokodowanie miasta + aktualna pogoda), bez konieczności posiadania klucza API.
- Kliknięcie w istniejący wpis pozwala go edytować lub usunąć.
- Stan wszystkich wpisów jest zapisywany w `localStorage` przeglądarki, dzięki czemu jest zachowywany po odświeżeniu strony.
- Plik `Travel_Planner_zrzuty_ekranu.pdf` w katalogu głównym zawiera zrzuty ekranu prezentujące funkcjonalność aplikacji.

## Struktura projektu

- `src/app/components/calendar` — główny widok kalendarza (siatka dni/godzin, sidebar).
- `src/app/components/trip-modal` — formularz dodawania/edycji wpisu wraz z podglądem pogody.
- `src/app/services/weather.service.ts` — integracja z REST API Open-Meteo.
- `src/app/services/trip-store.service.ts` — przechowywanie wpisów w `localStorage` (Angular Signals).
- `src/app/models/trip-entry.model.ts` — model danych wpisu.

## Uruchomienie

```bash
npm install
npm start
```

Aplikacja domyślnie dostępna jest pod adresem `http://localhost:4200/`.

## Build produkcyjny

```bash
npm run build
```
