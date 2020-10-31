import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionActividadComponent } from './creacion-actividad.component';

describe('CreacionActividadComponent', () => {
  let component: CreacionActividadComponent;
  let fixture: ComponentFixture<CreacionActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionActividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
