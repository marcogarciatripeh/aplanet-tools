import { Injectable } from '@angular/core';
import { Column, UnitGroup } from '../interfaces/schama-table.interface';
import { UNIT_GROUPS, UNIT_SYMBOLS } from './units.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private selectedUnit: { [key: string]: string } = {};
  private readonly types = ['text', 'number', 'boolean', 'choices'];

  readonly requiredSchemaFields = ['columns'];
  readonly requiredColumnAttributes = ['name', 'type'];
  readonly optionalColumnAttributes = ['kpi_variable', 'number_of_decimals', 'units', 'options', 'operation'];

  private get allUnits(): string[] {
    return UNIT_GROUPS.reduce((units: string[], group) => {
      return units.concat(Object.keys(group.units));
    }, []);
  }

  private get baseUnits(): string[] {
    return UNIT_GROUPS
      .filter(g => g.name !== 'currency')
      .reduce((units: string[], group) => {
        return units.concat(Object.keys(group.units));
      }, []);
  }

  private get currencyUnits(): string[] {
    const currencyGroup = UNIT_GROUPS.find(g => g.name === 'currency');
    return currencyGroup ? Object.keys(currencyGroup.units) : [];
  }

  readonly fieldValidations: { [key: string]: (value: any) => boolean } = {
    kpi_variable: (value: any) => typeof value === 'string',
    number_of_decimals: (value: any) => value === null ||
      (typeof value === 'number' && value >= 0 && value <= 6),
    units: (value: any) => Array.isArray(value) &&
      this.areUnitsFromSameGroup(value) &&
      value.every(unit => UNIT_GROUPS.some(g => Object.keys(g.units).includes(unit))),
    options: (value: any) => Array.isArray(value) &&
      value.every(opt => typeof opt === 'string'),
    operation: (value: any) => value === null ||
      (typeof value === 'string' && value === 'sum')
  };

  readonly schemaVersion = "1.0";
  readonly defaultTemplate = `{
    "columns": [
      {
        "name": "Regions",
        "type": "text",
        "units": [],
        "kpi_variable": "regions"
      },
      {
        "name": "Country",
        "type": "text",
        "units": []
      },
      {
        "name": "Economic value",
        "type": "number",
        "units": ["euro", "pound", "dollar"],
        "number_of_decimals": 6,
        "operation": "sum"
      }
    ],
    "rows": []
  }`;

  getCurrencySymbol(currency: string): string {
    return UNIT_SYMBOLS.get(currency) || currency;
  }

  getUnitGroups(): UnitGroup[] {
    return UNIT_GROUPS;
  }

  getUnitsFromGroup(groupName: string): string[] {
    const group = UNIT_GROUPS.find(g => g.name === groupName);
    return group ? Object.keys(group.units) : [];
  }

  getUnitGroupFromUnit(unit: string): string | null {
    const group = UNIT_GROUPS.find(g => Object.keys(g.units).includes(unit));
    return group ? group.name : null;
  }

  areUnitsFromSameGroup(units: string[]): boolean {
    if (units.length <= 1) return true;
    const firstUnitGroup = this.getUnitGroupFromUnit(units[0]);
    return units.every(unit => this.getUnitGroupFromUnit(unit) === firstUnitGroup);
  }

  getTypes(): string[] {
    return [...this.types];
  }

  getAllUnits(): string[] {
    return [...this.allUnits];
  }

  getBaseUnits(): string[] {
    return [...this.baseUnits];
  }

  getCurrencyUnits(): string[] {
    return [...this.currencyUnits];
  }

  getDefaultValue(column: Column): any {
    if (column.type === 'text') return '-';

    if (column.type === 'number') {
      if (column.units?.includes('percentage') ||
          column.units?.includes('currency') ||
          column.units?.some(unit => this.isCurrencyUnit(unit))) {
        return 0;
      }
      return 0;
    }

    if (column.type === 'choices') return [];

    return '-';
  }

  getUnitKey(rowIndex: number, columnIndex: number): string {
    return `unit_${rowIndex}_${columnIndex}`;
  }

  getSelectedUnit(rowIndex: number, colIndex: number, column: Column): string {
    const key = this.getUnitKey(rowIndex, colIndex);
    if (!this.selectedUnit[key] && column.units && column.units.length > 0) {
      this.selectedUnit[key] = column.units[0];
    }
    return this.selectedUnit[key];
  }

  isBaseUnit(unit: string): boolean {
    return this.baseUnits.includes(unit);
  }

  isCurrencyUnit(unit: string): boolean {
    return this.currencyUnits.includes(unit);
  }

  isCurrency(column: Column): boolean {
    return (column.units?.includes('currency') ?? false) ||
            (column.units?.some(unit => this.isCurrencyUnit(unit)) ?? false);
  }

  validateColumn(column: any, allColumns: any[]): boolean {
    try {
      if (!this.requiredColumnAttributes.every(attr => column.hasOwnProperty(attr))) {
        throw new Error(`Missing required fields: ${this.requiredColumnAttributes.join(', ')}`);
      }

      const allowedFields = [...this.requiredColumnAttributes, ...this.optionalColumnAttributes];
      const unknownFields = Object.keys(column).filter(field => !allowedFields.includes(field));
      if (unknownFields.length > 0) {
        throw new Error(`Unknown fields found: ${unknownFields.join(', ')}`);
      }

      if (column.units && !Array.isArray(column.units)) {
        throw new Error('Units must be an array');
      }

      if (!this.types.includes(column.type)) {
        throw new Error(`Invalid type: ${column.type}`);
      }

      if (column.type === 'number' && column.operation) {
        if (column.operation !== 'sum') {
          throw new Error('Operation must be "sum" for number type columns');
        }
      }

      Object.keys(column).forEach(field => {
        if (this.optionalColumnAttributes.includes(field)) {
          if (!this.fieldValidations[field](column[field])) {
            throw new Error(`Invalid value for ${field}: ${JSON.stringify(column[field])}`);
          }
        }
      });

    } catch (error) {
      throw error;
    }
    return true;
  }

  transformColumnToSchema(column: Column): Column {
    const schemaColumn: Column = {
      name: column.name,
      type: column.type
    };

    if (column.units && column.units.length > 0) {
      schemaColumn.units = [...column.units];
    }

    if (column.kpi_variable) {
      schemaColumn.kpi_variable = column.kpi_variable;
    }

    if (column.number_of_decimals !== null) {
      schemaColumn.number_of_decimals = column.number_of_decimals;
    }

    if (column.operation) {
      schemaColumn.operation = column.operation;
    }

    return schemaColumn;
  }

  formatNumber(value: number, decimals: number | null): string {
    if (value === null || value === undefined) return '';

    const safeDecimals = Math.min(Math.max(0, decimals || 0), 20);
    try {
      return value.toFixed(safeDecimals);
    } catch (error) {
      return value.toString();
    }
  }

  formatCurrencyValue(value: number, decimals: number, currency: string = 'euro'): string {
    const formattedNumber = this.formatNumber(value, decimals);
    const symbol = this.getCurrencySymbol(currency);
    return `${formattedNumber} ${symbol}`;
  }
}
