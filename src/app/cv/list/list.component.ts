import { Component, Input } from "@angular/core";
import { Cv } from "../model/cv";
import { Router } from '@angular/router';

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent {
  @Input() cvs: Cv[] | null = [];

  constructor(private router: Router) {}

  goToDetails(cv: Cv | null) {
    if (!cv) { return; }
    // Navigue vers /cv/:id 
    this.router.navigate(['cv', cv.id]);
  }
}
