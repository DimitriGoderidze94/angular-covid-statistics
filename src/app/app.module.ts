import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';

import { TimeComponent } from './components/time/time.component';
import { FirstPageComponent } from './components/first-page/first-page.component';
import { InfoBoxesComponent } from './components/info-boxes/info-boxes.component';
import { SecondPageComponent } from './components/second-page/second-page.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    TimeComponent,
    InfoBoxesComponent,
    SecondPageComponent,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
