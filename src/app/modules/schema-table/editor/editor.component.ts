import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { defaultTemplate, monacoConfig, monacoEnvironment } from './editor.configuration';
import { defaultSchema } from './editor.configuration';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    MonacoEditorModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  providers: [
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }
  ],
  templateUrl: './editor.component.html',
  styleUrl: 'editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {
  @Input() code: string = defaultTemplate;
  @Input() useDefaultTemplate: boolean = true;
  @Output() codeChange = new EventEmitter<string>();
  @Output() validationChange = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string>();
  @Output() validCode = new EventEmitter<any>();

  editorOptions = monacoConfig.defaultOptions;
  currentError: string = '';
  hasError: boolean = false;
  editorLoaded = false;
  editor: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    (self as any).MonacoEnvironment = monacoEnvironment;

    if (this.useDefaultTemplate) {
      this.code = defaultTemplate;
    } else {
      this.code = JSON.stringify({
        columns: [],
        rows: []
      }, null, 4);
    }
  }

  onCodeChanged(value: string) {
    this.code = value;
    this.codeChange.emit(value);
    this.validateJson();
  }

  onEditorInit(editor: any) {
    this.editor = editor;
    this.editorLoaded = true;
    this.cdr.detectChanges();
    this.validateJson();
  }

  validateJson() {
    try {
      const parsedJson = JSON.parse(this.code);

      if (!parsedJson.columns || !Array.isArray(parsedJson.columns) || parsedJson.columns.length < 1) {
        throw new Error('Invalid JSON: must have at least one column');
      }

      for (const column of parsedJson.columns) {
        if (!defaultSchema.validationRules.validateColumn(column, parsedJson.columns)) {
          throw new Error(`Invalid column: ${JSON.stringify(column)}`);
        }
      }

      if (parsedJson.rows && Array.isArray(parsedJson.rows) && parsedJson.rows.length > 0) {
        const invalidRows = parsedJson.rows.filter((row: any) => !row.name);
        if (invalidRows.length > 0) {
          throw new Error('Invalid rows: all rows must have a "name" property');
        }
      }

      this.currentError = '';
      this.hasError = false;
      this.errorMessage.emit('');
      this.validationChange.emit(false);
      this.validCode.emit(parsedJson);
    } catch (e: any) {
      this.currentError = e.message;
      this.hasError = true;
      this.errorMessage.emit(e.message);
      this.validationChange.emit(true);
    }
  }

  updateSchema(schema: string) {
    if (this.editor) {
      this.editor.setValue(schema);
      this.validateJson();
    }
  }

  async copyToClipboard() {
    if (this.editor) {
      const content = this.editor.getValue();
      try {
        await navigator.clipboard.writeText(content);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }
}
