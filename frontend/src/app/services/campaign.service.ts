import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Campaign {
  id?: string;
  name: string;
  type?: string;
  status?: string;
  sent?: number;
  opened?: number;
  clicked?: number;
  conversions?: number;
  roi?: number;
  channel?: string;
  segmentId?: string;
  variants?: any[];
}

export interface CampaignMetrics {
  variants: any[];
  totals: {
    sends: number;
    opens: number;
    clicks: number;
    converts: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private mockCampaigns: Campaign[] = [
    { id: '1', name: 'Summer Beach Getaway', type: 'Email', status: 'Active', sent: 2340, opened: 1520, clicked: 890, conversions: 145, roi: 340 },
    { id: '2', name: 'Weekend Flash Sale', type: 'Push', status: 'Active', sent: 5600, opened: 3200, clicked: 1800, conversions: 320, roi: 520 },
    { id: '3', name: 'Luxury Cruise Promotion', type: 'Email', status: 'Completed', sent: 1200, opened: 840, clicked: 420, conversions: 89, roi: 280 },
    { id: '4', name: 'Family Vacation Package', type: 'In-App', status: 'Draft', sent: 0, opened: 0, clicked: 0, conversions: 0, roi: 0 }
  ];

  constructor(private apiService: ApiService) {}

  getCampaigns(): Observable<Campaign[]> {
    return this.apiService.get<Campaign>('/campaigns', this.mockCampaigns);
  }

  getCampaign(id: string): Observable<Campaign> {
    return this.apiService.get<Campaign>(`/campaigns/${id}`, this.mockCampaigns.filter(c => c.id === id)).pipe(
      map(campaigns => campaigns[0] || this.mockCampaigns[0])
    );
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.apiService.post<Campaign>('/campaigns', campaign);
  }

  updateCampaign(id: string, campaign: Campaign): Observable<Campaign> {
    return this.apiService.put<Campaign>(`/campaigns/${id}`, campaign);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.apiService.delete(`/campaigns/${id}`);
  }

  launchCampaign(id: string): Observable<any> {
    return this.apiService.post(`/campaigns/${id}/launch`, {});
  }

  getCampaignMetrics(id: string): Observable<CampaignMetrics> {
    // For now, return mock metrics - backend endpoint exists but may need adjustment
    const mockMetrics: CampaignMetrics = {
      variants: [],
      totals: { sends: 0, opens: 0, clicks: 0, converts: 0 }
    };
    return this.apiService.get<CampaignMetrics>(`/campaigns/${id}/metrics`, [mockMetrics]).pipe(
      map(data => data[0] || mockMetrics)
    );
  }
}
