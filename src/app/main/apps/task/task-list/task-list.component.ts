import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { Task } from 'app/main/apps/task/task.model';
import { TaskService } from 'app/main/apps/task/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  // Public
  public tasks: Task[];

  /**
   * Constructor
   *
   * @param {TaskService} _taskService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _dragulaService: DragulaService,
    private _taskService: TaskService,
    private _coreSidebarService: CoreSidebarService
  ) {
    // Drag And Drop With Handle
    _dragulaService.destroy('todo-tasks-drag-area');
    _dragulaService.createGroup('todo-tasks-drag-area', {
      moves: function (el, container, handle) {
        return handle.classList.contains('drag-icon');
      }
    });
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param nameRef
   */
  toggleSidebar(nameRef): void {
    this._coreSidebarService.getSidebarRegistry(nameRef).toggleOpen();
  }

  /**
   * Update Sort
   *
   * @param sortRef
   */
  updateSort(sortRef) {
    this._taskService.sortTasks(sortRef);
  }

  /**
   * Update Query
   *
   * @param queryRef
   */
  updateQuery(queryRef) {
    this._taskService.getTasksBySearch(queryRef.target.value);
  }

  /**
   * Open Todo
   *
   * @param idRef
   */
  openTodo(idRef) {
    this._taskService.setCurrentTodo(idRef);
    this._coreSidebarService.getSidebarRegistry('todo-sidebar-right').toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe Todos change
    this._taskService.onTaskDataChange.subscribe(response => {
      console.log('response', response)
      this.tasks = response?.items;
    });
  }
}
