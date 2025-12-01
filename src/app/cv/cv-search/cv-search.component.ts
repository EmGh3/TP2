import { Component, inject, signal } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

@Component({
  selector: 'app-cv-search',
  templateUrl: './cv-search.component.html',
  styleUrls: ['./cv-search.component.css']
})
export class CvSearchComponent {
  private cvService = inject(CvService);

  selectedCV = signal<Cv | null>(null);

  onCvSelected(cv: Cv): void {
    this.selectedCV.set(cv);
    // Optionnel : utiliser le service pour notifier d'autres composants
    this.cvService.selectCv(cv);
  }

  clearSelection(): void {
    this.selectedCV.set(null);
  }
}