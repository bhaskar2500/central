import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyResetComponent } from './occupancy-reset.component';

describe('OccupancyResetComponent', () => {
  let component: OccupancyResetComponent;
  let fixture: ComponentFixture<OccupancyResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupancyResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupancyResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
