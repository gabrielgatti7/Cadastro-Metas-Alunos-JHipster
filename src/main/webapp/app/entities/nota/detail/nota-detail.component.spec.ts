import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { NotaDetailComponent } from './nota-detail.component';

describe('Nota Management Detail Component', () => {
  let comp: NotaDetailComponent;
  let fixture: ComponentFixture<NotaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./nota-detail.component').then(m => m.NotaDetailComponent),
              resolve: { nota: () => of({ id: 21411 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(NotaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load nota on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', NotaDetailComponent);

      // THEN
      expect(instance.nota()).toEqual(expect.objectContaining({ id: 21411 }));
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
