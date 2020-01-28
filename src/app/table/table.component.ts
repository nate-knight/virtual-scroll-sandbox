import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import {MatSort} from '@angular/material/sort';
import { TableVirtualScrollStrategy } from './table-vs-strategy.service';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges {


  @Input() rows$: Subject<Array<any>>;
  @Input() rows: Array<any>;
  
  // @Input() name: any;
  // @Input() name$: any;


  

  // public myName = {first: 'nate', last: 'knight'};
  public myDataSource = new MatTableDataSource();
  
  rowsForVirtualScroll$: Subject<Array<any>> = new Subject<Array<any>>();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  gridHeight = 400;

  constructor() {}

  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatSort) sort: MatSort;

  public ngOnInit() {
     
   
    // this.rowsForVirtualScroll$ = this.rows$;
    // this.rowsForVirtualScroll$ = this.rows;
    // console.log('rows ', this.rows.length);
    // this.rowsForVirtualScroll$.next(this.rows);

    // this.myDataSource.data = this.rowsForVirtualScroll$;
 
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.rows) {
      // console.log('changes', changes.rows.currentValue.length);
      // console.log('--', this.rows.length);
      this.myDataSource.data = this.rows;
       this.myDataSource.sort = this.sort;
  
      this.rowsForVirtualScroll$.next(this.myDataSource.filteredData);
      // console.log('ngOnchanges', this.rows.length);

      // this.myDataSource.data = this.rows;

    }

    if (changes.name$) {
      this.name$
    }

  }

   applyFilter(filterValue: string) {
     console.log('applyfilter ', filterValue);
    this.myDataSource.filter = filterValue.trim().toLowerCase();

    // update virutal scroll collection:
    // this.updateCollection();
    this.rowsForVirtualScroll$.next(this.myDataSource.filteredData);
   }

   onSortChange(e: any){
    console.log('onSortChange', e);
    // console.log('SORT first', this.myDataSource.data[0]);
    // console.log('SORT sortdData', this.myDataSource.);
    // console.log('SORT filteredData', this.myDataSource._orderData(this.myDataSource.filteredData)); //works
    // console.log('SORT filteredData', this.myDataSource.filteredData); //works
    // console.log('nate', this.myDataSource._orderData(this.myDataSource.filteredData)[0]);
    this.rowsForVirtualScroll$.next(this.myDataSource._orderData(this.myDataSource.filteredData));
  }

  updateCollection() {

  }

}