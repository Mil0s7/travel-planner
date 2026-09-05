import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripEntry } from '../../models/trip-entry.model';
import { WeatherService } from '../../services/weather.service';

export interface TripModalContext {
  day: string;
  time: string;
  existing: TripEntry | null;
}

const PALETTE = ['#2f9bd6', '#f5a623', '#e04f9b', '#8e44ec', '#17b6a7'];

@Component({
  selector: 'app-trip-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-modal.component.html',
  styleUrl: './trip-modal.component.scss'
})
export class TripModalComponent implements OnChanges {
  @Input({ required: true }) context!: TripModalContext;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TripEntry>();
  @Output() delete = new EventEmitter<string>();

  country = '';
  city = '';
  cost: number | null = null;
  notes = '';

  loadingWeather = false;
  weatherError = '';
  weather: TripEntry['weather'] = null;

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['context']) {
      const existing = this.context.existing;
      this.country = existing?.country ?? '';
      this.city = existing?.city ?? '';
      this.cost = existing?.cost ?? null;
      this.notes = existing?.notes ?? '';
      this.weather = existing?.weather ?? null;
      this.weatherError = '';
    }
  }

  async fetchWeather(): Promise<void> {
    if (!this.city.trim()) {
      this.weatherError = 'Podaj najpierw nazwę miasta.';
      return;
    }
    this.loadingWeather = true;
    this.weatherError = '';
    try {
      this.weather = await this.weatherService.getWeatherForCity(this.city.trim());
    } catch (err) {
      this.weather = null;
      this.weatherError = err instanceof Error ? err.message : 'Nie udało się pobrać pogody.';
    } finally {
      this.loadingWeather = false;
    }
  }

  onSave(): void {
    if (!this.country.trim() || !this.city.trim()) {
      return;
    }
    const existing = this.context.existing;
    const entry: TripEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      day: this.context.day,
      time: this.context.time,
      country: this.country.trim(),
      city: this.city.trim(),
      cost: this.cost ?? 0,
      notes: this.notes.trim(),
      color: existing?.color ?? PALETTE[Math.floor(Math.random() * PALETTE.length)],
      weather: this.weather
    };
    this.save.emit(entry);
  }

  onDelete(): void {
    if (this.context.existing) {
      this.delete.emit(this.context.existing.id);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
