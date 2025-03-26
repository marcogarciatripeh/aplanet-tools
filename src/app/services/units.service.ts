import { UnitGroup } from "../interfaces/schama-table.interface";

export const UNIT_GROUPS: UnitGroup[] = [
  {
    name: 'area',
    units: {
      'square-metre': 'Square Metre',
      'square-kilometre': 'Square Kilometre',
      'acre': 'Acre',
      'hectare': 'Hectare',
      'square-foot': 'Square Foot',
      'square-inch': 'Square Inch',
      'square-yard': 'Square Yard'
    }
  },
  {
    name: 'births',
    units: {
      'units-per-1000-births': 'Units Per 1000 Births',
      'units-per-10000-births': 'Units Per 10000 Births',
      'units-per-birth': 'Units Per Birth',
      'units-per-10-births': 'Units Per 10 Births',
      'units-per-100-births': 'Units Per 100 Births',
      'units-per-100000-births': 'Units Per 100000 Births',
      'units-per-1000000-births': 'Units Per 1000000 Births'
    }
  },
  {
    name: 'density',
    units: {
      'density': 'Density'
    }
  },
  {
    name: 'emissions',
    units: {
      'tonnes-of-carbon-dioxide': 'Tonnes Of Carbon Dioxide',
      'kilograms-of-carbon-dioxide': 'Kilograms Of Carbon Dioxide',
      'tonnes-of-co2-equivalent-of-co2': 'Tonnes Of Co2 Equivalent Of Co2',
      'kilograms-of-co2-equivalent-of-co2': 'Kilograms Of Co2 Equivalent Of Co2',
      'tonnes-of-co2-equivalent': 'Tonnes Of Co2 Equivalent',
      'kilograms-of-co2-equivalent': 'Kilograms Of Co2 Equivalent',
      'tonnes-of-co2-equivalent-of-ch4': 'Tonnes Of Co2 Equivalent Of Ch4',
      'kilograms-of-co2-equivalent-of-ch4': 'Kilograms Of Co2 Equivalent Of Ch4',
      'tonnes-of-co2-equivalent-of-n2o': 'Tonnes Of Co2 Equivalent Of N2o',
      'kilograms-of-co2-equivalent-of-n2o': 'Kilograms Of Co2 Equivalent Of N2o'
    }
  },
  {
    name: 'energy',
    units: {
      'joule': 'Joule',
      'megajoule': 'Megajoule',
      'gigajoule': 'Gigajoule',
      'terajoule': 'Terajoule',
      'calorie': 'Calorie',
      'kilowatt-hour': 'Kilowatt / Hour',
      'megawatt-hour': 'Megawatt / Hour',
      'gigawatt-hour': 'Gigawatt / Hour',
      'kilowatt-hour-net': 'Kilowatt Hour Net',
      'kilowatt-hour-net-calorific-value': 'Kilowatt Hour Net Calorific Value',
      'kilowatt-hour-gross-calorific-value': 'Kilowatt Hour Gross Calorific Value',
      'megawatt-hour-net': 'Megawatt Hour Net',
      'megawatt-hour-net-calorific-value': 'Megawatt Hour Net Calorific Value',
      'megawatt-hour-gross-calorific-value': 'Megawatt Hour Gross Calorific Value',
      'gigawatt-hour-net': 'Gigawatt Hour Net',
      'gigawatt-hour-net-calorific-value': 'Gigawatt Hour Net Calorific Value',
      'gigawatt-hour-gross-calorific-value': 'Gigawatt Hour Gross Calorific Value',
      'calorie-fda': 'Calorie Fda',
      'kilowatt-hour-gross': 'Kilowatt Hour Gross',
      'megawatt-hour-gross': 'Megawatt Hour Gross',
      'gigawatt-hour-gross': 'Gigawatt Hour Gross',
      'megawatt-gross': 'Megawatt Gross',
      'volt-ampere': 'Volt Ampere',
      'kilovolt-ampere': 'Kilovolt Ampere',
      'megavolt-ampere': 'Megavolt Ampere'
    }
  },
  {
    name: 'information',
    units: {
      'megabyte': 'Megabyte',
      'gigabyte': 'Gigabyte',
      'terabyte': 'Terabyte',
      'petabyte': 'Petabyte',
      'bit': 'Bit',
      'byte': 'Byte',
      'kilobyte': 'Kilobyte'
    }
  },
  {
    name: 'integer',
    units: {
      'integer': 'Integer'
    }
  },
  {
    name: 'intensity',
    units: {
      'intensity': 'Intensity'
    }
  },
  {
    name: 'length',
    units: {
      'metre': 'Metre',
      'kilometre': 'Kilometre',
      'millimetre': 'Milimetre',
      'foot': 'Foot',
      'inch': 'Inch',
      'mile': 'Mile',
      'nautical-mile': 'Nautical Mile',
      'yard': 'Yard'
    }
  },
  {
    name: 'luminous-intensity',
    units: {
      'candela': 'Candela'
    }
  },
  {
    name: 'percentage',
    units: {
      'percentage': 'Percentage'
    }
  },
  {
    name: 'population',
    units: {
      'units-per-100000-inhabitants': 'Units Per 100000 Inhabitants',
      'units-per-1000000-inhabitants': 'Units Per 1000000 Inhabitants',
      'units-per-inhabitants': 'Units Per Inhabitants',
      'units-per-10-inhabitants': 'Units Per 10 Inhabitants',
      'units-per-100-inhabitants': 'Units Per 100 Inhabitants',
      'units-per-1000-inhabitants': 'Units Per 1000 Inhabitants',
      'units-per-10000-inhabitants': 'Units Per 10000 Inhabitants'
    }
  },
  {
    name: 'power',
    units: {
      'watt': 'Watt',
      'megawatt': 'Mega Watt'
    }
  },
  {
    name: 'pressure',
    units: {
      'pascal': 'Pascal',
      'bar': 'Bar',
      'pound-per-square-inch': 'Pound Per Square Inch'
    }
  },
  {
    name: 'temperature',
    units: {
      'degree-kelvin': 'Kelvin',
      'degree-celsius': 'Celsius',
      'degree-fahrenheit': 'Fahrenheit'
    }
  },
  {
    name: 'time',
    units: {
      'second': 'Second',
      'week': 'Week',
      'minute': 'Minute',
      'hour': 'Hour',
      'day': 'Day',
      'month': 'Month',
      'year': 'Year'
    }
  },
  {
    name: 'volume',
    units: {
      'cubic-metre': 'Cubic Metre',
      'thousand-cubic-metre': 'Thousand Cubic Metre',
      'cubic-hectometre': 'Cubic Hectometre',
      'barrel': 'Barrel',
      'cubic-foot': 'Cubic Foot',
      'litre': 'Litre',
      'hectolitre': 'Hectolitre',
      'us-gallon': 'US Gallon',
      'pint': 'Pint',
      'cubic-yard': 'Cubic Yard',
      'imperial-gallon': 'Imperial Gallon',
      'us-fluid-gallon': 'Us Fluid Gallon'
    }
  },
  {
    name: 'weight',
    units: {
      'ounce': 'Ounce',
      'tonne': 'Tonne',
      'milligram': 'Milligram',
      'gram': 'Gram',
      'kilogram': 'Kilogram',
      'libre': 'Libre',
      'thousands-of-tonnes': 'Thousands Of Tonnes',
      'millions-of-tonnes': 'Millions Of Tonnes'
    }
  },
  {
    name: 'currency',
    units: {
      'euro': 'Euro',
      'pound': 'Pound',
      'dollar': 'Dollar',
      'currency-brl': 'Currency BRL'
    }
  }
];

export const UNIT_SYMBOLS = new Map<string, string>([
  ['euro', '€'],
  ['pound', '£'],
  ['dollar', '$'],
  ['currency-brl', 'R$'],
]);