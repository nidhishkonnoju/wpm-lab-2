import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://travel-agency-dashboard-fkxy.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Generic GET request with ID mapping and error handling
  get<T>(endpoint: string, fallbackData?: T[]): Observable<T[]> {
    return this.http.get<any>(`${this.baseUrl}${endpoint}`).pipe(
      map(raw => {
        const data = Array.isArray(raw) ? raw : (raw != null ? [raw] : []);
        return this.mapIds(data) as T[];
      }),
      catchError(error => {
        console.warn(`API call failed for ${endpoint}, falling back to mock data:`, error.message);
        return of(fallbackData || []);
      })
    );
  }

  // Generic POST request with ID mapping
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<any>(`${this.baseUrl}${endpoint}`, data).pipe(
      map(response => this.mapId(response) as T),
      catchError(error => {
        console.warn(`API POST failed for ${endpoint}:`, error.message);
        // If duplicate key from backend, rethrow so UI can show a message
        if (this.isDuplicateKeyError(error)) {
          throw error;
        }
        // Offline fallback: echo back with a generated id
        const fallbackId = this.generateId();
        return of(this.mapId({ ...data, _id: fallbackId }) as T);
      })
    );
  }

  // Generic PUT request with ID mapping
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<any>(`${this.baseUrl}${endpoint}`, data).pipe(
      map(response => this.mapId(response) as T),
      catchError(error => {
        console.warn(`API PUT failed for ${endpoint}:`, error.message);
        // Offline fallback: return the provided object as-is
        return of(this.mapId(data) as T);
      })
    );
  }

  // Generic DELETE request
  delete(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`).pipe(
      catchError(error => {
        console.warn(`API DELETE failed for ${endpoint}:`, error.message);
        // Offline fallback: pretend success
        return of({ success: true });
      })
    );
  }

  // Map MongoDB _id to frontend id for arrays
  private mapIds<T>(data: any[]): T[] {
    return data.map(item => this.mapId(item));
  }

  // Map MongoDB _id to frontend id for single objects
  private mapId<T>(item: any): T {
    if (item && item._id) {
      const { _id, ...rest } = item;
      return { ...rest, id: _id } as T;
    }
    return item;
  }

  private generateId(): string {
    // Simple client-side id for offline fallback
    return Math.random().toString(36).slice(2, 10);
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  private isDuplicateKeyError(error: any): boolean {
    try {
      const msg = (error?.error?.message || error?.message || '').toString();
      return msg.includes('E11000') || msg.toLowerCase().includes('duplicate key');
    } catch {
      return false;
    }
  }
}
