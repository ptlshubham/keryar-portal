import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeStudentListComponent } from './free-student-list.component';

describe('FreeStudentListComponent', () => {
  let component: FreeStudentListComponent;
  let fixture: ComponentFixture<FreeStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreeStudentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
