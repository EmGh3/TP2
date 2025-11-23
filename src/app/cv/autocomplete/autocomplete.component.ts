import { Component, inject, Output, EventEmitter, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, of, Subject, takeUntil } from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);

  @Output() cvSelected = new EventEmitter<Cv>();

  // Déclarer directement le FormControl
  search: FormControl = this.formBuilder.control("");
  
  // État du composant
  suggestions: Cv[] = [];
  showSuggestions = false;
  isLoading = false;
  noResults = false;

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(term => {
          const searchTerm = term || '';
            this.isLoading = true;
            this.showSuggestions = true;
            this.noResults = false;

        }),
        switchMap(term => {
          const searchTerm = term || '';     
          return this.cvService.selectByName(searchTerm).pipe(
            tap(() => this.isLoading = false),
            catchError(error => {
              console.error('Search error:', error);
              this.isLoading = false;
              return this.localSearch(searchTerm);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results: any) => {
          const cvs = Array.isArray(results) ? results : (results || []);
          this.suggestions = cvs;
          this.noResults = cvs.length === 0 && this.search.value;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
          this.suggestions = [];
        }
      });
  }

  private localSearch(term: string) {
  const searchTerm = term.toLowerCase().trim();
  const fakeCvs = this.cvService.getFakeCvs();
  
  // Si le terme de recherche est vide, retourner tous les CVs
  if (!searchTerm) {
    return of(fakeCvs);
  }
  
  const results = fakeCvs.filter(cv => {
    const cvName = cv.name.toLowerCase();
    const cvFirstname = cv.firstname.toLowerCase();
    const cvJob = cv.job.toLowerCase();
    
    // Vérifier dans les deux sens :
    // 1. Le terme de recherche est contenu dans les propriétés du CV
    // 2. Les propriétés du CV sont contenues dans le terme de recherche
    
    return (
      // Recherche directe : terme dans propriétés
      cvName.includes(searchTerm) ||
      cvFirstname.includes(searchTerm) ||
      cvJob.includes(searchTerm) ||
      
      // Recherche inverse : propriétés dans terme
      searchTerm.includes(cvName) ||
      searchTerm.includes(cvFirstname) ||
      searchTerm.includes(cvJob) ||
      
      // Recherche par mots clés individuels
      this.checkPartialMatch(cvName, searchTerm) ||
      this.checkPartialMatch(cvFirstname, searchTerm) ||
      this.checkPartialMatch(cvJob, searchTerm)
    );
  });
  
  return of(results);
}

// Méthode utilitaire pour vérifier les correspondances partielles
private checkPartialMatch(text: string, searchTerm: string): boolean {
  // Diviser le texte et le terme de recherche en mots
  const textWords = text.split(/\s+/);
  const searchWords = searchTerm.split(/\s+/);
  
  // Vérifier si au moins un mot du texte correspond à au moins un mot de recherche
  return textWords.some(textWord => 
    searchWords.some(searchWord => 
      textWord.includes(searchWord) || searchWord.includes(textWord)
    )
  );
}
  onInputFocus(): void {
    if (this.search.value) {
      this.showSuggestions = true;
    }
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectCv(cv: Cv): void {
    this.search.setValue(this.getDisplayName(cv), { emitEvent: false });
    this.cvSelected.emit(cv);
    this.showSuggestions = false;
    this.suggestions = [];
  }

  clearSearch(): void {
    this.search.setValue('');
    this.showSuggestions = false;
    this.suggestions = [];
    this.noResults = false;
  }

  getDisplayName(cv: Cv): string {
    return `${cv.firstname} ${cv.name} - ${cv.job}`;
  }

  trackByCvId(index: number, cv: Cv): number {
    return cv.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}