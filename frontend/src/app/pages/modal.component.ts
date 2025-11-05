import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="card p-6 w-full max-w-md">
  <h3 class="text-xl font-bold mb-4">
    {{editingItem ? 'Edit' : 'Create'}} {{modalType.charAt(0).toUpperCase() + modalType.slice(1)}}
  </h3>
  <form #form="ngForm" (ngSubmit)="handleSubmit()" class="space-y-4">
    <ng-container [ngSwitch]="modalType">
      <ng-container *ngSwitchCase="'campaign'">
        <div class="space-y-2">
          <label class="text-sm font-medium">Campaign Name</label>
          <input type="text" [(ngModel)]="formData.name" name="name" class="w-full px-3 py-2 border rounded" required autofocus />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Segment</label>
          <select [(ngModel)]="formData.segmentId" name="segmentId" class="w-full px-3 py-2 border rounded">
            <option *ngFor="let s of segments" [value]="s.id">{{s.name}}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Type</label>
          <select [(ngModel)]="formData.type" name="type" class="w-full px-3 py-2 border rounded">
            <option>Email</option>
            <option>Push</option>
            <option>In-App</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Status</label>
          <select [(ngModel)]="formData.status" name="status" class="w-full px-3 py-2 border rounded">
            <option value="draft">Draft</option>
            <option value="launched">Launched</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <div class="space-y-2" *ngIf="modalType !== 'segment' && modalType !== 'customer'">
          <label class="text-sm font-medium">Campaign Name</label>
          <input type="text" [(ngModel)]="formData.name" name="name" class="w-full px-3 py-2 border rounded" required autofocus />
        </div>
        <div class="space-y-2" *ngIf="modalType !== 'segment' && modalType !== 'customer'">
          <label class="text-sm font-medium">Segment</label>
          <select [(ngModel)]="formData.segmentId" name="segmentId" class="w-full px-3 py-2 border rounded">
            <option *ngFor="let s of segments" [value]="s.id">{{s.name}}</option>
          </select>
        </div>
        <div class="space-y-2" *ngIf="modalType !== 'segment' && modalType !== 'customer'">
          <label class="text-sm font-medium">Type</label>
          <select [(ngModel)]="formData.type" name="type" class="w-full px-3 py-2 border rounded">
            <option>Email</option>
            <option>Push</option>
            <option>In-App</option>
          </select>
        </div>
        <div class="space-y-2" *ngIf="modalType !== 'segment' && modalType !== 'customer'">
          <label class="text-sm font-medium">Status</label>
          <select [(ngModel)]="formData.status" name="status" class="w-full px-3 py-2 border rounded">
            <option value="draft">Draft</option>
            <option value="launched">Launched</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="'segment'">
        <div class="space-y-2">
          <label class="text-sm font-medium">Segment Name</label>
          <input type="text" [(ngModel)]="formData.name" name="name" class="w-full px-3 py-2 border rounded" required autofocus />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Criteria</label>
          <input type="text" placeholder="e.g., Total Spent > $5000" [(ngModel)]="formData.criteria" name="criteria" class="w-full px-3 py-2 border rounded" required />
        </div>
      </ng-container>
      <ng-container *ngSwitchCase="'customer'">
        <div class="space-y-2">
          <label class="text-sm font-medium">Name</label>
          <input type="text" [(ngModel)]="formData.name" name="name" class="w-full px-3 py-2 border rounded" required autofocus />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input type="email" [(ngModel)]="formData.email" name="email" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Segment</label>
          <select [(ngModel)]="formData.segment" name="segment" class="w-full px-3 py-2 border rounded">
            <option>High Value</option>
            <option>Frequent Traveler</option>
            <option>New Customer</option>
            <option>At Risk</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Last Booking</label>
          <input type="date" [(ngModel)]="formData.lastBooking" name="lastBooking" class="w-full px-3 py-2 border rounded" />
        </div>
      </ng-container>
    </ng-container>
    <div class="flex justify-end">
      <button type="button" (click)="close.emit()" class="btn-outline mr-2">Cancel</button>
      <button type="submit" class="btn-primary" [disabled]="!form.valid">Save</button>
    </div>
  </form>
</div>
`
})
export class ModalComponent implements OnInit {
  @Input() modalType = '';
  @Input() editingItem: any = null;
  @Input() segments: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  formData: any = {};

  ngOnInit() {
    this.modalType = (this.modalType || '').toLowerCase().trim();
    if (this.modalType === 'campaigns') this.modalType = 'campaign';
    if (this.modalType === 'customers') this.modalType = 'customer';
    this.formData = this.editingItem || {};
    // Sensible defaults for new entries
    if (!this.editingItem) {
      if (this.modalType === 'campaign') {
        this.formData = { name: '', type: 'Email', status: 'draft' };
      } else if (this.modalType === 'segment') {
        this.formData = { name: '', criteria: '' };
      } else if (this.modalType === 'customer') {
        this.formData = { name: '', email: '', segment: 'High Value', lastBooking: '' };
      }
    }
  }

  handleSubmit() {
    const trimmed = { ...this.formData };
    if (typeof trimmed.name === 'string') trimmed.name = trimmed.name.trim();
    if (typeof trimmed.email === 'string') trimmed.email = trimmed.email.trim();
    if (typeof trimmed.criteria === 'string') trimmed.criteria = trimmed.criteria.trim();
    this.save.emit(trimmed);
  }
}
