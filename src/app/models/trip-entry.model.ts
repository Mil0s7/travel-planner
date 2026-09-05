export interface WeatherInfo {
  temperatureC: number;
  windSpeedKmh: number;
  description: string;
  icon: string;
  fetchedAt: string;
}

export interface TripEntry {
  id: string;
  day: string;      // e.g. 'Monday'
  time: string;      // e.g. '09:00'
  country: string;
  city: string;
  cost: number;
  notes?: string;
  color: string;
  weather: WeatherInfo | null;
}
