import { Component, OnDestroy, NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-test-observable",
  templateUrl: "./test-observable.component.html",
  styleUrls: ["./test-observable.component.css"],
})
export class TestObservableComponent {
  firstObservable$: Observable<number>;

  constructor(private toaster: ToastrService, private ngZone: NgZone) {
    // Provide a teardown function and run the interval outside Angular
    this.firstObservable$ = new Observable((observer) => {
      let i = 5;
      const intervalId: any = this.ngZone.runOutsideAngular(() =>
        setInterval(() => {
          if (!i) {
            observer.complete();
            return;
          }
          observer.next(i--);
        }, 1000)
      );

      // Teardown: clear the interval when the subscription is disposed
      return () => clearInterval(intervalId);
    });
  }
}
