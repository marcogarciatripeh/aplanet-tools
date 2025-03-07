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
