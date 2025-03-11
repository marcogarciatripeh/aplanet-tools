import { ConfigService } from '../../../services/config.service';

const configService = new ConfigService();

export const defaultSchema = {
  schemaVersion: configService.schemaVersion,
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

  validationRules: {
    required: configService.requiredSchemaFields,
    columnRequired: configService.requiredColumnAttributes,
    minColumns: 1,
    validateColumn: (column: any, allColumns: any[]) => {
      try {
        return configService.validateColumn(column, allColumns);
      } catch (error) {
        throw new Error(`Column validation error: ${(error as any).message}`);
      }
    }
  }
};

export const defaultTemplate = configService.defaultTemplate;

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
