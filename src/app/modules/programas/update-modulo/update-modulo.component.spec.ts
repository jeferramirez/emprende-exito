import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateModuloComponent } from './update-modulo.component';

describe('UpdateModuloComponent', () => {
  let component: UpdateModuloComponent;
  let fixture: ComponentFixture<UpdateModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
