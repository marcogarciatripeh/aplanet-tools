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
import { UnitGroup } from '../../../interfaces/schama-table.interface';
import { MatOptionModule } from '@angular/material/core';

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
    MatOptionModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './column-form.component.html',
  styleUrls: ['./column-form.component.scss']
})
export class ColumnFormComponent {

  constructor(
    private variableService: VariableService,
    private configService: ConfigService
  ) {
    this.variables = Array.from(this.variableService.variables.keys());
    this.types = this.configService.getTypes();
    this.allUnits = this.configService.getAllUnits();
    this.baseUnits = this.configService.getBaseUnits();
    this.currencyUnits = this.configService.getCurrencyUnits();
    this.unitGroups = this.configService.getUnitGroups();

    this.filteredVariables = this.variableControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  column = {
    name: '',
    type: '',
    units: [] as string[],
    kpi_variable: '',
    number_of_decimals: null,
    operation: ''
  };
  variables: string[] = [];
  columns: any[] = [];
  displayedColumns: string[] = ['name', 'type', 'units', 'kpi_variable', 'number_of_decimals', 'operation', 'actions'];
  types: string[];
  allUnits: string[];
  baseUnits: string[];
  unitGroups: UnitGroup[];
  currencyUnits: string[];
  filteredVariables: Observable<string[]>;
  variableControl = new FormControl('');

  @Output() addColumn = new EventEmitter<any>();
  @Output() removeColumn = new EventEmitter<number>();
  @Output() removeAllRows = new EventEmitter<void>();
  @Output() numericColumnDeleted = new EventEmitter<void>();

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

  isOtherGroupSelected(currentGroup: string, unit: string): boolean {
    if (!this.column.units?.length) return false;

    if (this.column.units.length > 0) {
      const firstUnitGroup = this.configService.getUnitGroupFromUnit(this.column.units[0]);
      return firstUnitGroup !== currentGroup;
    }
    return false;
  }

  //On Session
  onUnitChange(newValue: string[]) {
    if (!newValue || newValue.length === 0) {
      this.column.units = [];
      return;
    }

    const lastSelected = newValue[newValue.length - 1];

    if (this.baseUnits.includes(lastSelected)) {
      this.column.units = [lastSelected];
      return;
    }

    if (this.currencyUnits.includes(lastSelected)) {
      this.column.units = newValue.filter(unit => this.currencyUnits.includes(unit));
      return;
    }

    this.column.units = newValue;
  }

  onTypeChange() {
    this.column.units = [];
    this.column.number_of_decimals = null;
    this.column.operation = '';
    this.column.kpi_variable = '';
  }

  onAddColumn() {
    if (this.isValid()) {
      const newColumn = this.configService.transformColumnToSchema(this.column);

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
      number_of_decimals: null,
      operation: ''
    };
  }

  deleteColumn(index: number) {
    const deletedColumn = this.columns[index];
    this.columns.splice(index, 1);
    this.columns = [...this.columns];

    if (deletedColumn.type === 'number' && !this.columns.some(col => col.type === 'number')) {
      this.numericColumnDeleted.emit();
    }

    this.removeColumn.emit(index);
  }

  getUnitsFromGroup(groupName: string): string[] {
    return this.configService.getUnitsFromGroup(groupName);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.variables.filter(variable =>
      variable.toLowerCase().includes(filterValue)
    );
  }
}
