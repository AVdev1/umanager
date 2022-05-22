import { Component, Input, OnInit } from '@angular/core';

import { Task } from 'app/main/apps/task/task.model';
import { TaskService } from 'app/main/apps/task/task.service';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html'
})
export class TaskListItemComponent implements OnInit {
  // Input Decorator
  @Input() task: Task;

  // Public
  public selected;

  /**
   * Constructor
   *
   * @param {TaskService} _taskService
   */
  constructor(private _taskService: TaskService) {}

  /**
   *
   * @param stateRef
   */
  checkboxStateChange(stateRef) {
    this.task.completed = stateRef;
    this._taskService.updateCurrentTask(this.task);
  }

  ngOnInit(): void {}
}
