import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingComponent } from './pricing.component';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';

describe('PricingComponent', () => {
  let component: PricingComponent;
  let fixture: ComponentFixture<PricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PricingComponent],
      imports: [NgbNav], 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
