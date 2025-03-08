import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Variables {
  readonly variables = new Map<string, string[]>([
    ['regions', ['Region 1', 'Region 2']],
    ['country', ['Country 1', 'Country 2']],
    ['location-of-operation', ['location of operation 1', 'location of operation 2']],

    ['gender', ['Men', 'Women', 'Others']],
    ['age-group', ['Less 30', 'Between 30 and 50', 'More 50']],

    ['employee-category', [
      'Board of Directors',
      'Presidency and Vice Presidency',
      'Boards',
      'Managers',
      'Technical Crew',
      'Commercial Crew',
      'Coordinators',
      'Experts',
      'Analysts',
      'Operations'
    ]],
    ['governance-body', ['governance body 1', 'governance body 2']],

    ['evd-type', [
      'Community investments',
      'Employee wages and benefits',
      'Operating costs',
      'Payments to government by country',
      'Payments to providers of capital'
    ]],

    ['water-type', ['Groundwater', 'Produced water', 'Seawater', 'Surface water', 'Thirdparty water']],
    ['renewable-material', ['renewable material 1', 'renewable material 2']],
    ['non-renewable-material', ['non renewable material 1', 'non renewable material 2']],

    ['facilities', ['Facility 1', 'Facility 2']],
    ['water-installations', ['water installation 1', 'water installation 2']],

    ['ecological-consequences', [
      'Air pollution',
      'Water pollution',
      'Soil contamination',
      'Biodiversity loss',
      'Climate change',
      'Deforestation',
      'Ocean acidification',
      'Ozone depletion'
    ]],
    ['resource-use', ['Water', 'Energy', 'Raw materials']],
    ['human-health', ['Direct impact', 'Indirect impact']],

    ['mdr-p', [
      '[MDR-P_01] Description of key contents of policy',
      '[MDR-P_02] Description of scope of policy or of its exclusions',
    ]],
    ['mdr-a', [
      '[MDR-A_01] Disclosure of key action',
      '[MDR-A_02] Description of scope of key action',
    ]],

    ['e-prtr-pollutant', [
      'Methane (CH4)',
      'Carbon monoxide (CO)',
      'Carbon dioxide (CO2)',
    ]],

    ['time-period', ['Short-term', 'Medium-term', 'Long-term']],

    ['product-category', ['product category 1', 'product category 2']],
    ['type-of-business-partner', ['type of business partner 1', 'type of business partner 2']],

    ['waste-composition', ['waste composition 1', 'waste composition 2']],
    ['hazard', ['hazard 1', 'hazard 2']]
  ]);

  private currencySymbols = new Map<string, string>([
    ['euro', '€'],
    ['pound', '£'],
    ['dollar', '$']
  ]);

  getVariableValues(key: string): string[] {
    return this.variables.get(key) || [];
  }

  getCurrencySymbol(currency: string): string {
    return this.currencySymbols.get(currency) || currency;
  }
}
