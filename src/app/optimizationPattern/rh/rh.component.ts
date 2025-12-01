import {Component, OnInit,  ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import {User, UsersService} from "../users.service";
import * as ChartJs from 'chart.js/auto';
@Component({
  selector: 'app-rh',
  templateUrl: './rh.component.html',
  styleUrls: ['./rh.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Ajout de OnPush
})
export class RhComponent implements OnInit {
  oddUsers: User[];
  evenUsers: User[];
  chart: any;
  constructor(private userService: UsersService,private cdRef: ChangeDetectorRef ) {
    this.oddUsers = this.userService.getOddOrEven(true);
    this.evenUsers = this.userService.getOddOrEven();
    //  Nouveau
  }

  ngOnInit(): void {
        this.createChart();
    }
  addUser(list: User[], newUser: string) {
    //this.userService.addUser(list, newUser);
      //  Modification directe du tableau → même référence
  //  OnPush ne détecte PAS le changement
  const result = this.userService.addUser(list, newUser); // ✅ Nouveau tableau
  
  if (list === this.oddUsers) {
    this.oddUsers = result; //  Nouvelle référence
  } else {
    this.evenUsers = result; //  Nouvelle référence
  }
 this.updateChart();
  }
private updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.evenUsers.length, this.oddUsers.length];
      this.chart.update();
    }
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
}
