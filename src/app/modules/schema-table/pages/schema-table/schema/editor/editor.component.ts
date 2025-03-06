import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { defaultTemplate, monacoConfig, monacoEnvironment } from './editor.configuration';
import { defaultSchema } from './editor.configuration';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
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
  @Output() codeChange = new EventEmitter<string>();
  @Output() validationChange = new EventEmitter<boolean>();
  @Output() errorMessage = new EventEmitter<string>();

  editorOptions = monacoConfig.defaultOptions;
  currentError: string = '';
  hasError: boolean = false;
  editorLoaded = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    (self as any).MonacoEnvironment = monacoEnvironment;
  }

  onCodeChanged(value: string) {
    this.code = value;
    this.codeChange.emit(value);
    this.validateJson();
  }

  validateJson() {
    try {
      const parsedJson = JSON.parse(this.code);

      if (!parsedJson.columns || !Array.isArray(parsedJson.columns) || parsedJson.columns.length < 1) {
        throw new Error('JSON invalid: must have at least one column');
      }

      for (const column of parsedJson.columns) {
        if (!defaultSchema.validationRules.validateColumn(column)) {
          throw new Error(`Column invalid: ${JSON.stringify(column)}`);
        }
      }

      this.currentError = '';
      this.hasError = false;
      this.errorMessage.emit('');
      this.validationChange.emit(false);
    } catch (e: any) {
      this.currentError = e.message;
      this.hasError = true;
      this.errorMessage.emit(e.message);
      this.validationChange.emit(true);
      console.log(e);
    }
  }

  onEditorInit() {
    this.editorLoaded = true;
    this.cdr.detectChanges();
  }
}
