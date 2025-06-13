import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenuModule } from 'headlessui-angular';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HttpClient } from '@angular/common/http';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexLegend
} from 'ng-apexcharts';
import { baseURL } from '../../../environments/dev_baseURL';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  labels?: any;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];
  title?: ApexTitleSubtitle;
  colors?: any[];
  stroke?: ApexStroke;
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
};

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [IconModule, MenuModule, NgApexchartsModule, NgScrollbarModule,CommonModule,FormsModule, NgSelectModule],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
  private apiUrl = baseURL.apiUrl;
  userOptions: { label: string; value: number }[] = [];
  topReceivers: any[] = [];
  topSenders: any[] = [];
  fileUploadStats: any[] = [];
  selectedUserId: number | null = null;
  donutChart: any;
  mostActiveFilesChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'bar' },
    xaxis: { categories: [] },
    title: { text: '' }
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/Admin/dashboard-stats`).subscribe(data => {
      this.userOptions = data.userLoginTimes.map((u: any) => ({
        label: u.email,
        value: u.userId,
      }));
         this.topReceivers = data.topReceivers;
        this.topSenders = data.topSenders;
        this.fileUploadStats = data.fileUploadStats;
      this.initCharts(data);
    });
  }
onUserSelect(userId: any) {
    if (!userId) return;
    console.log('Selected User ID:', userId);

    this.http
      .get<any>(`${this.apiUrl}/Admin/user-file-type-counts?userId=${userId.value}`)
      .subscribe(data => {
        this.updateDonutChart(data);
      });
  }

  updateDonutChart(data: any) {
    const isDark = false; 

    this.donutChart = {
      series: [data.documents, data.excel, data.powerPoint],
      chart: {
        height: 300,
        type: 'donut',
        zoom: { enabled: false },
        toolbar: { show: false }
      },
      labels: ['Documents', 'Excel', 'PowerPoint'],
      colors: ['#5c6bc0', '#42a5f5', '#66bb6a'],
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      legend: {
        position: 'bottom',
        labels: { colors: isDark ? '#fff' : '#000' }
      }
    };
  }

  initCharts(data: any) {
  
    // Most Active Files
    this.mostActiveFilesChartOptions = {
  series: [{
    name: 'Shares',
    data: data.mostActiveFiles.map((f: any) => f.shareCount)
  }],
  chart: {
    type: 'bar',
    height: 300,
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  colors: [ '#e7515a' , '#f6b26b', '#f9cb9c', '#ffe599', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 1,
    colors: ['transparent']
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: false,
      columnWidth: '35%'
    }
  },
  grid: {
    borderColor:'#e0e6ed'
  },
  xaxis: {
    categories: data.mostActiveFiles.map((f: any) => f.fileName),
    axisBorder: {
      color: '#e0e6ed'
    }
  },
  yaxis: {
    labels: {
      offsetX:  0
    }
  },
  tooltip: {
    theme: 'light',
    y: {
      formatter: (val: any) => val
    }
  },
  title: { text: 'Most Shared Files' }
    };
  }
}
