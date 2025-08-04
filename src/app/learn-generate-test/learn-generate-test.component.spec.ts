import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnGenerateTestComponent } from './learn-generate-test.component';

describe('LearnGenerateTestComponent', () => {
  let component: LearnGenerateTestComponent;
  let fixture: ComponentFixture<LearnGenerateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnGenerateTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnGenerateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
