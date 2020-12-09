import { LessonService } from './../../../services/lesson.service';
import { GeneralService } from './../../../services/general.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-creacion-leccion',
  templateUrl: './creacion-leccion.component.html',
  styleUrls: ['./creacion-leccion.component.css'],
})
export class CreacionLeccionComponent implements OnInit {
  idModulo;
  lessonForm: FormGroup;
  file: any;
  previewimage: any;
  idLesson = null;
  indButton = true;

  constructor(
    private lessonSrv: LessonService,
    private fb: FormBuilder,
    private generalSrv: GeneralService
  ) {}

  ngOnInit(): void {
    this.idModulo = this.generalSrv.getNavigationValue();
    this.createLessonForm();
  }

  createLessonForm(): void {
    this.lessonForm = this.fb.group({
      nombre: ['', [Validators.required,  Validators.pattern('^[a-zA-Z 0-9 áéíóú ÁÉÍÓÚ ñÑ]*$')]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]]
    });
  }

  createLesson(): void {
    const lesson = this.lessonForm.value;
    lesson.estado = true;
    lesson.modulo = this.idModulo;
    this.lessonSrv
      .createLesson(lesson)
      .pipe(
        switchMap((data) => {
          this.generalSrv.setNavigationValue(data.id);
          this.idLesson = data.id;
          const formData = this.generalSrv.getFormdata(
            data.id,
            'imagen',
            this.file,
            'leccion',
            ''
          );
          return this.generalSrv.uploadFile(formData);
        })
      )
      .subscribe(
        (resp) => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Lección creada.',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
          this.indButton = false;
        },
        (error) => {
          Swal.fire({
            title: '¡Error!',
            text: 'Lección no creada.',
            icon: 'warning',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      );
  }

  async onFileSelect(event): Promise<any> {
    const { file, previewimage } = await this.generalSrv.onFileSelect(event);
    this.lessonForm.get('imagen').setValue('2');
    this.file = file;
    this.previewimage = previewimage;
  }
}
