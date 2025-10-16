import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-segments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-bold">Segmentation</h2>
    <button (click)="create.emit('segment')" class="btn-primary">
      <lucide-icon name="plus"></lucide-icon>
      Create Segment
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2">
    <div *ngFor="let segment of segments" class="card p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold">{{segment.name}}</h3>
          <p class="text-sm text-gray-600 mt-1">{{segment.criteria}}</p>
        </div>
        <div class="flex">
          <button (click)="edit.emit(segment)" class="p-2 hover:bg-gray-100 rounded mr-2">
            <lucide-icon name="edit"></lucide-icon>
          </button>
          <button (click)="delete.emit(segment.id)" class="p-2 hover:bg-gray-100 rounded text-red-600">
            <lucide-icon name="trash-2"></lucide-icon>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2">
        <div>
          <p class="text-xs text-gray-500">Customer Count</p>
          <p class="text-2xl font-bold">{{segment.count}}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Avg Engagement</p>
          <p class="text-2xl font-bold text-primary">{{segment.avgEngagement}}%</p>
        </div>
      </div>
    </div>
  </div>
</div>
`
})
export class SegmentsComponent {
  @Input() segments: any[] = [];
  @Output() create = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}