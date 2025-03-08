import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnFormComponent } from '../column-form/column-form.component';
import { RowFormComponent } from '../row-form/row-form.component';
@Component({
  selector: 'app-table-builder',
  standalone: true,
  imports: [
    CommonModule,
    ColumnFormComponent,
    RowFormComponent
  ],
  templateUrl: './table-builder.component.html',
  styleUrls: ['./table-builder.component.scss']
})
export class TableBuilderComponent {
}
