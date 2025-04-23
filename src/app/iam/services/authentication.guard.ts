import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, take } from 'rxjs';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      console.log('AuthenticationGuard: isSignedIn =', isSignedIn);  // Depuración

      if (isSignedIn) {
        return true;
      } else {
        console.log('Redirecting to /sign-in');  // Depuración
        router.navigate(['/sign-in']);
        return false;
      }
    })
  );
};
