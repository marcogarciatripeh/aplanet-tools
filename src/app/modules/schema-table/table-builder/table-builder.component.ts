import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { RowFormComponent } from '../row-form/row-form.component';
import { EditorComponent } from '../editor/editor.component';
import { TableSchema } from '../../../interfaces/schama-table.interface';

@Component({
  selector: 'app-table-builder',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFormComponent,
    RowFormComponent,
    EditorComponent
  ],
  templateUrl: './table-builder.component.html',
  styleUrls: ['./table-builder.component.scss']
})
export class TableBuilderComponent {
  @ViewChild(EditorComponent) editor!: EditorComponent;

  private schema: TableSchema = {
    columns: [],
    rows: []
  };

  onAddColumn(column: any) {
    this.schema.columns.push(column);
    this.updateEditor();
  }

  onRemoveColumn(index: number) {
    this.schema.columns.splice(index, 1);
    this.updateEditor();
  }

  onAddRow(row: any) {
    this.schema.rows.push(row);
    this.updateEditor();
  }

  onRemoveRow(index: number) {
    this.schema.rows.splice(index, 1);
    this.updateEditor();
  }

  updateEditor() {
    if (this.editor) {
      const jsonSchema = JSON.stringify(this.schema, null, 4);
      this.editor.updateSchema(jsonSchema);
    }
  }
}
