import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TopbarComponent],
    imports: [],
    providers: [AuthfakeauthenticationService, AuthenticationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
