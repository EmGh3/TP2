import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authenticated = false;
  // no constructor needed
  isAuthentified(): boolean {
    this.authenticated = !!localStorage.getItem('user');
    return this.authenticated;
  }
}
