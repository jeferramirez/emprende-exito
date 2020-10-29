import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProgramasComponent } from './gestion-programas.component';

describe('GestionProgramasComponent', () => {
  let component: GestionProgramasComponent;
  let fixture: ComponentFixture<GestionProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionProgramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
