import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-templates',
  template: `
    <h2>Templates</h2>
    <form (submit)="create($event)">
      <input placeholder="Name" [(ngModel)]="form.name" name="name" />
      <input placeholder="Subject" [(ngModel)]="form.subject" name="subject" />
      <textarea placeholder="Body (use {{name}})" [(ngModel)]="form.body" name="body"></textarea>
      <button type="submit">Add Template</button>
    </form>
    <ul>
      <li *ngFor="let t of items">
        {{t.name}} <button (click)="preview(t._id)">Preview</button> <button (click)="remove(t._id)">Delete</button>
      </li>
    </ul>
    <div *ngIf="previewData">
      <h3>Preview</h3>
      <div><strong>Subject:</strong> {{previewData.subject}}</div>
      <div class="preview" [innerHTML]="previewData.body"></div>
    </div>
  `,
  styles: [`.preview{background:#fff;padding:12px;border-radius:8px}`]
})
export class TemplatesComponent implements OnInit {
  items: any[] = [];
  form: any = { name: '', subject: '', body: '' };
  previewData: any;
  async ngOnInit() { await this.load(); }
  async load() { const res = await fetch('/api/templates'); this.items = await res.json(); }
  async create(e: Event) {
    e.preventDefault();
    await fetch('/api/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...this.form, channel: 'email' }) });
    this.form = { name: '', subject: '', body: '' };
    await this.load();
  }
  async remove(id: string) { await fetch(`/api/templates/${id}`, { method: 'DELETE' }); await this.load(); }
  async preview(id: string) { const res = await fetch(`/api/templates/${id}/preview`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); this.previewData = await res.json(); }
}


