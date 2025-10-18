import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallToActionListComponent } from './call-to-action-list.component';

describe('CallToActionListComponent', () => {
  let component: CallToActionListComponent;
  let fixture: ComponentFixture<CallToActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallToActionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallToActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
