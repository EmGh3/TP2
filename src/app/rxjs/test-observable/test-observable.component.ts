import { Component, OnDestroy } from "@angular/core";
import { Observable, Subscription, filter, map } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-test-observable",
  templateUrl: "./test-observable.component.html",
  styleUrls: ["./test-observable.component.css"],
})
export class TestObservableComponent {
  firstObservable$: Observable<number>;

  constructor(private toaster: ToastrService) {
    // Provide a teardown function so the interval is cleared when the observable
    // completes or the subscription is unsubscribed.
    this.firstObservable$ = new Observable((observer) => {
      let i = 5;
      const id = setInterval(() => {
        if (!i) {
          observer.complete();
        } else {
          observer.next(i--);
        }
      }, 1000);

      // Teardown: clear the interval when the subscription is disposed
      return () => clearInterval(id);
    });
  }
}
