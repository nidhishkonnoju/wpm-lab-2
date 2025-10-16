import 'reflect-metadata';
import './styles.css';
import '@angular/compiler';
import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule, Bell, Users, Mail, TrendingUp, Target, Activity, Send, Eye, MousePointer, DollarSign, Plus, Edit, Trash2, Play, Pause, BarChart2 } from 'lucide-angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({
      Bell, Users, Mail, TrendingUp, Target, Activity, Send, Eye, MousePointer, DollarSign, Plus, Edit, Trash2, Play, Pause, BarChart2
    }))
  ],
}).catch((err) => console.error(err));


