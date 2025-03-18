export interface TableColumn {
  name: string;
  type: string;
  unit?: string | null;
  units?: string[] | null;
  kpi_variable?: string;
  number_of_decimals?: number;
}

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
  columns: any[];
  rows: any[];
}
export interface Column {
  name: string;
  type: string;
  units?: string[];
  unit?: string | null;
  kpi_variable?: string;
  number_of_decimals?: number | null;
  operation?: string;
}

export interface Row {
  name: string;
  operation?: string;
  [key: string]: any;
}