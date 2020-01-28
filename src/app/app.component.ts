import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit  {
  
  rows$: Subject<Array<any>> = new Subject<Array<any>>(); // = of(createData(50000));
  myName = {first: 'nate'};
  myName$: Subject<any> = new Subject<any>();

  ngOnInit() {

  setTimeout(() => {
      this.rows$.next((createData(50)));
      this.myName.first = "adam";
      this.myName = {first: 'joe'};
      this.myName$.next('garfield');

    },1000);

      // this.rows$.next((createData(200)));
  }


}


function createData(size: number = 500) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push({position: i+1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'});
  }

  for (let i = 0; i < size; i++) {
    result.push({position: size+i+1, name: 'Oxygen', weight: 1.0079, symbol: 'O'});
  }
  return result;
}