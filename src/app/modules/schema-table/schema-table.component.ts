import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorComponent } from './editor/editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableViewComponent } from './table-view/table-view.component';

@Component({
  selector: 'app-schema-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    EditorComponent,
    MatButtonModule,
    MatIconModule,
    TableViewComponent
  ],
  providers: [],
  templateUrl: './schema-table.component.html',
  styleUrl: './schema-table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SchemaTableComponent {
  tableData: any = null;
  hasError: boolean = false;
  validJsonData: any = null;

  onValidCode(jsonData: any) {
    this.validJsonData = jsonData;
  }

  onValidationChange(hasError: boolean) {
    this.hasError = hasError;
  }

  generateTable() {
    this.tableData = this.validJsonData;
  }
}
