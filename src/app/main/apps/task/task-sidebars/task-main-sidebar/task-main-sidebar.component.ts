import { Component, OnInit } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { TaskService } from 'app/main/apps/task/task.service';

@Component({
  selector: 'app-task-main-sidebar',
  templateUrl: './task-main-sidebar.component.html'
})
export class TaskMainSidebarComponent implements OnInit {
  // Public
  public filters: Array<{}>;
  public tags: Array<{}>;

  /**
   * Constructor
   *
   * @param {TaskService} _taskService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _taskService: TaskService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param nameRef
   */
  createNewTodo(nameRef, closeNameRef): void {
    this._coreSidebarService.getSidebarRegistry(nameRef).toggleOpen();
    this._coreSidebarService.getSidebarRegistry(closeNameRef).toggleOpen();
    // this._taskService.createNewTask({});
  }

  /**
   * Toggle Sidebar
   *
   * @param nameRef
   */
  toggleSidebar(nameRef): void {
    this._coreSidebarService.getSidebarRegistry(nameRef).toggleOpen();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._taskService.onFiltersChange.subscribe(response => (this.filters = response));
    this._taskService.onTagsChange.subscribe(response => (this.tags = response));
  }
}
