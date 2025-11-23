import { Component, OnInit, OnDestroy } from "@angular/core";
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

// Clé pour le localStorage
const DRAFT_KEY = 'cv_form_draft';

@Component({
  selector: "app-add-cv",
  templateUrl: "./add-cv.component.html",
  styleUrls: ["./add-cv.component.css"],
})
export class AddCvComponent implements OnInit, OnDestroy {
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

  // Timer pour la sauvegarde automatique
  private autoSaveTimer: any;

  ngOnInit() {
    console.log('AddCvComponent initialisé');
    
    // Charger les données sauvegardées
    this.loadDraft();
    
    // Surveiller les changements d'âge
    this.age.valueChanges.subscribe(age => {
      console.log('Âge changé:', age);
      this.updatePathFieldState(age);
    });

    // Sauvegarde automatique à chaque changement
    this.form.valueChanges.subscribe(() => {
      this.autoSave();
    });

    // Sauvegarder aussi quand l'utilisateur quitte la page
    window.addEventListener('beforeunload', this.saveDraft.bind(this));
  }

  ngOnDestroy() {
    // Nettoyer le timer et l'event listener
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
    window.removeEventListener('beforeunload', this.saveDraft.bind(this));
  }

  private autoSave(): void {
    // Délai pour éviter de sauvegarder à chaque frappe
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setTimeout(() => {
      this.saveDraft();
    }, 1000); // Sauvegarde après 1 seconde d'inactivité
  }

  private saveDraft(): void {
    if (this.form.dirty && this.form.valid) {
      const draftData = {
        ...this.form.value,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      console.log('Brouillon sauvegardé:', draftData);
    }
  }

  private loadDraft(): void {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const draftData = JSON.parse(draft);
        console.log('Brouillon chargé:', draftData);
        
        // Restaurer les valeurs du formulaire
        this.form.patchValue({
          name: draftData.name || '',
          firstname: draftData.firstname || '',
          path: draftData.path || '',
          job: draftData.job || '',
          cin: draftData.cin || '',
          age: draftData.age || null
        });

        this.updatePathFieldState(draftData.age);
        // Marquer le formulaire comme "dirty" pour refléter l'état restauré
        this.form.markAsDirty();

        this.toastr.info(
          `Un brouillon a été restauré (sauvegardé le ${new Date(draftData.savedAt).toLocaleString()})`,
          'Brouillon restauré',
          { timeOut: 5000 }
        );
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error);
    }
  }

  private clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
    console.log('Brouillon supprimé');
  }

  private updatePathFieldState(age: number | null): void {
    const pathControl = this.path;
    
    if (age !== null && age < 18) {
      pathControl?.disable();
      pathControl?.setValue('');
    } else {
      pathControl?.enable();
    }
  }

  addCv() {
    console.log('Bouton addCv cliqué');

    this.markAllFieldsAsTouched();

    if (this.form.invalid) {
      this.toastr.warning('Veuillez corriger les erreurs dans le formulaire', 'Formulaire invalide');
      return;
    }

    const formData = { ...this.form.value };
    
    // Pour les mineurs, s'assurer que path est vide
    if (formData.age && formData.age < 18) {
      formData.path = '';
    }

    // Créer un objet Cv complet avec ID généré
    const cvData: Cv = {
      id: this.generateId(),
      name: formData.name || '',
      firstname: formData.firstname || '',
      job: formData.job || '',
      path: formData.path || '',
      cin: formData.cin || '',
      age: formData.age || 0
    };

    console.log('Données préparées:', cvData);

    this.toastr.success(`Le cv ${cvData.firstname} ${cvData.name} a été ajouté avec succès`);
    
    // Supprimer le brouillon après soumission réussie
    this.clearDraft();
    
    // Réinitialiser le formulaire
    this.form.reset();
    this.form.markAsPristine();
    this.router.navigate([APP_ROUTES.cv]);
  }

  // Méthode pour effacer manuellement le brouillon
  clearForm(): void {
    if (confirm('Voulez-vous vraiment effacer le formulaire en cours ?')) {
      this.form.reset();
      this.clearDraft();
      this.toastr.info('Formulaire effacé', 'Succès');
    }
  }

  // Vérifier s'il y a un brouillon sauvegardé
  get hasDraft(): boolean {
    return localStorage.getItem(DRAFT_KEY) !== null;
  }

  private generateId(): number {
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

  get isMinor(): boolean {
    const ageValue = this.age.value;
    return ageValue !== null && ageValue < 18;
  }
}