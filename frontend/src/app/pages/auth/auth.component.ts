
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-soft">
      <div class="card p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold text-center mb-6">{{ isLogin ? 'Login' : 'Register' }}</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" name="username" [(ngModel)]="username" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required>
          </div>
          <div *ngIf="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</div>
          <button type="submit" class="w-full btn-primary">{{ isLogin ? 'Login' : 'Register' }}</button>
        </form>
        <div class="text-center mt-4">
          <a href="#" (click)="toggleForm($event)" class="text-sm text-primary hover:underline">
            {{ isLogin ? 'Need an account? Register' : 'Have an account? Login' }}
          </a>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  @Output() authenticated = new EventEmitter<boolean>();

  isLogin = true;
  username = '';
  password = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
    this.errorMessage = ''; // Clear error message on form toggle
  }

  onSubmit() {
    this.errorMessage = ''; // Clear previous error
    if (this.isLogin) {
      this.authService.login(this.username, this.password).subscribe({
        next: () => this.authenticated.emit(true),
        error: (err) => this.errorMessage = err.message || 'Login failed',
      });
    } else {
      this.authService.register(this.username, this.password).subscribe({
        next: () => this.authenticated.emit(true),
        error: (err) => this.errorMessage = err.message || 'Registration failed',
      });
    }
  }
}
