import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold">Campaign Management</h2>
    <button (click)="create.emit('campaign')" class="btn-primary">
      <lucide-icon name="plus"></lucide-icon>
      New Campaign
    </button>
  </div>

  <div class="grid">
    <div *ngFor="let campaign of campaigns" class="card p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold">{{campaign.name}}</h3>
          <div class="flex mt-2">
            <span class="badge mr-2">{{campaign.type}}</span>
            <span class="badge" [ngClass]="{'bg-green-100 text-green-700': campaign.status === 'Active', 'bg-yellow-100 text-yellow-700': campaign.status === 'Paused', 'bg-blue-100 text-blue-700': campaign.status === 'Completed', 'bg-gray-100 text-gray-700': campaign.status === 'Draft'}">{{campaign.status}}</span>
          </div>
        </div>
        <div class="flex">
          <button *ngIf="campaign.status !== 'Draft' && campaign.status !== 'Completed'" (click)="toggleStatus.emit(campaign.id)" class="p-2 hover:bg-gray-100 rounded mr-2">
            <lucide-icon [name]="campaign.status === 'Active' ? 'pause' : 'play'"></lucide-icon>
          </button>
          <button (click)="edit.emit(campaign)" class="p-2 hover:bg-gray-100 rounded mr-2">
            <lucide-icon name="edit"></lucide-icon>
          </button>
          <button (click)="delete.emit(campaign.id)" class="p-2 hover:bg-gray-100 rounded text-red-600">
            <lucide-icon name="trash-2"></lucide-icon>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5">
        <div>
          <p class="text-xs text-gray-500">Sent</p>
          <p class="text-xl font-semibold">{{campaign.sent.toLocaleString()}}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Opened</p>
          <p class="text-xl font-semibold">{{campaign.opened.toLocaleString()}}</p>
          <p class="text-xs text-green-600">{{campaign.sent > 0 ? Math.round((campaign.opened/campaign.sent)*100) : 0}}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Clicked</p>
          <p class="text-xl font-semibold">{{campaign.clicked.toLocaleString()}}</p>
          <p class="text-xs text-green-600">{{campaign.opened > 0 ? Math.round((campaign.clicked/campaign.opened)*100) : 0}}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Conversions</p>
          <p class="text-xl font-semibold">{{campaign.conversions}}</p>
          <p class="text-xs text-green-600">{{campaign.clicked > 0 ? Math.round((campaign.conversions/campaign.clicked)*100) : 0}}%</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">ROI</p>
          <p class="text-xl font-semibold text-green-600">{{campaign.roi}}%</p>
        </div>
      </div>
    </div>
  </div>
</div>
`
})
export class CampaignsComponent implements OnChanges {
  @Input() campaigns: any[] = [];
  @Output() create = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();
  Math = Math;

  ngOnInit() {
    // Ensure array exists to avoid template errors calling toLocaleString
    this.campaigns = (this.campaigns || []).map(c => ({
      sent: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      roi: 0,
      ...c
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campaigns']) {
      this.campaigns = (this.campaigns || []).map(campaign => ({
        sent: 0,
        opened: 0,
        clicked: 0,
        conversions: 0,
        roi: 0,
        ...campaign
      }));
    }
  }
}