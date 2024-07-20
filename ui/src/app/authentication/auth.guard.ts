import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { first } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const user = await this.authService.currentUser$.pipe(first()).toPromise();
        if (user && (await this.authService.isEmailVerified())) {
            return true;
        } else if (user) {
            this.router.navigate(['/verify-email']);
            return false;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
