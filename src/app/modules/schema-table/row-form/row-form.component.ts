import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Column } from '../../../interfaces/schama-table.interface';

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
    MatSelectModule,
    MatOptionModule,
    MatTableModule
  ],
  templateUrl: './row-form.component.html',
  styleUrls: ['./row-form.component.scss']
})
export class RowFormComponent {
  row = {
    name: '',
    operation: ''
  };

  rows: any[] = [];
  displayedColumns: string[] = ['name', 'operation', 'actions'];

  @Output() addRow = new EventEmitter<any>();
  @Output() removeRow = new EventEmitter<number>();

  @Input() set disabled(value: boolean) {
    if (value) {
      this.rows = [];
      this.removeRow.emit(-1);
    }
    this._disabled = value;
  }

  @Input() columns: Column[] = [];

  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled: boolean = false;

  onAddRow() {
    if (this.disabled) {
      return;
    }

    if (this.isValid()) {
      const newRow: any = { name: this.row.name };

      if (this.row.operation) {
        newRow.operation = this.row.operation;
      }

      this.rows.push(newRow);
      this.rows = [...this.rows];
      this.addRow.emit(newRow);
      this.resetForm();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      if (!this.hasNumberColumn() && this.row.operation === 'sum') {
        this.row.operation = '';
      }
    }
  }

  hasNumberColumn(): boolean {
    const hasNumber = this.columns.some(col => col.type === 'number');
    return hasNumber;
  }

  canSelectOperation(): boolean {
    return this.hasNumberColumn();
  }

  isValid(): boolean {
    return !!this.row.name;
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
    this.rows = [...this.rows];
    this.removeRow.emit(index);
  }

  resetForm() {
    this.row = {
      name: '',
      operation: ''
    };
  }
}
