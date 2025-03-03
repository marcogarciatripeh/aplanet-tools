import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorComponent } from "./schema/editor/editor.component";

@Component({
  selector: 'app-schema-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    EditorComponent
],
  providers: [],
  templateUrl: './schema-table.component.html',
  styleUrl: './schema-table.component.scss'
})
export class SchemaTableComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
