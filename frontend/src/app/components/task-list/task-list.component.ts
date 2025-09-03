import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';
  filterStatus = 'all'; // 'all', 'completed', 'incomplete'

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load tasks: ' + error.message;
        this.loading = false;
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete task: ' + error.message;
        }
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id!, updatedTask).subscribe({
      next: (data) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        this.tasks[index] = data;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update task: ' + error.message;
      }
    });
  }

  searchTasks(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.taskService.searchTasks(this.searchTerm).subscribe({
        next: (data: Task[]) => {
          this.tasks = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to search tasks: ' + error.message;
          this.loading = false;
        }
      });
    } else {
      this.loadTasks();
    }
  }

  filterTasks(): void {
    this.loading = true;
    switch (this.filterStatus) {
      case 'completed':
        this.taskService.getCompletedTasks().subscribe({
          next: (data: Task[]) => {
            this.tasks = data;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load completed tasks: ' + error.message;
            this.loading = false;
          }
        });
        break;
      case 'incomplete':
        this.taskService.getIncompleteTasks().subscribe({
          next: (data: Task[]) => {
            this.tasks = data;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Failed to load incomplete tasks: ' + error.message;
            this.loading = false;
          }
        });
        break;
      default:
        this.loadTasks();
        break;
    }
  }
}