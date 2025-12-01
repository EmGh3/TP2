import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent implements OnInit {
  cv: Cv | null = null;
  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.params['id'];
    try {
      this.cv = await firstValueFrom(this.cvService.getCvById(+id));
    } catch (e) {
      this.router.navigate([APP_ROUTES.cv]);
    }
  }

  async deleteCv(cv: Cv): Promise<void> {
    try {
      await firstValueFrom(this.cvService.deleteCvById(cv.id));
      this.toastr.success(`${cv.name} supprimé avec succès`);
      this.router.navigate([APP_ROUTES.cv]);
    } catch (e) {
      this.toastr.error(`Problème avec le serveur veuillez contacter l'admin`);
    }
  }
}
