import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface Customer {
  id?: string;
  name: string;
  email: string;
  segment?: string;
  lastBooking?: string;
  totalSpent?: number;
  engagementScore?: number;
  locale?: string;
  preferences?: any;
  traits?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private mockCustomers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', segment: 'High Value', lastBooking: '2025-09-15', totalSpent: 5420, engagementScore: 92 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', segment: 'Frequent Traveler', lastBooking: '2025-10-01', totalSpent: 3200, engagementScore: 85 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', segment: 'New Customer', lastBooking: '2025-10-10', totalSpent: 890, engagementScore: 65 },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', segment: 'At Risk', lastBooking: '2025-06-20', totalSpent: 1500, engagementScore: 42 },
    { id: '5', name: 'Tom Brown', email: 'tom@example.com', segment: 'High Value', lastBooking: '2025-09-28', totalSpent: 6100, engagementScore: 88 }
  ];

  constructor(private apiService: ApiService) {}

  getCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer>('/customers', this.mockCustomers);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.apiService.get<Customer>(`/customers/${id}`, this.mockCustomers.filter(c => c.id === id)).pipe(
      map(customers => customers[0] || this.mockCustomers[0])
    );
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.apiService.post<Customer>('/customers', customer);
  }

  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    return this.apiService.put<Customer>(`/customers/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.apiService.delete(`/customers/${id}`);
  }
}
