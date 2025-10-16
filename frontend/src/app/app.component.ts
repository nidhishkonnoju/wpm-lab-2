import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, Users, Mail, TrendingUp, Target, Activity, Send, Eye, MousePointer, DollarSign, Plus, Edit, Trash2, Play, Pause, BarChart2 } from 'lucide-angular';
import { DashboardComponent } from './pages/dashboard.component';
import { CampaignsComponent } from './pages/campaigns.component';
import { CustomersComponent } from './pages/customers.component';
import { SegmentsComponent } from './pages/segments.component';
import { ModalComponent } from './pages/modal.component';
import { CustomerService, Customer } from './services/customer.service';
import { CampaignService, Campaign } from './services/campaign.service';
import { SegmentService, Segment } from './services/segment.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule, DashboardComponent, CampaignsComponent, CustomersComponent, SegmentsComponent, ModalComponent],
  providers: [CustomerService, CampaignService, SegmentService],

  template: `
<div class="min-h-screen">
  <header class="bg-gradient-to-r from-primary to-accent-600 text-white">
    <div class="max-w-7xl mx-auto px-6 py-6">
      <h1 class="text-3xl font-bold mb-1">Marketing Automation Platform</h1>
      <p class="text-white/80">Personalized Travel Agency Marketing System</p>
    </div>
  </header>

  <main class="max-w-7xl mx-auto p-6">
    <nav class="mb-6 card p-2 flex overflow-x-auto">
      <button (click)="activeTab = 'dashboard'" [ngClass]="{'bg-primary text-white': activeTab === 'dashboard', 'text-gray-700 hover:bg-gray-100': activeTab !== 'dashboard'}" class="flex items-center px-4 py-2 rounded-lg transition-colors mr-2">
        <lucide-icon name="bar-chart-2"></lucide-icon>
        <span class="font-medium ml-2">Dashboard</span>
      </button>
      <button (click)="activeTab = 'campaigns'" [ngClass]="{'bg-primary text-white': activeTab === 'campaigns', 'text-gray-700 hover:bg-gray-100': activeTab !== 'campaigns'}" class="flex items-center px-4 py-2 rounded-lg transition-colors mr-2">
        <lucide-icon name="mail"></lucide-icon>
        <span class="font-medium ml-2">Campaigns</span>
      </button>
      <button (click)="activeTab = 'customers'" [ngClass]="{'bg-primary text-white': activeTab === 'customers', 'text-gray-700 hover:bg-gray-100': activeTab !== 'customers'}" class="flex items-center px-4 py-2 rounded-lg transition-colors mr-2">
        <lucide-icon name="users"></lucide-icon>
        <span class="font-medium ml-2">Customers</span>
      </button>
      <button (click)="activeTab = 'segments'" [ngClass]="{'bg-primary text-white': activeTab === 'segments', 'text-gray-700 hover:bg-gray-100': activeTab !== 'segments'}" class="flex items-center px-4 py-2 rounded-lg transition-colors">
        <lucide-icon name="target"></lucide-icon>
        <span class="font-medium ml-2">Segments</span>
      </button>
    </nav>

    <div [ngSwitch]="activeTab">
      <div *ngSwitchCase="'dashboard'">
        <app-dashboard></app-dashboard>
      </div>
      <div *ngSwitchCase="'campaigns'">
        <app-campaigns [campaigns]="campaigns" (create)="handleCreate($event)" (edit)="handleEdit('campaign', $event)" (delete)="handleDelete('campaign', $event)" (toggleStatus)="toggleCampaignStatus($event)"></app-campaigns>
      </div>
      <div *ngSwitchCase="'customers'">
        <app-customers [customers]="customers" (create)="handleCreate($event)" (edit)="handleEdit('customer', $event)" (delete)="handleDelete('customer', $event)"></app-customers>
      </div>
      <div *ngSwitchCase="'segments'">
        <app-segments [segments]="segments" (create)="handleCreate($event)" (edit)="handleEdit('segment', $event)" (delete)="handleDelete('segment', $event)"></app-segments>
      </div>
    </div>
  </main>

  <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <app-modal [modalType]="modalType" [editingItem]="editingItem" [segments]="segments" (save)="handleSave($event)" (close)="showModal = false"></app-modal>
  </div>
</div>
`,
  styles: []
})
export class AppComponent implements OnInit {
  activeTab = 'dashboard';
  customers: Customer[] = [];
  campaigns: Campaign[] = [];
  segments: Segment[] = [];
  notifications: any[] = [];
  showModal = false;
  modalType = '';
  editingItem: any = null;

  // Fallback mock data
  private mockCustomers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', segment: 'High Value', lastBooking: '2025-09-15', totalSpent: 5420, engagementScore: 92 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', segment: 'Frequent Traveler', lastBooking: '2025-10-01', totalSpent: 3200, engagementScore: 85 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', segment: 'New Customer', lastBooking: '2025-10-10', totalSpent: 890, engagementScore: 65 },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', segment: 'At Risk', lastBooking: '2025-06-20', totalSpent: 1500, engagementScore: 42 },
    { id: '5', name: 'Tom Brown', email: 'tom@example.com', segment: 'High Value', lastBooking: '2025-09-28', totalSpent: 6100, engagementScore: 88 }
  ];

  private mockCampaigns: Campaign[] = [
    { id: '1', name: 'Summer Beach Getaway', type: 'Email', status: 'Active', sent: 2340, opened: 1520, clicked: 890, conversions: 145, roi: 340 },
    { id: '2', name: 'Weekend Flash Sale', type: 'Push', status: 'Active', sent: 5600, opened: 3200, clicked: 1800, conversions: 320, roi: 520 },
    { id: '3', name: 'Luxury Cruise Promotion', type: 'Email', status: 'Completed', sent: 1200, opened: 840, clicked: 420, conversions: 89, roi: 280 },
    { id: '4', name: 'Family Vacation Package', type: 'In-App', status: 'Draft', sent: 0, opened: 0, clicked: 0, conversions: 0, roi: 0 }
  ];

  private mockSegments: Segment[] = [
    { id: '1', name: 'High Value', criteria: 'Total Spent > $5000', count: 342, avgEngagement: 89 },
    { id: '2', name: 'Frequent Traveler', criteria: 'Bookings > 5/year', count: 567, avgEngagement: 82 },
    { id: '3', name: 'New Customer', criteria: 'First booking < 30 days', count: 189, avgEngagement: 68 },
    { id: '4', name: 'At Risk', criteria: 'No booking > 90 days', count: 234, avgEngagement: 41 }
  ];

  constructor(
    private customerService: CustomerService,
    private campaignService: CampaignService,
    private segmentService: SegmentService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load customers
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
    });

    // Load campaigns
    this.campaignService.getCampaigns().subscribe(campaigns => {
      this.campaigns = campaigns;
    });

    // Load segments
    this.segmentService.getSegments().subscribe(segments => {
      this.segments = segments;
    });

    // Keep notifications as static for now
    this.notifications = [
      { id: 1, type: 'success', message: 'Campaign "Summer Beach Getaway" achieved 150% of target conversions', time: '2 hours ago' },
      { id: 2, type: 'warning', message: 'Segment "At Risk" showing declining engagement (-12%)', time: '5 hours ago' },
      { id: 3, type: 'info', message: 'New high-value segment identified: 89 customers', time: '1 day ago' }
    ];
  }

  handleCreate(type: string) {
    this.modalType = type;
    this.editingItem = null;
    this.showModal = true;
  }

  handleEdit(type: string, item: any) {
    this.modalType = type;
    this.editingItem = item;
    this.showModal = true;
  }

  handleDelete(type: string, id: string) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch(type) {
        case 'customer':
          this.customerService.deleteCustomer(id).subscribe(() => {
            this.customers = this.customers.filter(c => c.id !== id);
          });
          break;
        case 'campaign':
          this.campaignService.deleteCampaign(id).subscribe(() => {
            this.campaigns = this.campaigns.filter(c => c.id !== id);
          });
          break;
        case 'segment':
          this.segmentService.deleteSegment(id).subscribe(() => {
            this.segments = this.segments.filter(s => s.id !== id);
          });
          break;
      }
    }
  }

  handleSave(formData: any) {
    if (this.modalType === 'campaign') {
      if (this.editingItem) {
        this.campaignService.updateCampaign(this.editingItem.id, formData).subscribe(updatedCampaign => {
          this.campaigns = this.campaigns.map(c => c.id === this.editingItem.id ? updatedCampaign : c);
        });
      } else {
        const payload = {
          sent: 0,
          opened: 0,
          clicked: 0,
          conversions: 0,
          roi: 0,
          ...formData
        };
        this.campaignService.createCampaign(payload).subscribe(newCampaign => {
          const ensured = { sent: 0, opened: 0, clicked: 0, conversions: 0, roi: 0, ...newCampaign } as any;
          this.campaigns.push(ensured);
        });
      }
    } else if (this.modalType === 'segment') {
      if (this.editingItem) {
        this.segmentService.updateSegment(this.editingItem.id, formData).subscribe(updatedSegment => {
          this.segments = this.segments.map(s => s.id === this.editingItem.id ? updatedSegment : s);
        });
      } else {
        this.segmentService.createSegment(formData).subscribe(newSegment => {
          this.segments.push(newSegment);
        });
      }
    } else if (this.modalType === 'customer') {
      if (this.editingItem) {
        this.customerService.updateCustomer(this.editingItem.id, formData).subscribe(updatedCustomer => {
          this.customers = this.customers.map(c => c.id === this.editingItem.id ? updatedCustomer : c);
        });
      } else {
        // Prevent duplicate emails (helps when backend enforces unique index)
        const email = (formData?.email || '').toLowerCase().trim();
        if (email && this.customers.some(c => (c.email || '').toLowerCase() === email)) {
          window.alert('A customer with this email already exists.');
          return;
        }

        const payload = {
          totalSpent: 0,
          engagementScore: 0,
          ...formData
        };
        this.customerService.createCustomer(payload).subscribe(newCustomer => {
          const ensured = { totalSpent: 0, engagementScore: 0, ...newCustomer } as any;
          this.customers.push(ensured);
        });
      }
    }
    this.showModal = false;
  }

  toggleCampaignStatus(id: string) {
    const campaign = this.campaigns.find(c => c.id === id);
    if (campaign) {
      const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
      const mapped = newStatus === 'Active' ? 'launched' : newStatus.toLowerCase();
      const updatedCampaign = { ...campaign, status: mapped };
      
      this.campaignService.updateCampaign(id, updatedCampaign).subscribe(updated => {
        this.campaigns = this.campaigns.map(c => c.id === id ? updated : c);
      });
    }
  }
}