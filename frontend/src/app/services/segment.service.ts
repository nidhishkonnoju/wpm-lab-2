import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Segment {
  id?: string;
  name: string;
  criteria?: string;
  count?: number;
  avgEngagement?: number;
  rules?: any[];
  daysLookback?: number;
}

export interface SegmentPreview {
  count: number;
  sample: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SegmentService {
  private mockSegments: Segment[] = [
    { id: '1', name: 'High Value', criteria: 'Total Spent > $5000', count: 342, avgEngagement: 89 },
    { id: '2', name: 'Frequent Traveler', criteria: 'Bookings > 5/year', count: 567, avgEngagement: 82 },
    { id: '3', name: 'New Customer', criteria: 'First booking < 30 days', count: 189, avgEngagement: 68 },
    { id: '4', name: 'At Risk', criteria: 'No booking > 90 days', count: 234, avgEngagement: 41 }
  ];

  constructor(private apiService: ApiService) {}

  getSegments(): Observable<Segment[]> {
    return this.apiService.get<Segment>('/segments', this.mockSegments);
  }

  getSegment(id: string): Observable<Segment> {
    return this.apiService.get<Segment>(`/segments/${id}`, this.mockSegments.filter(s => s.id === id)).pipe(
      map(segments => segments[0] || this.mockSegments[0])
    );
  }

  createSegment(segment: Segment): Observable<Segment> {
    return this.apiService.post<Segment>('/segments', segment);
  }

  updateSegment(id: string, segment: Segment): Observable<Segment> {
    return this.apiService.put<Segment>(`/segments/${id}`, segment);
  }

  deleteSegment(id: string): Observable<any> {
    return this.apiService.delete(`/segments/${id}`);
  }

  previewSegment(id: string): Observable<SegmentPreview> {
    // For now, return mock preview - backend endpoint exists
    const mockPreview: SegmentPreview = {
      count: 0,
      sample: []
    };
    return this.apiService.post<SegmentPreview>(`/segments/${id}/preview`, {}).pipe(
      map(data => data || mockPreview)
    );
  }
}
