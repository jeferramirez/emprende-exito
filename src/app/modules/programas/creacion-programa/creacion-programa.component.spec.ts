import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreacionProgramaComponent } from './creacion-programa.component';

describe('CreacionProgramaComponent', () => {
  let component: CreacionProgramaComponent;
  let fixture: ComponentFixture<CreacionProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreacionProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreacionProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
