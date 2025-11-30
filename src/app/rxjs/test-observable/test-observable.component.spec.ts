import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestObservableComponent } from './test-observable.component';

describe('TestObservableComponent', () => {
  let component: TestObservableComponent;
  let fixture: ComponentFixture<TestObservableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestObservableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestObservableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears interval when unsubscribed (teardown)', (done) => {
    // Subscribe to the observable and unsubscribe after first emission
    const sub = component.firstObservable$.subscribe({
      next: () => {
        sub.unsubscribe();
        // wait a bit to ensure no further emissions occur (teardown cleared interval)
        setTimeout(() => done(), 200);
      },
      error: (err) => done.fail(err)
    });
  });
});
