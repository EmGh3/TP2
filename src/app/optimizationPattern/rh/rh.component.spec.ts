import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RhComponent } from './rh.component';
import * as ChartJs from 'chart.js/auto';
import { NgZone } from '@angular/core';

describe('RhComponent', () => {
  let component: RhComponent;
  let fixture: ComponentFixture<RhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RhComponent ]
    })
    .compileComponents();
    // spy on ChartJs.Chart constructor to avoid creating real charts in tests
    spyOn(ChartJs as any, 'Chart').and.callFake(() => ({ destroy: () => {} }));

    fixture = TestBed.createComponent(RhComponent);
    component = fixture.componentInstance;
    // provide a real NgZone
    TestBed.inject(NgZone);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates and destroys chart', () => {
    // Chart constructor should have been called during AfterViewInit
    expect((ChartJs as any).Chart).toHaveBeenCalled();
    // ensure destroy doesn't throw
    component.ngOnDestroy();
    expect((ChartJs as any).Chart).toHaveBeenCalled();
  });
});
