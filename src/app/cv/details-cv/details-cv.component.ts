// src/app/cv/details-cv/details-cv.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent implements OnInit, OnDestroy {
  cv: Cv | null = null;
  private sub: Subscription | null = null;

  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // On s'abonne aux changements des params et on récupère le CV à chaque changement d'id
    this.sub = this.activatedRoute.params
      .pipe(
        switchMap(params => {
          const id = +params['id'];
          return this.cvService.getCvById(id);
        })
      )
      .subscribe({
        next: (cv) => {
          this.cv = cv;
        },
        error: (e) => {
          // si erreur -> revenir à la liste principale
          this.router.navigate([APP_ROUTES.cv]);
        },
      });
  }

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
