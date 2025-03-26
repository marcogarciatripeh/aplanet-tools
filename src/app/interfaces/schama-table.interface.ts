export interface TableColumn extends Column {}

export interface TableRow {
  [key: string]: any;
}

export interface CurrencySymbol {
  [key: string]: string;
}

export type UnitSelection = {
  [key: string]: string;
}

export interface TableSchema {
  columns: Column[];
  rows: Row[];
}
export interface Column {
  name: string;
  type: string;
  units?: string[];
  kpi_variable?: string;
  number_of_decimals?: number | null;
  operation?: string;
}

export interface Row {
  name: string;
  operation?: string;
  [key: string]: any;
}

export interface UnitGroup {
  name: string;
  units: { [key: string]: string };
}