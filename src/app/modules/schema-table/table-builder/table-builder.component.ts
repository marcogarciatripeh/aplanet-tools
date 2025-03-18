import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { RowFormComponent } from '../row-form/row-form.component';
import { EditorComponent } from '../editor/editor.component';
import { TableSchema } from '../../../interfaces/schama-table.interface';
import { ConfigService } from '../../../services/config.service';

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
  @ViewChild(ColumnFormComponent) columnForm!: ColumnFormComponent;

  constructor(
    private configService: ConfigService,
  ) {}

  private schema: TableSchema = {
    columns: [],
    rows: []
  };

  onAddColumn(column: any) {
    if (this.schema.columns.length === 0 && column.type !== 'text') {
      throw new Error('First column must be of type text');
    }

    this.schema.columns.push(column);
    this.updateEditor();
  }

  onRemoveColumn(index: number) {
    this.schema.columns.splice(index, 1);
    this.updateEditor();
  }

  onAddRow(row: any) {
    if (this.columnForm && this.columnForm.isRowsDisabled()) {
      return;
    }

    this.schema.rows.push(row);
    this.updateEditor();
  }

  onRemoveRow(index: number) {
    if (index === -1) {
      this.schema.rows = [];
    } else {
      this.schema.rows.splice(index, 1);
    }
    this.updateEditor();
  }

  onRemoveAllRows() {
    this.schema.rows = [];
    this.updateEditor();
  }

  updateEditor() {
    if (this.editor) {
      const formattedSchema = {
        columns: this.schema.columns.map(column => {
          if (column.units && column.units.length === 1 && this.configService.getBaseUnits().includes(column.units[0])) {
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
