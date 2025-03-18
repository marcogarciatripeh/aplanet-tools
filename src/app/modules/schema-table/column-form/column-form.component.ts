import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VariableService } from '../../../services/variables.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { ConfigService } from '../../../services/config.service';
import { Column } from '../../../interfaces/schama-table.interface';

@Component({
  selector: 'app-column-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.scss']
})
export class ColumnFormComponent {
  column = {
    name: '',
    type: '',
    units: [] as string[],
    kpi_variable: '',
    number_of_decimals: null
  };
  variables: string[] = [];
  columns: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'units', 'kpi_variable', 'number_of_decimals', 'actions'];
  types: string[];
  allUnits: string[];
  baseUnits: string[];
  currencyUnits: string[];
  filteredVariables: Observable<string[]>;
  variableControl = new FormControl('');

  @Output() addColumn = new EventEmitter<any>();
  @Output() removeColumn = new EventEmitter<number>();
  @Output() removeAllRows = new EventEmitter<void>();

  constructor(
    private variableService: VariableService,
    private configService: ConfigService
  ) {
    this.variables = Array.from(this.variableService.variables.keys());
    this.types = this.configService.getTypes();
    this.allUnits = this.configService.getAllUnits();
    this.baseUnits = this.configService.getBaseUnits();
    this.currencyUnits = this.configService.getCurrencyUnits();

    this.filteredVariables = this.variableControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  //Check Session
  isValid(): boolean {
    if (!this.column.name || !this.column.type) {
      return false;
    }

    if (this.columns.length === 0 && this.column.type !== 'text') {
      return false;
    }

    return true;
  }

  isBaseUnitSelected(): boolean {
    return this.column.units.some(unit => this.configService.isBaseUnit(unit));
  }

  isCurrencySelected(): boolean {
    return this.column.units.some(unit => this.configService.isCurrencyUnit(unit));
  }

  isVariableRequired(): boolean {
    return this.column.type === 'choices';
  }

  isNumberType(): boolean {
    return this.column.type === 'number';
  }

  isChoicesType(): boolean {
    return this.column.type === 'choices';
  }

  isRowsDisabled(): boolean {
    return (this.columns[0]?.type === 'text' && !!this.columns[0]?.kpi_variable) ||
          (this.columns.length === 0 && this.column.type === 'text' && !!this.column.kpi_variable);
  }

  //On Session
  onUnitChange(newValue: string[]) {
    if (!newValue || newValue.length === 0) {
      this.column.units = [];
      return;
    }

    const lastSelected = newValue[newValue.length - 1];
    const previousUnits = this.column.units;

    if (this.baseUnits.includes(lastSelected)) {
      if (previousUnits.some(unit => this.baseUnits.includes(unit))) {
        this.column.units = [lastSelected];
      } else {
        this.column.units = [lastSelected];
      }
      return;
    }

    if (this.currencyUnits.includes(lastSelected)) {
      const onlyCurrencies = newValue.filter(unit => this.currencyUnits.includes(unit));
      this.column.units = onlyCurrencies;
    }
  }

  onTypeChange() {
    this.column.units = [];
    this.column.number_of_decimals = null;
  }

  onAddColumn() {
    if (this.isValid()) {

      const newColumn: Column = {
        name: this.column.name,
        type: this.column.type
      };

      if (this.column.units.length === 0) {
        newColumn.unit = null;
      } else if (this.column.units.length === 1 && this.configService.isBaseUnit(this.column.units[0])) {
        newColumn.unit = this.column.units[0];
      } else {
        newColumn.units = [...this.column.units];
      }

      if (this.column.kpi_variable) {
        newColumn.kpi_variable = this.column.kpi_variable;
      }

      if (this.column.number_of_decimals !== null) {
        newColumn.number_of_decimals = this.column.number_of_decimals;
      }

      this.columns.push(newColumn);
      this.columns = [...this.columns];
      this.addColumn.emit(newColumn);
      this.resetForm();
    }
  }

  onVariableSelected(event: any) {
    this.column.kpi_variable = event.option.value;

    if (this.columns.length === 0 && this.column.type === 'text') {
      this.removeAllRows.emit();
    }
  }

  //Misc. Session
  resetForm() {
    this.column = {
      name: '',
      type: '',
      units: [],
      kpi_variable: '',
      number_of_decimals: null
    };
  }

  deleteColumn(index: number) {
    this.columns.splice(index, 1);
    this.columns = [...this.columns];
    this.removeColumn.emit(index);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.variables.filter(variable =>
      variable.toLowerCase().includes(filterValue)
    );
  }
}
