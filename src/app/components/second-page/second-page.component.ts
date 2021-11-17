import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-second-page',
  templateUrl: './second-page.component.html',
  styleUrls: ['./second-page.component.css'],
})
export class SecondPageComponent implements OnInit {
  countryIndex = '0';
  population = 0;
  lastUpdate: any;
  deathPercent = 0;
  recoverPercent = 0;
  casesPerMilion = 0;
  totalConfirmed1 = 0;
  confirmedForDate = 0;
  totalDeath1 = 0;
  newDeath = 0;
  totalRecovered0 = 0;
  recoveredForDate = 0;
  index = 0;
  code: any = 'AF';
  totalConfirmedByDate = 0;
  totalRecoveredByDate = 0;
  totalDeathByDate = 0;
  check = 0;
  newData: any;
  show = 'სამი თვე';
  lineChartTitle = 'სრული პერიოდის ჯამური მონაცემები';
  x: any;

  constructor(private api: HttpService) {}

  chosenDate = new Date().toISOString().slice(0, 10);
  chartOption: EChartsOption = {
    xAxis: {
      type: 'category',
      data: [
        'შემთხვევები \r\n \r\n' + this.totalConfirmed1,
        'გარდაცვალებები \r\n \r\n' + this.totalDeath1,
        'გამოჯანმრთელებები \r\n \r\n' + this.totalRecovered0,
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [this.totalConfirmed1, this.totalDeath1, this.totalRecovered0],
        type: 'line',
      },
    ],
  };

  chartOption1: EChartsOption = {
    xAxis: {
      type: 'category',
      data: [
        'დღის შემთხვევები' + this.confirmedForDate,
        'დღის გარდაცვალებები' + this.newDeath,
        'დღის გამოჯანმრთელებები' + this.recoveredForDate,
      ],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [this.confirmedForDate, this.newDeath, this.recoveredForDate],
        type: 'bar',
      },
    ],
  };

  ngOnInit() {
    (<HTMLInputElement>document.getElementsByClassName('datePicker')[0]).max =
      new Date().toISOString().split('T')[0];
    this.api.getCountryData('').subscribe((data) => {
      var myData = JSON.parse(JSON.stringify(data));
      for (var i = 0; i < myData.data.length; i++) {
        (<HTMLSelectElement>(
          document.getElementById('chooseCountry')
        )).innerHTML +=
          "<option class='optionClass0'" +
          'code=' +
          myData.data[i]['code'] +
          '>' +
          myData.data[i]['name'] +
          '</option>';
      }
      this.onChange();
    });
  }

  onChange() {
    this.chosenDate = (<HTMLInputElement>(
      document.getElementsByClassName('datePicker')[0]
    )).value;
    this.index = (<HTMLSelectElement>(
      document.getElementById('chooseCountry')
    )).selectedIndex;
    this.code = (<HTMLSelectElement>(
      document.getElementsByClassName('optionClass0')[this.index]
    )).getAttribute('code');
    this.api.getCountryData('/' + this.code).subscribe((data) => {
      this.newData = JSON.parse(JSON.stringify(data));
      this.population = this.newData.data?.['population'];
      this.lastUpdate = this.newData.data?.['updated_at'].slice(0, 10);
      this.deathPercent =
        Math.round(
          this.newData.data?.['latest_data']['calculated']['death_rate'] * 100
        ) / 100;
      this.recoverPercent =
        Math.round(
          this.newData.data?.['latest_data']['calculated']['recovery_rate'] *
            100
        ) / 100;
      this.casesPerMilion =
        this.newData.data?.['latest_data']['calculated'][
          'cases_per_million_population'
        ];
      for (var i = 0; i < this.newData.data['timeline'].length; i++) {
        if (this.newData.data['timeline'][i]['date'] == this.chosenDate) {
          var countryByDate = this.newData.data['timeline'][i];
        }
      }
      this.totalConfirmed1 = this.newData.data?.['latest_data']['confirmed'];
      this.confirmedForDate = countryByDate?.['new_confirmed'];
      this.totalConfirmedByDate = countryByDate?.['confirmed'];
      this.totalDeath1 = this.newData.data?.['latest_data']['deaths'];
      this.newDeath = countryByDate?.['new_deaths'];
      this.totalDeathByDate = countryByDate?.['deaths'];
      this.totalRecovered0 = this.newData.data?.['latest_data']['recovered'];
      this.recoveredForDate = countryByDate?.['new_recovered'];
      this.totalRecoveredByDate = countryByDate?.['recovered'];

      this.chartOption = {
        xAxis: {
          type: 'category',
          data: [
            'შემთხვევები \r\n \r\n' + this.totalConfirmedByDate,
            'გარდაცვალებები \r\n \r\n' + this.totalDeathByDate,
            'გამოჯანმრთელებები \r\n \r\n' + this.totalRecoveredByDate,
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [
              this.totalConfirmedByDate,
              this.totalDeathByDate,
              this.totalRecoveredByDate,
            ],
            type: 'line',
          },
        ],
      };
      this.chartOption1 = {
        xAxis: {
          type: 'category',
          data: [
            'დღის შემთხვევები \r\n \r\n' + this.confirmedForDate,
            'დღის გარდაცვალებები \r\n \r\n' + this.newDeath,
            'დღის გამოჯანმრთელებები \r\n \r\n' + this.recoveredForDate,
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [this.confirmedForDate, this.newDeath, this.recoveredForDate],
            type: 'bar',
          },
        ],
      };
    });
    this.show = 'სამი თვის ჩვენება';
    this.lineChartTitle = 'სრული პერიოდის ჯამური მონაცემები მოცემულ თარიღამდე';
    this.check = 0;
  }

  changeDate() {
    this.onChange();
  }
  toggleThreeMonth() {
    if (this.check == 0) {
      this.check = 1;
      this.totalConfirmedByDate = 0;
      this.totalDeathByDate = 0;
      this.totalRecoveredByDate = 0;

      for (var i = 0; i < 90; i++) {
        this.totalConfirmedByDate +=
          this.newData.data['timeline'][i]['new_confirmed'];
        this.totalDeathByDate += this.newData.data['timeline'][i]['new_deaths'];
        this.totalRecoveredByDate +=
          this.newData.data['timeline'][i]['new_recovered'];
      }
      this.chartOption = {
        xAxis: {
          type: 'category',
          data: [
            'შემთხვევები \r\n \r\n' + this.totalConfirmedByDate,
            'გარდაცვალებები \r\n \r\n' + this.totalDeathByDate,
            'გამოჯანმრთელებები \r\n \r\n' + this.totalRecoveredByDate,
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [
              this.totalConfirmedByDate,
              this.totalDeathByDate,
              this.totalRecoveredByDate,
            ],
            type: 'line',
          },
        ],
      };
      this.show = 'სრული პერიოდი';
      this.lineChartTitle = 'ბოლო სამი თვის მონაცემები';
    } else if (this.check == 1) {
      this.check = 0;
      this.onChange();
      this.show = 'სამი თვის ჩვენება';
      this.lineChartTitle =
        'სრული პერიოდის ჯამური მონაცემები მოცემულ თარიღამდე';
    }
  }
}
