import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLeccionComponent } from './update-leccion.component';

describe('UpdateLeccionComponent', () => {
  let component: UpdateLeccionComponent;
  let fixture: ComponentFixture<UpdateLeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
