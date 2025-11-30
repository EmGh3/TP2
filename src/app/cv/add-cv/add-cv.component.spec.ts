import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddCvComponent } from './add-cv.component';

describe('AddCvComponent', () => {
  let component: AddCvComponent;
  let fixture: ComponentFixture<AddCvComponent>;
  let removeSpy: jasmine.Spy;
  let clearSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ AddCvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCvComponent);
    component = fixture.componentInstance;

    removeSpy = spyOn(window, 'removeEventListener');
    clearSpy = spyOn(window, 'clearTimeout');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removes beforeunload listener and clears autosave timer on destroy', () => {
    // trigger autoSave to schedule a timeout
    component['autoSave']();

    component.ngOnDestroy();

    expect(removeSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });
});
