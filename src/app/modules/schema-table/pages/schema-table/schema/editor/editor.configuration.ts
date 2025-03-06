export const defaultSchema = {
  schemaVersion: "1.0",
  jsonStructure: `{
  "columns": [
    {
      "name": "string",
      "type": "string",
      "unit": "string|null",
      "kpi_variable": "string",
      "number_of_decimals": 0,
      "units": ["string"],
      "options": ["string"]
    }
  ],
  "rows": []
}`,

  allowedTypes: [
    "text",
    "number",
    "boolean",
    "choices"
  ],

  allowedUnits: [
    "currency",
    "percentage",
    "integer",
    "euro",
    "pound",
    "dollar",
    null
  ],

  validationRules: {
    required: ["columns"],
    columnRequired: ["name", "type"],
    minColumns: 1,
    validateColumn: (column: any) => {
      if (!column.name || !column.type) {
        return false;
      }

      if (!defaultSchema.allowedTypes.includes(column.type)) {
        return false;
      }

      if (column.type === "number" && column.number_of_decimals) {
        if (typeof column.number_of_decimals !== "number") {
          return false;
        }
      }
      return true;
    }
  }
};

export const defaultTemplate = `{
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

export const monacoConfig = {
  baseUrl: 'assets/monaco/min/vs',
  defaultOptions: {
    theme: 'vs-dark',
    language: 'json',
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible'
    },
    padding: {
      bottom: 45
    },
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
    parameterHints: {
      enabled: false
    },
    snippets: {
      suggestions: false
    },
    wordBasedSuggestions: false,
    suggestSelection: 'never',
    suggest: {
      showIcons: false,
      showStatusBar: false,
      preview: false,
      filterGraceful: false,
      snippets: 'none'
    },
    value: defaultTemplate
  }
};

export const monacoEnvironment = {
  getWorkerUrl: function (moduleId: any, label: string) {
    return `./assets/monaco/min/vs/base/worker/workerMain.js`;
  }
};
