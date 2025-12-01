import { Cv } from '../model/cv';
import { Component, effect } from '@angular/core';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent {
  // 🔹 Signal pour le CV
  cv = toSignal<Cv | null>(
    this.loadCv(),
    { initialValue: null }
  );

  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    // 🔹 Effet de debug
    effect(() => {
      if (this.cv()) {
        console.log('CV chargé:', this.cv());
      }
    });
  }

  // 🔹 Fonction pour récupérer le CV depuis le service (Observable → Signal)
  private loadCv() {
    const id = +this.activatedRoute.snapshot.params['id'];
    return this.cvService.getCvById(id).pipe(
      catchError((err) => {
        this.router.navigate([APP_ROUTES.cv]);
        return of(null);
      })
    );
  }

  // 🔹 Supprimer le CV
async deleteCv(cv: Cv | null) {
  if (!cv) return; // si null, on sort
  try {
    await firstValueFrom(this.cvService.deleteCvById(cv.id));
    this.toastr.success(`${cv.name} supprimé avec succès`);
    this.router.navigate([APP_ROUTES.cv]);
  } catch {
    this.toastr.error('Problème avec le serveur, veuillez contacter l’admin');
  }
}

}
