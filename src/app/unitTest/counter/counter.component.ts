import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnChanges {
  @Input()
  public startCount = 0;

  public count = 0;

  public ngOnChanges(): void {
    this.count = this.startCount;
  }

  public increment(): void {
    this.count++;
  }

  public decrement(): void {
    this.count--;
  }
}
