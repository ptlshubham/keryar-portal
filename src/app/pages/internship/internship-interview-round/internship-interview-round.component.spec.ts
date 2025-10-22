import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipInterviewRoundComponent } from './internship-interview-round.component';

describe('InternshipInterviewRoundComponent', () => {
  let component: InternshipInterviewRoundComponent;
  let fixture: ComponentFixture<InternshipInterviewRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternshipInterviewRoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipInterviewRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
