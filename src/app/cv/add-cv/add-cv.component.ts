import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { CvService } from "../services/cv.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { APP_ROUTES } from "src/config/routes.config";
import { Cv } from "../model/cv";

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit {
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  form = this.formBuilder.group({
    name: ["", [Validators.required]],
    firstname: ["", [Validators.required]],
    path: [""],
    job: ["", [Validators.required]],
    cin: ["", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
    age: [null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    console.log('AddCvComponent initialisé');
    
    this.age.valueChanges.subscribe(age => {
      console.log('Âge changé:', age);
      this.updatePathFieldState(age);
    });

    this.form.statusChanges.subscribe(status => {
      console.log('Statut du formulaire:', status);
    });
  }

  private updatePathFieldState(age: number | null): void {
    console.log('Mise à jour du champ path pour âge:', age);
    const pathControl = this.path;
    
    if (age !== null && age < 18) {
      console.log('Mineur détecté - désactivation du champ path');
      pathControl?.disable();
      pathControl?.setValue('');
    } else {
      console.log('Majeur détecté - activation du champ path');
      pathControl?.enable();
    }
  }

  addCv() {
  console.log('Bouton addCv cliqué');
  if (this.form.invalid) {
    this.toastr.warning('Veuillez corriger les erreurs dans le formulaire', 'Formulaire invalide');
    return;
  }
  const name = this.name.value;
  const firstname = this.firstname.value;
  this.router.navigate([APP_ROUTES.cv]);
  this.toastr.success(`Le cv ${firstname} ${name} a été ajouté avec succès`);

}

  private generateId(): number {
    // Générer un ID unique (timestamp ou aléatoire)
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Getters pour les contrôles du formulaire
  get name(): AbstractControl {
    return this.form.get("name")!;
  }
  get firstname(): AbstractControl {
    return this.form.get("firstname")!;
  }
  get age(): AbstractControl {
    return this.form.get("age")!;
  }
  get job(): AbstractControl {
    return this.form.get("job")!;
  }
  get path(): AbstractControl {
    return this.form.get("path")!;
  }
  get cin(): AbstractControl {
    return this.form.get("cin")!;
  }

  // Méthode pour vérifier si la personne est mineure
  get isMinor(): boolean {
    const ageValue = this.age.value;
    return ageValue !== null && ageValue < 18;
  }
}