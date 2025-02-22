import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schema-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './schema-table.component.html',
  styleUrl: './schema-table.component.scss'
})
export class SchemaTableComponent { }
