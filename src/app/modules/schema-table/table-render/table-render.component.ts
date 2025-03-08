import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { VariableService } from '../../../services/variables.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TableColumn, TableRow, UnitSelection } from '../../../interfaces/schama-table.interface';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'app-table-render',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './table-render.component.html',
  styleUrls: ['./table-render.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TableRenderComponent {
  @Input() set data(value: any) {
    if (value) {
      this.columns = value.columns || [];

      if (value.rows?.length > 0) {
        this.rows = value.rows.map((presetRow: any) =>
          this.initializeRowWithPresetData(presetRow)
        );
      } else {
        this.rows = [];
        if (this.hasOnlyChoiceColumns()) {
          this.initializeEmptyRow();
        } else {
          this.initializeRowsFromKpiVariables();
        }
      }

      this.displayedColumns = this.columns.map(col => col.name);
    }
  }

  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  displayedColumns: string[] = [];
  isMobile = false;
  selectedUnit: UnitSelection = {};

  constructor(
    private variableService: VariableService,
    private helperService: HelperService,
    private breakpointObserver: BreakpointObserver,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

    setTimeout(() => {
      this.scrollToTable();
    }, 100);
  }

  //Misc. session
  hasOnlyChoiceColumns(): boolean {
    return this.columns.length > 0 && this.columns.every(col => col.type === 'choices');
  }

  scrollToTable() {
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  //Check session
  isEditable(column: TableColumn): boolean {
    return column.type === 'text' && !column.kpi_variable;
  }

  isPresetRow(row: TableRow): boolean {
    return 'name' in row;
  }

  //Initialize session
  initializeEmptyRow() {
    const row: TableRow = {};
    const rowIndex = this.rows.length;

    this.columns.forEach((col, colIndex) => {
      row[col.name] = this.getDefaultValue(col);
      if (col.units) {
        this.selectedUnit[this.getUnitKey(rowIndex, colIndex)] = col.units[0];
      }
    });
    this.rows.push(row);
  }

  initializeRowsFromKpiVariables() {
    const kpiColumn = this.columns.find(col => col.kpi_variable);

    if (kpiColumn && kpiColumn.kpi_variable) {
      const kpiValues = this.variableService.getVariableValues(kpiColumn.kpi_variable);

      kpiValues.forEach((value, rowIndex) => {
        const row: TableRow = {};

        this.columns.forEach((col, colIndex) => {
          if (col.kpi_variable === kpiColumn.kpi_variable) {
            row[col.name] = value;
          } else {
            row[col.name] = this.getDefaultValue(col);
            if (col.units) {
              this.selectedUnit[this.getUnitKey(rowIndex, colIndex)] = col.units[0];
            }
          }
        });

        this.rows.push(row);
      });
    } else {
      this.initializeEmptyRow();
    }
  }

  initializeRowWithPresetData(presetRow: any): TableRow {
    const row: TableRow = {};

    this.columns.forEach((col, colIndex) => {
      if (this.isPresetRow(presetRow)) {
        row[col.name] = presetRow.name;
      } else {
        row[col.name] = this.getDefaultValue(col);
        if (col.units) {
          this.selectedUnit[this.getUnitKey(this.rows.length, colIndex)] = col.units[0];
        }
      }
    });

    return row;
  }

  //Get session
  getDefaultValue(column: TableColumn): any {
    if (column.type === 'text') {
      return '-';
    }

    if (column.type === 'number') {
      if (column.unit === 'percentage') {
        return 0;
      }
      if (column.unit === 'currency') {
        return column.number_of_decimals ? Number(0).toFixed(column.number_of_decimals) : 0;
      }
      return 0;
    }

    if (column.type === 'choices') {
      return [];
    }

    return '-';
  }

  getCurrencySymbol(currency: string): string {
    return this.helperService.getCurrencySymbol(currency);
  }

  getUnitKey(rowIndex: number, columnIndex: number): string {
    return `unit_${rowIndex}_${columnIndex}`;
  }

  getKpiValues(kpiVariable: string): string[] {
    return this.variableService.getVariableValues(kpiVariable);
  }

  //On session
  onUnitChange(unit: string, rowIndex: number, columnIndex: number) {
    const key = this.getUnitKey(rowIndex, columnIndex);
    this.selectedUnit[key] = unit;
  }

  onChoicesChange(event: any, column: TableColumn, row: any) {
  }
}
