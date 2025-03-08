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
import { HelperService } from '../../../services/helper.service';

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

  constructor(
    private variableService: VariableService,
    private helperService: HelperService
  ) {
    this.variables = Array.from(this.variableService.variables.keys());
    this.types = this.helperService.getTypes();
    this.allUnits = this.helperService.getAllUnits();
    this.baseUnits = this.helperService.getBaseUnits();
    this.currencyUnits = this.helperService.getCurrencyUnits();

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

    if (this.column.type === 'choices' && !this.column.kpi_variable) {
      return false;
    }

    return true;
  }

  isBaseUnitSelected(): boolean {
    return this.column.units.some(unit => this.helperService.isBaseUnit(unit));
  }

  isCurrencySelected(): boolean {
    return this.column.units.some(unit => this.helperService.isCurrencyUnit(unit));
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
      const newColumn = { ...this.column };
      this.columns.push(newColumn);
      this.columns = [...this.columns];
      this.addColumn.emit(newColumn);
      this.resetForm();
    }
  }

  onVariableSelected(event: any) {
    this.column.kpi_variable = event.option.value;
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
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.variables.filter(variable =>
      variable.toLowerCase().includes(filterValue)
    );
  }
}
