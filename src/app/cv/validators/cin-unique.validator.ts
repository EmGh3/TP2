import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { CvService } from '../services/cv.service';

export function cinUniqueValidator(cvService: CvService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cin = control.value;
    
    // Si le champ est vide ou invalide, ne pas valider
    if (!cin || cin.length !== 8) {
      return of(null);
    }

    // Utiliser getCvs() pour récupérer tous les CVs
    return cvService.getCvs().pipe(
      map(cvs => {
        
        // CORRECTION: Comparer en tant que chaînes
        const cinExists = cvs.some(cv => {
          // Convertir les deux en chaînes pour la comparaison
          const existingCin = cv.cin.toString();
          const newCin = cin.toString();
          const isMatch = existingCin === newCin;
          return isMatch;
        });

        
        if (cinExists) {
          return { cinNotUnique: `Le CIN ${cin} existe déjà dans la base de données` };
        }
        return null;
      }),
      catchError((error) => {
        console.error('Erreur lors de la vérification du CIN:', error);
        return of(null);
      })
    );
  };
}