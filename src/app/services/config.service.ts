import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly types = ['text', 'number', 'boolean', 'choices'];
  private readonly baseUnits = ['percentage', 'integer', 'currency'];
  private readonly currencyUnits = ['euro', 'pound', 'dollar'];
  private readonly allUnits = [...this.baseUnits, ...this.currencyUnits];
  private readonly currencySymbols = new Map<string, string>([
    ['euro', '€'],
    ['pound', '£'],
    ['dollar', '$']
  ]);

  readonly requiredSchemaFields = ['columns'];
  readonly requiredColumnAttributes = ['name', 'type'];
  readonly optionalColumnAttributes = ['kpi_variable', 'number_of_decimals', 'unit', 'units', 'options'];

  readonly fieldValidations: { [key: string]: (value: any) => boolean } = {
    kpi_variable: (value: any) => typeof value === 'string',
    number_of_decimals: (value: any) => value === null ||
      (typeof value === 'number' && value >= 0 && value <= 6),
    unit: (value: any) => value === null ||
      (typeof value === 'string' && this.baseUnits.includes(value)),
    units: (value: any) => Array.isArray(value) &&
      value.every(unit => this.allUnits.includes(unit)),
    options: (value: any) => Array.isArray(value) &&
      value.every(opt => typeof opt === 'string')
  };

  readonly schemaVersion = "1.0";
  readonly defaultTemplate = `{
    "columns": [
      {
        "name": "Regions",
        "type": "text",
        "unit": null,
        "kpi_variable": "regions"
      },
      {
        "name": "Country",
        "type": "text",
        "unit": null
      },
      {
        "name": "Economic value",
        "type": "number",
        "units": ["euro", "pound", "dollar"],
        "number_of_decimals": 6
      }
    ],
    "rows": []
  }`;

  getCurrencySymbol(currency: string): string {
    return this.currencySymbols.get(currency) || currency;
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

  isBaseUnit(unit: string): boolean {
    return this.baseUnits.includes(unit);
  }

  isCurrencyUnit(unit: string): boolean {
    return this.currencyUnits.includes(unit);
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

      if (!this.types.includes(column.type)) {
        throw new Error(`Invalid type: ${column.type}`);
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
}
