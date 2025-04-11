import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {

  students: Student[] = [];
  formGroupStudent: FormGroup;

  constructor(private service: StudentService,
              private formBuilder:FormBuilder
  ){
    this.formGroupStudent = formBuilder.group(
      {
      id: [''],
      name: [''],
      course: ['']
    }
  );
  }

  ngOnInit(): void {
    this.service.getStudents().subscribe({
        next: json => this.students = json
    })
  }

  save()
  {
    this.service.saveStudent(this.formGroupStudent.value)
                .subscribe({
                  next: json => { this.students.push(json);
                    this.formGroupStudent.reset();
                  }
                })
  }

}