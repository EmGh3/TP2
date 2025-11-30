import {Component, OnInit, AfterViewInit, OnDestroy, NgZone} from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css']
})
export class RhComponent implements OnInit, AfterViewInit, OnDestroy {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  constructor(private userService: UsersService, private ngZone: NgZone) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // create chart outside Angular to avoid triggering change detection during heavy chart rendering
    this.createChartOutsideAngular();
  }

  ngOnDestroy(): void {
    try {
      this.chart?.destroy?.();
    } catch (e) {
      // swallow chart destroy errors
    }
  }
  addUser(list: User[], newUser: string) {
    this.userService.addUser(list, newUser);
  }
  createChart(){
    const data = [
      { users: 'Workers', count: this.oddUsers.length },
      { users: 'Boss', count: this.evenUsers.length },
    ];
    this.chart = new ChartJs.Chart("MyChart",
    {
      type: 'bar',
        data: {
          labels: data.map(row => row.users),
        datasets: [
        {
          label: 'Entreprise stats',
          data: data.map(row => row.count)
        }
      ]
    }
    });
  }

  private createChartOutsideAngular(): void {
    try {
      // run the chart creation outside Angular to avoid unnecessary CD cycles
      if (this.ngZone && this.ngZone.runOutsideAngular) {
        this.ngZone.runOutsideAngular(() => this.createChart());
      } else {
        this.createChart();
      }
    } catch (e) {
      console.error('Chart creation failed:', e);
    }
  }
}
