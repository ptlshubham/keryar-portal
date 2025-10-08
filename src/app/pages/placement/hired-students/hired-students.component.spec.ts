import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredStudentsComponent } from './hired-students.component';

describe('HiredStudentsComponent', () => {
  let component: HiredStudentsComponent;
  let fixture: ComponentFixture<HiredStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiredStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiredStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
