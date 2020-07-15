import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { DxPivotGridModule, DxPivotGridComponent } from 'devextreme-angular';
import dxPivotGrid from 'devextreme/ui/pivot_grid';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DxPivotGridModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
