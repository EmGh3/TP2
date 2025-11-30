import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AddCvComponent } from './add-cv.component';
import { Renderer2 } from '@angular/core';

describe('AddCvComponent', () => {
  let component: AddCvComponent;
  let fixture: ComponentFixture<AddCvComponent>;
  let renderer: Renderer2;
  let unlistenSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ AddCvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCvComponent);
    component = fixture.componentInstance;

    renderer = TestBed.inject(Renderer2);
    unlistenSpy = jasmine.createSpy('unlisten');
    spyOn(renderer as any, 'listen').and.returnValue(unlistenSpy);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('removes beforeunload listener and clears autosave subscription on destroy', () => {
    // Ensure renderer.listen has been called and returned our unlistenSpy
    // trigger autoSave to schedule a timer subscription
    component['autoSave']();

    expect(component['autoSaveSub']).toBeTruthy();

    component.ngOnDestroy();

    // if Renderer2.listen was spied, it should have been unlistened
    expect(unlistenSpy).toHaveBeenCalled();
    // autoSaveSub should be cleaned up
    expect(component['autoSaveSub']).toBeNull();
  });
});
