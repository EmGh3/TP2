import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function ageCinCorrelationValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ageControl = control.get('age');
    const cinControl = control.get('cin');

    if (!ageControl || !cinControl) {
      return null;
    }

    const age = ageControl.value;
    const cin = cinControl.value;

    // Si l'un des champs est vide, ne pas valider
    if (!age || !cin || cin.length !== 8) {
      return null;
    }

    // Extraire les deux premiers caractères du CIN
    const firstTwoDigits = cin.substring(0, 2);
    const firstTwoNumber = parseInt(firstTwoDigits, 10);

    // Vérifier si c'est un nombre valide
    if (isNaN(firstTwoNumber)) {
      return { cinInvalidFormat: 'Les deux premiers caractères du CIN doivent être numériques' };
    }

    // Règles de validation selon l'âge
    if (age >= 60) {
      // Pour les 60+ ans, les deux premiers chiffres doivent être entre 00 et 19
      if (firstTwoNumber < 0 || firstTwoNumber > 19) {
        return { 
          cinAgeCorrelation: 
            `Pour une personne de ${age} ans, les deux premiers chiffres du CIN doivent être entre 00 et 19 (actuel: ${firstTwoDigits})` 
        };
      }
    } else {
      // Pour les moins de 60 ans, les deux premiers chiffres doivent être >= 20
      if (firstTwoNumber < 20) {
        return { 
          cinAgeCorrelation: 
            `Pour une personne de ${age} ans, les deux premiers chiffres du CIN doivent être supérieurs ou égaux à 20 (actuel: ${firstTwoDigits})` 
        };
      }
    }

    return null;
  };
}