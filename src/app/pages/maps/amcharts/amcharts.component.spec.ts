import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmchartsComponent } from './amcharts.component';

describe('AmchartsComponent', () => {
  let component: AmchartsComponent;
  let fixture: ComponentFixture<AmchartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmchartsComponent]
    });
    fixture = TestBed.createComponent(AmchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
