import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css'],
})
export class FirstPageComponent implements OnInit {
  title = 'covid 19 statistics';
  totalConfirmed = 0;
  todayConfirmed = 0;
  totalDeaths = 0;
  todayDeaths = 0;
  totalRecovered = 0;
  todayRecovered = 0;

  constructor(private api: HttpService) {}
  chosenDate = new Date().toISOString().slice(0, 10);

  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: [
        'შემთხვევები \r\n \r\n' + this.totalConfirmed,
        'გარდაცვალებები \r\n \r\n' + this.totalDeaths,
        'გამოჯანმრთელებები \r\n \r\n' + this.totalRecovered,
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [this.totalConfirmed, this.totalDeaths, this.totalRecovered],
        type: 'line',
      },
    ],
  };

  ngOnInit() {
    (<HTMLInputElement>document.getElementsByClassName('datePicker')[0]).max =
      new Date().toISOString().split('T')[0];

    this.api.getTotalData().subscribe((data) => {
      this.changeDate();
    });
  }

  changeDate() {
    this.chosenDate = (<HTMLInputElement>(
      document.getElementsByClassName('datePicker')[0]
    )).value;

    this.api.getTotalData().subscribe((data) => {
      var myData = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < myData.data.length; i++) {
        if (myData.data[i].date == this.chosenDate) {
          this.totalConfirmed = myData.data[i].confirmed;
          this.todayConfirmed = myData.data[i].new_confirmed;
          this.totalDeaths = myData.data[i].deaths;
          this.todayDeaths = myData.data[i].new_deaths;
          this.totalRecovered = myData.data[i].recovered;
          this.todayRecovered = myData.data[i].recovered;
        }
      }

      this.chartOption = {
        xAxis: {
          type: 'category',
          data: [
            'შემთხვევები \r\n \r\n' + this.totalConfirmed,
            'გარდაცვალებები \r\n \r\n' + this.totalDeaths,
            'გამოჯანმრთელებები \r\n \r\n' + this.totalRecovered,
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [this.totalConfirmed, this.totalDeaths, this.totalRecovered],
            type: 'line',
          },
        ],
      };
    });
  }
}
