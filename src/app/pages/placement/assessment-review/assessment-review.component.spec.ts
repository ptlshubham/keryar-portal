import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentReviewComponent } from './assessment-review.component';

describe('AssessmentReviewComponent', () => {
  let component: AssessmentReviewComponent;
  let fixture: ComponentFixture<AssessmentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
