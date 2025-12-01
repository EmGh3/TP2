import { Component, computed, effect } from "@angular/core";
import { CvService } from "../services/cv.service";
import { ToastrService } from "ngx-toastr";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, of } from "rxjs";

@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent {
  date = new Date();

  selectedCv = this.cvService.selectedCv;

  cvs = toSignal(
    this.cvService.getCvs().pipe(
      catchError(() => {
        this.toastr.error(`
          Attention!! Les données sont fictives, problème serveur.
        `);
        return of(this.cvService.getFakeCvs());
      })
    ),
    { initialValue: [] }
  );

  // --- Lazy loading Embauche ---
  showEmbauche = false;
  embaucheComponent: any = null;

  constructor(
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    effect(() => {
      console.log("CV sélectionné :", this.selectedCv());
    });

    // 🎬 Différer automatiquement le chargement
    setTimeout(() => {
      this.loadEmbauche();
    }, 2000); // affichage après 2 sec
  }

  async loadEmbauche() {
    const module = await import("../embauche/embauche.component");
    this.embaucheComponent = module.EmbaucheComponent;
    this.showEmbauche = true;
  }
}
