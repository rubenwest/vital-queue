import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    // Arrange & Act
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // Assert
    expect(app).toBeTruthy();
  });

  it('should render the router outlet', () => {
    // Arrange & Act
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Assert
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
