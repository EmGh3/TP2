import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CredentialsDto } from '../dto/credentials.dto';
import { ROUTES, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  async login(credentials: CredentialsDto) {
    try {
      const response = await firstValueFrom(this.authService.login(credentials));
      localStorage.setItem('token', response.id);
      this.toastr.success(`Bienvenu chez vous :)`);
      this.router.navigate([APP_ROUTES.cv]);
    } catch (error) {
      this.toastr.error('Veuillez vérifier vos credentials');
    }
  }
}
