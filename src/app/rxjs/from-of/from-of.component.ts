import { Component, OnDestroy } from '@angular/core';
import { from, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-from-of',
  templateUrl: './from-of.component.html',
  styleUrls: ['./from-of.component.css'],
})
export class FromOfComponent implements OnDestroy {
  data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private fromSub: Subscription | null = null;
  private ofSub: Subscription | null = null;

  constructor() {
    // subscribe in constructor but keep references so we can unsubscribe on destroy
    this.fromSub = from(this.data).subscribe((data) => {
      console.log(`from: ${data}`);
    });
    this.ofSub = of(this.data).subscribe((data) => {
      console.log(`of: ${data}`);
    });
  }

  ngOnDestroy(): void {
    this.fromSub?.unsubscribe();
    this.ofSub?.unsubscribe();
  }
}
