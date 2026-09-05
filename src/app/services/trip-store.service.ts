import { Injectable, signal } from '@angular/core';
import { TripEntry } from '../models/trip-entry.model';

const STORAGE_KEY = 'travel-planner.trips.v1';

@Injectable({ providedIn: 'root' })
export class TripStoreService {
  readonly trips = signal<TripEntry[]>(this.load());

  private load(): TripEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as TripEntry[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trips()));
  }

  getEntry(day: string, time: string): TripEntry | undefined {
    return this.trips().find((t) => t.day === day && t.time === time);
  }

  upsert(entry: TripEntry): void {
    const existingIndex = this.trips().findIndex((t) => t.id === entry.id);
    const next = [...this.trips()];
    if (existingIndex >= 0) {
      next[existingIndex] = entry;
    } else {
      next.push(entry);
    }
    this.trips.set(next);
    this.persist();
  }

  remove(id: string): void {
    this.trips.set(this.trips().filter((t) => t.id !== id));
    this.persist();
  }
}
