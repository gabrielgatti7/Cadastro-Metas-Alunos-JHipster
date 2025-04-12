import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SimuladoDetailComponent } from './simulado-detail.component';

describe('Simulado Management Detail Component', () => {
  let comp: SimuladoDetailComponent;
  let fixture: ComponentFixture<SimuladoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./simulado-detail.component').then(m => m.SimuladoDetailComponent),
              resolve: { simulado: () => of({ id: 22678 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SimuladoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuladoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load simulado on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SimuladoDetailComponent);

      // THEN
      expect(instance.simulado()).toEqual(expect.objectContaining({ id: 22678 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
