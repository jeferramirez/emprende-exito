import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionLeccionComponent } from './creacion-leccion.component';

describe('CreacionLeccionComponent', () => {
  let component: CreacionLeccionComponent;
  let fixture: ComponentFixture<CreacionLeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionLeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionLeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
