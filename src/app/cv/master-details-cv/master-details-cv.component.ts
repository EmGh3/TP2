import { Component, OnInit } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  styleUrls: ['./master-details-cv.component.css']
})
export class MasterDetailsCvComponent implements OnInit {
  cvs: Cv[] = [];

  constructor(private cvService: CvService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.cvService.getCvs().subscribe({
      next: (cvs) => this.cvs = cvs,
      error: () => {
        this.cvs = this.cvService.getFakeCvs();
        this.toastr.error('Données fictives (problème serveur)');
      }
    });
  }
}
