import { Component, ElementRef, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { VariableService } from '../../../services/variables.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Column, TableColumn, TableRow, UnitSelection } from '../../../interfaces/schama-table.interface';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigService } from '../../../services/config.service';

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
      this.rows = value.rows || [];

      this.rows.forEach((row, rowIndex) => {
        this.columns.forEach((column, colIndex) => {
          if (this.isCurrency(column) && column.units && column.units.length > 0) {
            // Sempre seleciona a primeira unidade disponível
            this.selectedUnit[this.getUnitKey(rowIndex, colIndex)] = column.units[0];
          }
        });
      });

      const firstColumn = this.columns[0];
      if (firstColumn && firstColumn.kpi_variable) {

        const kpiValues = this.variableService.getVariableValues(firstColumn.kpi_variable);

        this.rows = kpiValues.map(kpiValue => {
          const newRow: any = {
            [firstColumn.name]: kpiValue
          };

          this.columns.slice(1).forEach((col: Column) => {
            newRow[col.name] = this.getDefaultValue(col);

            if (col.units) {
              const rowIndex = kpiValues.indexOf(kpiValue);
              const colIndex = this.columns.indexOf(col);
              this.selectedUnit[this.getUnitKey(rowIndex, colIndex)] = col.units[0];
            }
          });

          return newRow;
        });
      } else {
        this.rows = value.rows.map((row: any) => {
          const newRow: any = {};

          if (this.columns.length > 0) {
            newRow[this.columns[0].name] = row.name;
          }

          this.columns.slice(1).forEach((col: Column) => {
            newRow[col.name] = this.getDefaultValue(col);
          });

          if (row.operation) {
            newRow.operation = row.operation;
          }

          return newRow;
        });
      }

      this.updateDisplayedColumns();
    }
  }


  columns: TableColumn[] = [];
  rows: TableRow[] = [];
  displayedColumns: string[] = [];
  isMobile = false;
  selectedUnit: UnitSelection = {};

  constructor(
    private variableService: VariableService,
    public configService: ConfigService,
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

    this.updateDisplayedColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows']) {
      this.updateDisplayedColumns();
    }
  }

  //Misc. session
  scrollToTable() {
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.columns.map(col => col.name);

    if (this.hasRowsWithSum()) {
      this.displayedColumns.push('rowTotal');
    }
  }

  formatNumber(value: number, column: TableColumn): string {
    const decimals = column.number_of_decimals ?? null;
    return this.configService.formatNumber(value, decimals);
  }

  //Calculate session
  calculateRowTotal(row: any): string {
    if (!row.operation || row.operation !== 'sum') {
      return '';
    }

    const total = this.columns
      .filter(col => col.type === 'number')
      .reduce((sum, col) => {
        const value = parseFloat(row[col.name]) || 0;
        return sum + value;
      }, 0);

    const maxDecimals = Math.min(
      Math.max(
        0,
        ...this.columns
          .filter(col => col.type === 'number')
          .map(col => col.number_of_decimals || 0)
      ),
      20
    );

    try {
      return total.toFixed(maxDecimals);
    } catch (error) {
      return total.toString();
    }
  }

  calculateColumnTotal(columnName: string): string {
    const column = this.columns.find(col => col.name === columnName);

    if (!column || column.type !== 'number' || !column.operation || column.operation !== 'sum') {
      return '';
    }

    const total = this.rows.reduce((sum, row) => {
      const value = parseFloat(row[columnName]) || 0;
      return sum + value;
    }, 0);

    const decimals = Math.min(Math.max(0, column.number_of_decimals || 0), 20);

    try {
      return total.toFixed(decimals);
    } catch (error) {
      return total.toString();
    }
  }

  //Check session
  isEditable(column: TableColumn): boolean {
    return column.type === 'text' && !column.kpi_variable;
  }

  isPresetRow(row: TableRow): boolean {
    return 'name' in row;
  }

  isCurrency(column: Column): boolean {
    return this.configService.isCurrency(column);
  }

  isCurrencyUnit(unit: string): boolean {
    return this.configService.isCurrencyUnit(unit);
  }

  hasOnlyChoiceColumns(): boolean {
    return this.columns.length > 0 && this.columns.every(col => col.type === 'choices');
  }

  hasCurrencyUnit(column: TableColumn): boolean {
    return column.units?.some(u => this.configService.isCurrencyUnit(u)) || false;
  }

  hasPercentageUnit(column: TableColumn): boolean {
    return column.units?.includes('percentage') || false;
  }

  hasTotals(): boolean {
    return this.columns.some(col => col.operation === 'sum') ||
          this.rows.some(row => row['operation'] === 'sum');
  }

  hasRowsWithSum(): boolean {
    return this.rows && this.rows.some(row => row['operation'] === 'sum');
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
    const row: TableRow = { ...presetRow };

    if (presetRow.operation) {
      row['operation'] = presetRow.operation;
    }

    this.columns.forEach((col, colIndex) => {
      if (presetRow[col.name] !== undefined) {
        row[col.name] = presetRow[col.name];
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
    return this.configService.getDefaultValue(column);
  }

  getCurrencySymbol(unit: string): string {
    return this.configService.getCurrencySymbol(unit);
  }

  getUnitKey(rowIndex: number, columnIndex: number): string {
    return this.configService.getUnitKey(rowIndex, columnIndex);
  }

  getKpiValues(kpiVariable: string): string[] {
    return this.variableService.getVariableValues(kpiVariable);
  }

  getSelectedUnit(rowIndex: number, colIndex: number, column: Column): string {
    return this.configService.getSelectedUnit(rowIndex, colIndex, column);
  }

  getUnitsList(column: Column): string[] {
    return column.units || [];
  }

  getUnitDisplay(unit: string): string {
    const group = this.configService.getUnitGroups()
      .find(g => Object.keys(g.units).includes(unit));
    return group ? group.units[unit] : unit;
  }

  getSelectedUnitSymbol(rowIndex: number, colIndex: number): string {
    const unit = this.selectedUnit[this.getUnitKey(rowIndex, colIndex)];
    return this.isCurrencyUnit(unit) ? this.getCurrencySymbol(unit) : '';
  }

  //On session
  onUnitsChange(unit: string, rowIndex: number, columnIndex: number) {
    const key = this.getUnitKey(rowIndex, columnIndex);
    this.selectedUnit[key] = unit;
  }

  onChoicesChange(event: any, column: TableColumn, row: any) {
  }
}
