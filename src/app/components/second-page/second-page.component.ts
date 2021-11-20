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
  show = 'ბოლო სამი თვის ჩვენება';
  lineChartTitle = 'სრული პერიოდის ჯამური მონაცემები';
  lineChartTitle2 = 'სრული პერიოდის ყოველდღიური მონაცემები';
  x: any;

  totalConfirmedArray: any = [];
  totalDeathsArray: any = [];
  totalRecoveredArray: any = [];
  dateArray: any = [];
  chosenPeriod: any;
  todayConfirmedArray: any = [];
  todayDeathsArray: any = [];
  todayRecoveredArray: any = [];

  constructor(private api: HttpService) {}

  chosenDate = new Date().toISOString().slice(0, 10);
  chartOption: EChartsOption = {};
  chartOption1: EChartsOption = {};

  ngOnInit() {
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
      if (this.check == 0) {
        this.show = 'ბოლო სამი თვის ჩვენება';
        this.lineChartTitle = 'სრული პერიოდის ჯამური მონაცემები';
        this.lineChartTitle2 = 'სრული პერიოდის ყოველდღიური მონაცემები';
        this.chosenPeriod = this.newData.data?.['timeline'].length;
      } else if (this.check == 1) {
        this.lineChartTitle = 'ბოლო სამი თვის ჯამური მონაცემები';
        this.show = 'სრული პერიოდის ჩვენება';
        this.lineChartTitle2 = 'ბოლო სამი თვის ყოველდღიური მონაცემები';
        this.chosenPeriod = 90;
      }

      for (var i = 0; i < this.chosenPeriod; i++) {
        this.dateArray.unshift(this.newData.data['timeline']?.[i].date);
        this.totalConfirmedArray.unshift(
          this.newData.data['timeline'][i]?.['confirmed']
        );
        this.totalDeathsArray.unshift(
          this.newData.data['timeline'][i]?.['deaths']
        );
        this.totalRecoveredArray.unshift(
          this.newData.data['timeline'][i]?.['recovered']
        );
        this.todayConfirmedArray.unshift(
          this.newData.data['timeline'][i]?.['new_confirmed']
        );
        this.todayDeathsArray.unshift(
          this.newData.data['timeline'][i]?.['new_deaths']
        );
        this.todayRecoveredArray.unshift(
          this.newData.data['timeline'][i]?.['new_recovered']
        );
        if (this.newData.data['timeline'][i]?.['date'] == this.chosenDate) {
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
        title: {
          text: (<HTMLSelectElement>document.getElementById('chooseCountry'))
            .value,
          textStyle: {
            color: 'darkBlue',
            textBorderType: 'solid',
            textBorderColor: 'indigo',
            textBorderWidth: 2,
            fontSize: 10,
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
              lang: [this.lineChartTitle, 'გამორთვა'],
            },
            saveAsImage: { title: 'სურათის გადმოწერა' },
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateArray,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'ჯამური შემთხვევები',
            type: 'line',
            smooth: true,
            data: this.totalConfirmedArray,
            color: 'orange',
          },
          {
            name: 'ჯამური გარდაცვალებები',
            type: 'line',
            smooth: true,
            data: this.totalDeathsArray,
            color: 'red',
          },

          {
            name: 'ჯამური გამოჯანმრთელებები',
            type: 'line',
            smooth: true,
            data: this.totalRecoveredArray,
            color: 'blue',
          },
        ],
      };

      this.chartOption1 = {
        title: {
          text: (<HTMLSelectElement>document.getElementById('chooseCountry'))
            .value,
          textStyle: {
            color: 'darkBlue',
            textBorderType: 'solid',
            textBorderColor: 'indigo',
            textBorderWidth: 2,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: true,
              title: 'მონაცემების ნახვა',
              lang: [this.lineChartTitle2, 'გამორთვა'],
            },

            saveAsImage: { show: true, title: 'სურათის გადმოწერა' },
          },
        },
        calculable: true,
        legend: {
          data: [
            'მიმდინარე დღის შემთხვევები',
            'მიმდინარე დღის გარდაცვალებები',
            'მიმდინარე დღის გამოჯანმრთელებები',
          ],
          itemGap: 5,
        },
        grid: {
          top: '12%',
          left: '1%',
          right: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.dateArray,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],

        series: [
          {
            name: 'მიმდინარე დღის შემთხვევები',
            type: 'bar',
            data: this.todayConfirmedArray,
            color: 'orange',
          },
          {
            name: 'მიმდინარე დღის გარდაცვალებები',
            type: 'bar',
            data: this.todayDeathsArray,
            color: 'red',
          },
          {
            name: 'მიმდინარე დღის გამოჯანმრთელებები',
            type: 'bar',
            data: this.todayRecoveredArray,
            color: 'blue',
          },
        ],
      };
    });

    this.todayConfirmedArray = [];
    this.todayDeathsArray = [];
    this.todayRecoveredArray = [];
    this.totalConfirmedArray = [];
    this.totalDeathsArray = [];
    this.totalRecoveredArray = [];
    this.dateArray = [];
  }

  toggleThreeMonth() {
    if (this.check == 0) {
      this.check = 1;
    } else if (this.check == 1) {
      this.check = 0;
    }
    this.onChange();
  }
}
