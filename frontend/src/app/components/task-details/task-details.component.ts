import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task?: Task;
  loading = true;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTaskDetails();
  }

  getTaskDetails(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taskService.getTaskById(id).subscribe({
      next: (data: Task) => {
        this.task = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load task details: ' + error.message;
        this.loading = false;
      }
    });
  }

  deleteTask(): void {
    if (!this.task?.id || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete task: ' + error.message;
      }
    });
  }

  toggleTaskStatus(): void {
    if (!this.task) return;
    
    const updatedTask = { ...this.task, completed: !this.task.completed };
    this.taskService.updateTask(this.task.id!, updatedTask).subscribe({
      next: (data) => {
        this.task = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update task: ' + error.message;
      }
    });
  }
}