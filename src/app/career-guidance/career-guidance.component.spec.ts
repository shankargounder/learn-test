import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerGuidanceComponent } from './career-guidance.component';

describe('CareerGuidanceComponent', () => {
  let component: CareerGuidanceComponent;
  let fixture: ComponentFixture<CareerGuidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerGuidanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
