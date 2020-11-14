import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProgramaComponent } from './update-programa.component';

describe('UpdateProgramaComponent', () => {
  let component: UpdateProgramaComponent;
  let fixture: ComponentFixture<UpdateProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
