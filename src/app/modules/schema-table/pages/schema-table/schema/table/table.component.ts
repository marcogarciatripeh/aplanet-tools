import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

interface TableColumn {
  name: string;
  type: string;
  unit?: string | null;
  kpi_variable?: string;
}

interface TableRow {
  [key: string]: any;
  name?: string;
}
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() set data(value: any) {
    if (value) {
      this.columns = value.columns || [];
      this.rows = value.rows || [];
      this.displayedColumns = this.columns.map(col => col.name);
    }
  }

  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  displayedColumns: string[] = [];
}
