import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { ContentChild, Directive, forwardRef, Input, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { MatTable, MatTableDataSource} from '@angular/material/table';
// import { MatTableDataSource } from '@angular/material';
import { combineLatest, Observable, Subject, of } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

export class TableVirtualScrollStrategy implements VirtualScrollStrategy {

  private readonly indexChange = new Subject<number>();

  private viewport: CdkVirtualScrollViewport;

  public scrolledIndexChange: Observable<number>;

  private readonly bufferSize = 5;

  private dataLength = 0;

  constructor(private scrollHeight: number, private headerOffset: number) {
    this.scrolledIndexChange = this.indexChange.asObservable().pipe(distinctUntilChanged());
  }

  public attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.onDataLengthChanged();
  }

  public detach(): void {
    // no-op
  }

  public onContentScrolled(): void {
    console.log('onContentScrolled');
    this.updateContent(this.viewport);
  }

  public onDataLengthChanged(): void {
    if (this.viewport) {
      this.viewport.setTotalContentSize(this.dataLength * this.scrollHeight);
      this.updateContent(this.viewport);
    }
  }

  public onContentRendered(): void {
    // no-op
  }

  public onRenderedOffsetChanged(): void {
    // no-op
  }

  public scrollToIndex(index: number, behavior: ScrollBehavior): void {
    // no-op
  }

  public setDataLength(length: number): void {
    console.log('setDataLength:', length);
    this.dataLength = length;
    this.onDataLengthChanged();
  }

  public setScrollHeight(rowHeight: number, headerOffset: number) {
    console.log('setScrollHeight: ', rowHeight, headerOffset);
    this.scrollHeight = rowHeight;
    this.headerOffset = headerOffset;
    this.updateContent(this.viewport);
  }

  private updateContent(viewport: CdkVirtualScrollViewport) {
    if (viewport) {
//       const range = Math.ceil(viewport.getViewportSize() / this.scrollHeight) + this.bufferSize * 2;
//       // console.log('viewportsize', viewport.getViewportSize(), 'scrollHeight ', this.scrollHeight);
//       console.log('viewport.measureScrollOffset()', viewport.measureScrollOffset());
//       const newIndex = Math.max(0, Math.round((viewport.measureScrollOffset() - this.headerOffset) / this.scrollHeight) - this.bufferSize);
//       const dataLength = this.dataLength;

//       const start = Math.max(0, newIndex - this.bufferSize);
//       const end = Math.min(dataLength, newIndex + range);
// // console.log('range ', range, ' start --> end ', start, end, ' : length ', end - start, 'newIndex: ', newIndex, 'renderedContentOffset ',this.scrollHeight * start);
//       // console.log('renderedContentOffset', this.scrollHeight * start);
//       viewport.setRenderedContentOffset(this.scrollHeight * start);
//       console.log('updateContent: start, end', start, end);
//       viewport.setRenderedRange({start, end});

//       this.indexChange.next(newIndex);
    }


    if (viewport) {
        const amount = Math.ceil(this.viewport.getViewportSize() / this.scrollHeight);
        const offset = this.viewport.measureScrollOffset() - this.headerOffset;
        const buffer = Math.ceil(amount / 2);

        console.log('viewport.measureScrollOffset()',viewport.measureScrollOffset());

        const skip = Math.round(offset / this.scrollHeight);
        const index = Math.max(0, skip);
        const start = Math.max(0, index - buffer);
        const end = Math.min(this.dataLength, index + amount + buffer);

        this.viewport.setRenderedContentOffset(this.scrollHeight * start);
        this.viewport.setRenderedRange({ start, end });

        this.indexChange.next(index);
    }
  }
}

export function scrollStrategyFactory(scroll: TableFixedSizeVirtualScroll) {
  return scroll.scrollStrategy;
}

@Directive({
  selector: 'cdk-virtual-scroll-viewport[tableData]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: scrollStrategyFactory,
    deps: [forwardRef(() => TableFixedSizeVirtualScroll)],
  }],
})
export class TableFixedSizeVirtualScroll implements OnChanges, OnInit, OnDestroy {
  @Input()
  rowHeight: number = 40;

  @Input()
  offset: number = 40;

  @Input()
  tableData: Observable<Array<any>>;
  // tableData: Subject<Array<any>> = new Subject<Array<any>>();
  // tableData: MatTableDataSource<any>;

  // @Input()
  // set tableData(val: Observable<Array<any>>) {
  //   this._tableData = val;
  //   // console.log('getting tableData ', val);
  //   if (val) {
  //     this.setTableDataSource();
  //     this.subscribeToTableData();
  //   }
    
  // };

  // private _tableData: Observable<Array<any>>; // = of([]);
  // get tableData(): Observable<Array<any>> { return this._tableData; };

// @Input()
// name: string;

// @Input()
// name$: any;

  // @Input()
  // mtDataSource: MatTableDataSource<any>; //= new MatTableDataSource();

  @ContentChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  @ContentChild(MatTable)
  table: MatTable<any>;

  public scrollStrategy = new TableVirtualScrollStrategy(this.rowHeight, this.offset);

  public ngOnInit() {
    // console.log('ngOnInit viewport', this.viewport.elementRef.nativeElement);
    // console.log('ngoninit table ', this.table);
    console.log('ngoninit tabledata ', this.tableData);

      // this.table.dataSource = combineLatest([this.tableData, this.viewport.renderedRangeStream]).pipe(
      //     map((value) => {
      //       // console.log('mapping ', value[0].slice(value[1].start, value[1].end));
      //       console.log('start -> end', value[1].start, value[1].end);
      //       return value[0].slice(value[1].start, value[1].end);
      //     })
      //   );

      this.table.dataSource = combineLatest([this.tableData, this.viewport.renderedRangeStream])
        .pipe(
          map(value => {
            console.log('--------------------RENDERRANGESTREAM UPDATED: start--> end', value[1].start, value[1].end);
            return value[0].slice(value[1].start, value[1].end);
          })
        );

      // this.subscribeToTableData();
      this.tableData
        .pipe(
          takeUntil(this._ngUnsubscribe)
        )
        .subscribe(data => {
          console.log('subscribe data length', data.length);
          this.scrollStrategy.setDataLength(data.length);
        })
  }


  // private subscribeToTableData(): void {
  //   console.log('subscribeToTableData: tableData ',);
  //   this.tableData
  //   .pipe(
  //     takeUntil(this._ngUnsubscribe)
  //   )
  //   .subscribe(data => {
  //     console.log('subscribe data length', data.length);
  //     this.scrollStrategy.setDataLength(data.length);
  //   })
  // }

  public ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges');
    this.scrollStrategy.setScrollHeight(this.rowHeight, this.offset);

  // if (changes.mtDataSource && changes.mtDataSource.currentValue && changes.mtDataSource.currentValue) {
    // console.log('CHANGES mtDataSource', changes.mtDataSource.currentValue);
    // const x: MatTableDataSource<any> = changes.mtDataSource.currentValue;

    // console.log('c', x.filteredData);
    // console.log('c', this.mtDataSource.currentValue);
    // this.tableData.next(changes.mtDataSource.currentValue['filteredData']);

  // }

  // if (changes.name){
  //   console.log('CHANGES NAME', changes.name.currentValue);
  // }

// if (changes.name$){
//     console.log('CHANGES NAME$', changes.name$.currentValue);
//   }

    // if (changes.mtDataSource && changes.mtDataSource.currentValue) {
    //   console.log('mtdatasource', changes.mtdatasource.currentValue);

    //   this.tableData.next(changes.mtdatasource.currentValue);


    // }
  }

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


}