import { Injectable, signal } from "@angular/core";
import { Cv } from "../model/cv";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API } from "../../../config/api.config";

@Injectable({
  providedIn: "root",
})
export class CvService {

  private cvs: Cv[] = [
    new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "1234", 40),
    new Cv(2, "skander", "sellaouti", "enfant", " ", "1234", 4)
  ];

  //  Signal pour le CV sélectionné (plus besoin de Subject!)
  selectedCv = signal<Cv | null>(null);

  constructor(private http: HttpClient) {}

  /** Données fictives */
  getFakeCvs(): Cv[] {
    return this.cvs;
  }

  /** API calls */
  getCvs(): Observable<Cv[]> {
    return this.http.get<Cv[]>(API.cv);
  }

  getCvById(id: number): Observable<Cv> {
    return this.http.get<Cv>(API.cv + id);
  }

  deleteCvById(id: number): Observable<any> {
    return this.http.delete<any>(API.cv + id);
  }

  addCv(cv: Cv): Observable<Cv> {
    return this.http.post<Cv>(API.cv, cv);
  }

  /** Local find */
  findCvById(id: number): Cv | null {
    return this.cvs.find((cv) => cv.id === id) ?? null;
  }

  deleteCv(cv: Cv): boolean {
    const index = this.cvs.indexOf(cv);
    if (index > -1) {
      this.cvs.splice(index, 1);
      return true;
    }
    return false;
  }

  /** Filtering */
  selectByName(name: string) {
    const search = `{"where":{"name":{"like":"%${name}%"}}}`;
    const params = new HttpParams().set("filter", search);
    return this.http.get<any>(API.cv, { params });
  }

  selectByProperty(property: string, value: string) {
    const search = `{"where":{"${property}":"${value}"}}`;
    const params = new HttpParams().set("filter", search);
    return this.http.get<Cv[]>(API.cv, { params });
  }

  /** 🟦 Mise à jour du CV sélectionné */
  selectCv(cv: Cv) {
    this.selectedCv.set(cv);
  }
}
