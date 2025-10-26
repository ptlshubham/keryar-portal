import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerInterviewRoundComponent } from './career-interview-round.component';

describe('CareerInterviewRoundComponent', () => {
  let component: CareerInterviewRoundComponent;
  let fixture: ComponentFixture<CareerInterviewRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareerInterviewRoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerInterviewRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
