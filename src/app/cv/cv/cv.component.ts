import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cv } from "../model/cv";
import { LoggerService } from "../../services/logger.service";
import { ToastrService } from "ngx-toastr";
import { CvService } from "../services/cv.service";
@Component({
  selector: "app-cv",
  templateUrl: "./cv.component.html",
  styleUrls: ["./cv.component.css"],
})
export class CvComponent implements OnInit, OnDestroy {
  cvs: Cv[] = [];
  selectedCv: Cv | null = null;
  /*   selectedCv: Cv | null = null; */
  date = new Date();

  constructor(
    private logger: LoggerService,
    private toastr: ToastrService,
    private cvService: CvService
  ) {
    this.logger.logger("je suis le cvComponent");
    this.toastr.info("Bienvenu dans notre CvTech");
    this.cvService.selectCv$.pipe(takeUntil(this.destroy$)).subscribe((cv) => (this.selectedCv = cv));
  }

  async ngOnInit(): Promise<void> {
    try {
      this.cvs = await firstValueFrom(this.cvService.getCvs());
    } catch (error) {
      this.cvs = this.cvService.getFakeCvs();
      this.toastr.error(
        `Attention!! Les données sont fictives, problème avec le serveur. Veuillez contacter l'admin.`
      );
    }
  }

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
