import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.taskId;

    if (this.isEditMode) {
      this.loading = true;
      this.taskService.getTaskById(this.taskId!).subscribe({
        next: (task: Task) => {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            completed: task.completed
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load task details: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  get f() { return this.taskForm.controls as any; }

  onSubmit(): void {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    const task: Task = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      completed: this.taskForm.value.completed
    };

    if (this.isEditMode) {
      this.taskService.updateTask(this.taskId!, task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to update task: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task: ' + error.message;
          this.loading = false;
        }
      });
    }
  }
}