
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(res => this.setToken(res.token)),
      catchError(this.handleError)
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password }).pipe(
      tap(res => this.setToken(res.token)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private handleError(error: any): Observable<never> {
    console.error('Authentication error:', error);
    return throwError(() => new Error(error.error.msg || 'Something went wrong'));
  }
}
