import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidStudentListComponent } from './paid-student-list.component';

describe('PaidStudentListComponent', () => {
  let component: PaidStudentListComponent;
  let fixture: ComponentFixture<PaidStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaidStudentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
