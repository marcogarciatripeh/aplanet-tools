import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private readonly types = ['text', 'number', 'boolean', 'choices'];
  private readonly baseUnits = ['percentage', 'integer', 'currency'];
  private readonly currencyUnits = ['euro', 'pound', 'dollar'];
  private readonly allUnits = [...this.baseUnits, ...this.currencyUnits];
  private readonly currencySymbols = new Map<string, string>([
    ['euro', '€'],
    ['pound', '£'],
    ['dollar', '$']
  ]);

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
}
