// Adding a comment to force a cache bust
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold">Customer Management</h2>
    <button (click)="create.emit('customer')" class="btn-primary">
      <lucide-icon name="plus"></lucide-icon>
      <span class="ml-2">Add Customer</span>
    </button>
  </div>

  <div class="card overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Booking</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr *ngFor="let customer of customers" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{customer.name}}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{customer.email}}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="badge" [ngClass]="{'bg-green-100 text-green-700': customer.segment === 'High Value', 'bg-blue-100 text-blue-700': customer.segment === 'Frequent Traveler', 'bg-red-100 text-red-700': customer.segment === 'At Risk'}">{{ customer.segment || '—' }}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ customer.lastBooking || '—' }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">$
            {{ customer.totalSpent.toLocaleString() }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                <div class="bg-primary h-2 rounded-full" [style.width]="customer.engagementScore + '%' "></div>
              </div>
              <span class="text-sm text-gray-600 ml-2">{{customer.engagementScore}}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <div class="flex">
              <button (click)="edit.emit(customer)" class="text-primary hover:text-primary-700 mr-2">
                <lucide-icon name="edit"></lucide-icon>
              </button>
              <button (click)="delete.emit(customer.id)" class="text-red-600 hover:text-red-800">
                <lucide-icon name="trash-2"></lucide-icon>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`
})
export class CustomersComponent implements OnChanges {
  @Input() customers: any[] = [];
  @Output() create = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  ngOnInit() {
    // Normalize fields to avoid toLocaleString errors
    this.customers = (this.customers || []).map(c => ({
      totalSpent: 0,
      engagementScore: 0,
      ...c
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customers']) {
      this.customers = (this.customers || []).map(c => ({
        totalSpent: 0,
        engagementScore: 0,
        ...c
      }));
    }
  }
}
