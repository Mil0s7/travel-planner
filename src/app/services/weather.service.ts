import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WeatherInfo } from '../models/trip-entry.model';

interface GeocodingResult {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }>;
}

interface ForecastResult {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
}

// WMO Weather interpretation codes -> human readable description + icon
const WEATHER_CODE_MAP: Record<number, { description: string; icon: string }> = {
  0: { description: 'Bezchmurnie', icon: '☀️' },
  1: { description: 'Prawie bezchmurnie', icon: '🌤️' },
  2: { description: 'Częściowe zachmurzenie', icon: '⛅' },
  3: { description: 'Pochmurno', icon: '☁️' },
  45: { description: 'Mgła', icon: '🌫️' },
  48: { description: 'Osadzająca się mgła', icon: '🌫️' },
  51: { description: 'Lekka mżawka', icon: '🌦️' },
  53: { description: 'Mżawka', icon: '🌦️' },
  55: { description: 'Gęsta mżawka', icon: '🌦️' },
  61: { description: 'Lekki deszcz', icon: '🌧️' },
  63: { description: 'Deszcz', icon: '🌧️' },
  65: { description: 'Silny deszcz', icon: '🌧️' },
  71: { description: 'Lekki śnieg', icon: '🌨️' },
  73: { description: 'Śnieg', icon: '🌨️' },
  75: { description: 'Silny śnieg', icon: '❄️' },
  80: { description: 'Przelotne opady', icon: '🌦️' },
  81: { description: 'Przelotne opady', icon: '🌦️' },
  82: { description: 'Gwałtowne przelotne opady', icon: '⛈️' },
  95: { description: 'Burza', icon: '⛈️' },
  96: { description: 'Burza z gradem', icon: '⛈️' },
  99: { description: 'Silna burza z gradem', icon: '⛈️' }
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  /**
   * Resolves a city name to coordinates, then fetches current weather
   * for those coordinates from the free Open-Meteo REST API (no API key required).
   */
  async getWeatherForCity(city: string): Promise<WeatherInfo> {
    const geo = await firstValueFrom(
      this.http.get<GeocodingResult>(this.geocodingUrl, {
        params: { name: city, count: '1', language: 'pl', format: 'json' }
      })
    );

    const place = geo.results?.[0];
    if (!place) {
      throw new Error(`Nie znaleziono lokalizacji dla miasta "${city}"`);
    }

    const forecast = await firstValueFrom(
      this.http.get<ForecastResult>(this.forecastUrl, {
        params: {
          latitude: String(place.latitude),
          longitude: String(place.longitude),
          current_weather: 'true'
        }
      })
    );

    const current = forecast.current_weather;
    if (!current) {
      throw new Error('Brak danych pogodowych dla tej lokalizacji');
    }

    const mapped = WEATHER_CODE_MAP[current.weathercode] ?? {
      description: 'Nieznane warunki',
      icon: '❔'
    };

    return {
      temperatureC: current.temperature,
      windSpeedKmh: current.windspeed,
      description: mapped.description,
      icon: mapped.icon,
      fetchedAt: new Date().toISOString()
    };
  }
}
