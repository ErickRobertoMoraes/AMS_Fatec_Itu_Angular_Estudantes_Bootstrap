import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-course',
  standalone: false,
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  formGroupCourse: FormGroup;
  isEditMode = false;         // controla se estamos editando
  private editingCourseId?: number;

  constructor(
    private service: CourseService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupCourse = this.formBuilder.group({
      id: [''],
      name: [''],
      vagas: [''],
      periodo: [''],
      modalidade: [''],
      disciplinasComplementares: [false]
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.service.getAll().subscribe({
      next: json => this.courses = json
    });
  }

  save() {
    const courseData = this.formGroupCourse.value as Course;
    if (this.isEditMode && this.editingCourseId != null) {
      // Atualização
      this.service.update({ ...courseData, id: this.editingCourseId })
        .subscribe({
          next: updated => {
            // substitui o curso na lista
            const idx = this.courses.findIndex(c => c.id === updated.id);
            if (idx > -1) this.courses[idx] = updated;
            this.finishEdit();
          }
        });
    } else {
      // Criação
      this.service.save(courseData)
        .subscribe({
          next: created => {
            this.courses.push(created);
            this.finishEdit();
          }
        });
    }
  }

  edit(course: Course) {
    this.isEditMode = true;
    this.editingCourseId = course.id;
    // carrega os valores no formulário
    this.formGroupCourse.patchValue({
      id: course.id,
      name: course.name,
      vagas: course.vagas,
      periodo: course.periodo,
      modalidade: course.modalidade,
      disciplinasComplementares: course.disciplinasComplementares
    });
    // opcional: rolar até o form ou dar foco no primeiro campo
  }

  cancelEdit() {
    this.finishEdit();
  }

  private finishEdit() {
    this.isEditMode = false;
    this.editingCourseId = undefined;
    // reseta o form com valores padrão
    this.formGroupCourse.reset({
      id: '',
      name: '',
      vagas: '',
      periodo: '',
      modalidade: '',
      disciplinasComplementares: false
    });
  }

  delete(course: Course) {
    this.service.delete(course).subscribe({
      next: () => this.loadCourses()
    });
  }
}
