import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { RowFormComponent } from '../row-form/row-form.component';
import { EditorComponent } from '../editor/editor.component';
import { TableSchema } from '../../../interfaces/schama-table.interface';
import { HelperService } from '../../../services/helper.service';

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

  constructor(
    private helperService: HelperService,
  ) {}

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
      const formattedSchema = {
        columns: this.schema.columns.map(column => {
          if (column.units && column.units.length === 1 && this.helperService.getBaseUnits().includes(column.units[0])) {
            const { units, ...rest } = column;
            return {
              ...rest,
              unit: units[0]
            };
          }
          return column;
        }),
        rows: this.schema.rows
      };

      const jsonSchema = JSON.stringify(formattedSchema, null, 4);
      this.editor.updateSchema(jsonSchema);
    }
  }
}
