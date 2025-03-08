import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-row-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './row-form.component.html',
  styleUrls: ['./row-form.component.scss']
})
export class RowFormComponent {
  row = {
    name: ''
  };

  rows: any[] = [];
  displayedColumns: string[] = ['name', 'actions'];

  @Output() addRow = new EventEmitter<any>();

  onAddRow() {
    if (this.isValid()) {
      const newRow = { ...this.row };
      this.rows.push(newRow);
      this.rows = [...this.rows];
      this.addRow.emit(newRow);
      this.resetForm();
    }
  }

  isValid(): boolean {
    return !!this.row.name;
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    this.rows = [...this.rows];
  }

  resetForm() {
    this.row = {
      name: ''
    };
  }
}
