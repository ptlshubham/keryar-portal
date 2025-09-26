import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LoginComponent],
    imports: [],
    providers: [
        AuthfakeauthenticationService,
        {
            provide: ActivatedRoute,
            useValue: {
                snapshot: {
                    paramMap: convertToParamMap({}),
                    queryParamMap: convertToParamMap({ returnUrl: '/' }), // provide a default returnUrl in query params
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
