import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { TableFixedSizeVirtualScroll } from './table/table-vs-strategy.service';
import { ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, ScrollingModule, MatTableModule, MatFormFieldModule , MatInputModule, BrowserAnimationsModule, MatSortModule ],
  declarations: [ AppComponent, TableComponent, TableFixedSizeVirtualScroll ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
