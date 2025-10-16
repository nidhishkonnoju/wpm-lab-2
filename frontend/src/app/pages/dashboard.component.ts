import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LucideAngularModule } from 'lucide-angular';
import { DashboardService, DashboardKPIs } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, LucideAngularModule],
  template: `
<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Sends</p>
          <p class="text-2xl font-bold">{{kpis.sends.toLocaleString()}}</p>
          <p class="text-sm text-green-600 mt-1">+12%</p>
        </div>
        <div class="bg-primary p-3 rounded-lg text-white">
          <lucide-icon name="send"></lucide-icon>
        </div>
      </div>
    </div>
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Opens</p>
          <p class="text-2xl font-bold">{{kpis.opens.toLocaleString()}}</p>
          <p class="text-sm text-green-600 mt-1">{{kpis.sends > 0 ? Math.round((kpis.opens/kpis.sends)*100) : 0}}%</p>
        </div>
        <div class="bg-success p-3 rounded-lg text-white">
          <lucide-icon name="eye"></lucide-icon>
        </div>
      </div>
    </div>
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Clicks</p>
          <p class="text-2xl font-bold">{{kpis.clicks.toLocaleString()}}</p>
          <p class="text-sm text-green-600 mt-1">{{kpis.opens > 0 ? Math.round((kpis.clicks/kpis.opens)*100) : 0}}%</p>
        </div>
        <div class="bg-accent p-3 rounded-lg text-white">
          <lucide-icon name="mouse-pointer"></lucide-icon>
        </div>
      </div>
    </div>
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Conversions</p>
          <p class="text-2xl font-bold">{{kpis.converts.toLocaleString()}}</p>
          <p class="text-sm text-green-600 mt-1">{{kpis.clicks > 0 ? Math.round((kpis.converts/kpis.clicks)*100) : 0}}%</p>
        </div>
        <div class="bg-warning p-3 rounded-lg text-white">
          <lucide-icon name="trending-up"></lucide-icon>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div class="card p-6">
      <h3 class="text-lg font-semibold mb-4">Engagement Trends</h3>
      <ngx-charts-line-chart
        [view]="[500, 250]"
        [results]="engagementData"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        [animations]="false"
        xAxisLabel="Month"
        yAxisLabel="Rate"
      >
      </ngx-charts-line-chart>
    </div>

    <div class="card p-6">
      <h3 class="text-lg font-semibold mb-4">Customer Segments</h3>
      <ngx-charts-pie-chart
        [view]="[500, 250]"
        [results]="segmentDistribution"
        [legend]="true"
        [labels]="true"
        [animations]="false"
      >
      </ngx-charts-pie-chart>
    </div>
  </div>

  <div class="card p-6">
    <h3 class="text-lg font-semibold mb-4">Revenue by Campaign Activity</h3>
    <ngx-charts-bar-vertical-2d
        [view]="[1000, 250]"
        [results]="revenueData"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        [animations]="false"
        xAxisLabel="Month"
        yAxisLabel="Value"
      >
      </ngx-charts-bar-vertical-2d>
  </div>

  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <lucide-icon name="bell"></lucide-icon>
      Recent Notifications
    </h3>
    <div class="space-y-3">
      <div *ngFor="let notif of notifications" class="p-3 rounded-lg border-l-4" [ngClass]="{'bg-green-50 border-green-500': notif.type === 'success', 'bg-yellow-50 border-yellow-500': notif.type === 'warning', 'bg-blue-50 border-blue-500': notif.type === 'info'}">
        <p class="text-sm font-medium">{{notif.message}}</p>
        <p class="text-xs text-gray-500 mt-1">{{notif.time}}</p>
      </div>
    </div>
  </div>
</div>
`
})
export class DashboardComponent implements OnInit {
  kpis: DashboardKPIs = {
    sends: 0,
    opens: 0,
    clicks: 0,
    converts: 0
  };
  Math = Math;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadKPIs();
  }

  loadKPIs() {
    this.dashboardService.getKPIs().subscribe(kpis => {
      this.kpis = kpis;
    });
  }
  engagementData = [
    { name: 'Jun', series: [{ name: 'Open Rate', value: 32 }, { name: 'Click Rate', value: 18 }, { name: 'Conversion Rate', value: 8 }] },
    { name: 'Jul', series: [{ name: 'Open Rate', value: 38 }, { name: 'Click Rate', value: 22 }, { name: 'Conversion Rate', value: 11 }] },
    { name: 'Aug', series: [{ name: 'Open Rate', value: 42 }, { name: 'Click Rate', value: 26 }, { name: 'Conversion Rate', value: 13 }] },
    { name: 'Sep', series: [{ name: 'Open Rate', value: 45 }, { name: 'Click Rate', value: 29 }, { name: 'Conversion Rate', value: 15 }] },
    { name: 'Oct', series: [{ name: 'Open Rate', value: 51 }, { name: 'Click Rate', value: 34 }, { name: 'Conversion Rate', value: 18 }] }
  ];

  segmentDistribution = [
    { name: 'High Value', value: 342 },
    { name: 'Frequent', value: 567 },
    { name: 'New', value: 189 },
    { name: 'At Risk', value: 234 }
  ];

  revenueData = [
    { name: 'Jun', series: [{ name: 'Revenue', value: 45000 }, { name: 'Campaigns', value: 22000 }] },
    { name: 'Jul', series: [{ name: 'Revenue', value: 52000 }, { name: 'Campaigns', value: 28000 }] },
    { name: 'Aug', series: [{ name: 'Revenue', value: 61000 }, { name: 'Campaigns', value: 35000 }] },
    { name: 'Sep', series: [{ name: 'Revenue', value: 68000 }, { name: 'Campaigns', value: 30000 }] },
    { name: 'Oct', series: [{ name: 'Revenue', value: 79000 }, { name: 'Campaigns', value: 38000 }] }
  ];

  notifications = [
      { id: 1, type: 'success', message: 'Campaign "Summer Beach Getaway" achieved 150% of target conversions', time: '2 hours ago' },
      { id: 2, type: 'warning', message: 'Segment "At Risk" showing declining engagement (-12%)', time: '5 hours ago' },
      { id: 3, type: 'info', message: 'New high-value segment identified: 89 customers', time: '1 day ago' }
    ];
}