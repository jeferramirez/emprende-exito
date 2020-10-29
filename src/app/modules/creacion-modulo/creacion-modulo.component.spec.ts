import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionModuloComponent } from './creacion-modulo.component';

describe('CreacionModuloComponent', () => {
  let component: CreacionModuloComponent;
  let fixture: ComponentFixture<CreacionModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
