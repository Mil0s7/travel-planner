import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripStoreService } from '../../services/trip-store.service';
import { TripEntry } from '../../models/trip-entry.model';
import { TripModalComponent, TripModalContext } from '../trip-modal/trip-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, TripModalComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  readonly hours = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00'];
  readonly navItems = ['Calendar', 'Day', 'Agenda', 'Schedule', 'Classes', 'Years', 'Settings'];
  activeNav = 'Schedule';

  modalContext: TripModalContext | null = null;

  constructor(readonly store: TripStoreService) {}

  entryFor(day: string, time: string): TripEntry | undefined {
    return this.store.getEntry(day, time);
  }

  totalCost(): number {
    return this.store.trips().reduce((sum, t) => sum + (t.cost || 0), 0);
  }

  openCell(day: string, time: string): void {
    this.modalContext = { day, time, existing: this.entryFor(day, time) ?? null };
  }

  closeModal(): void {
    this.modalContext = null;
  }

  saveEntry(entry: TripEntry): void {
    this.store.upsert(entry);
    this.modalContext = null;
  }

  deleteEntry(id: string): void {
    this.store.remove(id);
    this.modalContext = null;
  }
}
