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

  totalConfirmedArray: any = [];
  dateArray: any = [];
  totalDeathsArray: any = [];
  totalRecoveredArray: any = [];

  constructor(private api: HttpService) {}
  chosenDate = new Date().toISOString().slice(0, 10);

  chartOption: EChartsOption = {};

  ngOnInit() {
    (<HTMLInputElement>document.getElementsByClassName('datePicker')[0]).max =
      new Date().toISOString().split('T')[0];
    this.api.getTotalData().subscribe(() => {
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
        this.totalConfirmedArray.unshift(myData.data[i].confirmed);
        this.dateArray.unshift(myData.data[i].date);
        this.totalRecoveredArray.unshift(myData.data[i].recovered);
        this.totalDeathsArray.unshift(myData.data[i].deaths);

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
        title: {
          text: 'მსოფლიო',
          textStyle: {
            color: 'darkBlue',
            textBorderType: 'solid',
            textBorderColor: 'indigo',
            textBorderWidth: 2,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: [
            'ჯამური შემთხვევები',
            'ჯამური გარდაცვალებები',
            'ჯამური გამოჯანმრთელებები',
          ],
          orient: 'vertical',
          padding: 30,
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            dataView: {
              show: true,
              readOnly: true,
              title: 'მონაცემების ნახვა',
              lang: [
                'ჯამური ინფორმაცია შემთხვევების, გარდაცვალებების და გამოჯანმრთელებების შესახებ',
                'გამორთვა',
              ],
            },
            saveAsImage: { title: 'სურათის გადმოწერა' },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateArray,
          axisLabel: {
            color: 'indigo',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'indigo',
            fontSize: 9,
          },
        },
        series: [
          {
            name: 'ჯამური შემთხვევები',
            type: 'line',
            data: this.totalConfirmedArray,
            smooth: true,
            color: 'orange',
          },
          {
            name: 'ჯამური გარდაცვალებები',
            type: 'line',

            data: this.totalDeathsArray,
            smooth: true,
            color: 'red',
          },
          {
            name: 'ჯამური გამოჯანმრთელებები',
            type: 'line',

            data: this.totalRecoveredArray,
            smooth: true,
            color: 'blue',
          },
        ],
      };
    });
    this.totalConfirmedArray = [];
    this.dateArray = [];
    this.totalDeathsArray = [];
    this.totalRecoveredArray = [];
  }
}
