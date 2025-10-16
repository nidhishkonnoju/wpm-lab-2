import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface DashboardKPIs {
  sends: number;
  opens: number;
  clicks: number;
  converts: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockKPIs: DashboardKPIs = {
    sends: 9140,
    opens: 5560,
    clicks: 3110,
    converts: 554
  };

  constructor(private apiService: ApiService) {}

  getKPIs(): Observable<DashboardKPIs> {
    return this.apiService.get<DashboardKPIs>('/dashboard/kpis', [this.mockKPIs]).pipe(
      map(data => data[0] || this.mockKPIs)
    );
  }
}
