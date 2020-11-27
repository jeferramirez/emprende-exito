import { GeneralService } from './../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgramsService } from './../../../services/programs.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-creacion-programa',
  templateUrl: './creacion-programa.component.html',
  styleUrls: ['./creacion-programa.component.css'],
})
export class CreacionProgramaComponent implements OnInit {
  programForm: FormGroup;
  idProgram = null;
  file: any;
  previewimage: any;
  indButton = true;

  constructor(
    private programSrv: ProgramsService,
    private fb: FormBuilder,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.createProgramForm();
  }

  createProgramForm(): void {
    this.programForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z áéíóú ÁÉÍÓÚ ñÑ]*$')]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
    });
  }

  createProgram(): void {
    const program = this.programForm.value;
    program.estado = true;
    this.programSrv
      .createProgram(program)
      .pipe(
        switchMap((data) => {
          this.generalSrv.setNavigationValue(data.id);
          this.idProgram = data.id;
          const formData = this.generalSrv.getFormdata(
            data.id,
            'imagen',
            this.file,
            'programa',
            ''
          );
          return this.generalSrv.uploadFile(formData);
        })
      )
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Programa creado.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          this.indButton = false;
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Programa no creado.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.programForm.get('imagen').setValue('2');
    this.file = file;
    this.previewimage = previewimage;
  }
}
