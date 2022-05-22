import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { Task } from 'app/main/apps/task/task.model';
import { TaskService } from 'app/main/apps/task/task.service';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseForm} from "../../../../../../@core/abstracts/base-form.component";
import {Router} from "@angular/router";
import {UserNewService} from "../../../user/user-new/user-new.service";
import {Observable, Subject} from "rxjs";
import {User} from "../../../user/user.model";
import {Project} from "../../../project/project.model";

@Component({
  selector: 'app-task-right-sidebar',
  templateUrl: './task-right-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TaskRightSidebarComponent extends BaseForm implements OnInit  {
  // Public
  public isDataEmpty;
  public task: Task;
  public tags;
  public selectTags;
  public selectAssignee;
  public userList: User[];
  public projectList: Project[];

  @ViewChild('dueDateRef') private dueDateRef: any;
  @ViewChild('startDateRef') private startDateRef: any;

  public dueDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d'
  };

  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    altFormat: 'F j, Y',
    dateFormat: 'Y-m-d'
  };

  public formGroup: FormGroup = new FormGroup({
    title: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    duedate: this.formBuilder.control(null, {
      validators: [Validators.required],
    }),
    startdate: this.formBuilder.control(null, {
      validators: [Validators.required],
    }),
    description: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    project: this.formBuilder.control(null, {
      validators: [Validators.required],
    }),
    assignee: this.formBuilder.control(null, {}),
    manager: this.formBuilder.control(null, {}),
    type: this.formBuilder.control(null, {}),
    tags: this.formBuilder.control(null, {}),
    completed: this.formBuilder.control(false, {}),
  })

  /**
   * Constructor
   *
   * @param {TaskService} _taskService
   * @param {CoreSidebarService} _coreSidebarService
   * @param {FormBuilder} formBuilder
   */
  constructor(private _taskService: TaskService, private _coreSidebarService: CoreSidebarService, public formBuilder: FormBuilder) {
    super();
    // console.log('sidebar')
    // this.formGroup.valueChanges.subscribe((i: any) => {
    //   // this.currentRow = i;
    //   console.log('i', i)
    // });
  }

//   constructor(
//       private router: Router,
//       private _userNewService: UserNewService,
//       public formBuilder: FormBuilder
// ) {
//     super();
//   }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Prepare request
   *
   */
  prepareRequest(): Observable<any> {
    console.log('repare')
    this.submitPrepare();
    const data = this.formGroup.value;
    data.duedate = this.dueDateRef.flatpickrElement.nativeElement.children[0].value;
    data.startdate = this.startDateRef.flatpickrElement.nativeElement.children[0].value;

    console.log('data', data)
    // this.addTodo(data);
    return this._taskService.createNewTask(data);
  }

  onRequestSuccess() {
    this.closeSidebar();
  }

  /**
   * Close Sidebar
   */
  closeSidebar() {
    this._coreSidebarService.getSidebarRegistry('todo-sidebar-right').toggleOpen();
  }

  /**
   * Update Todo
   */
  updateTodo() {
    //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
    this.task.duedate = this.dueDateRef.flatpickrElement.nativeElement.children[0].value;
    this.task.startdate = this.startDateRef.flatpickrElement.nativeElement.children[0].value;

    this._taskService.updateCurrentTask(this.task);
    this.closeSidebar();
  }

  /**
   * Add Todo
   */
  addTodo(todoForm) {
    if (todoForm.valid) {
      //! Fix: Temp fix till ng2-flatpicker support ng-modal
      this.task.duedate = this.dueDateRef.flatpickrElement.nativeElement.children[0].value;
      this.task.startdate = this.startDateRef.flatpickrElement.nativeElement.children[0].value;
      this._taskService.updateCurrentTask(this.task);
      this.closeSidebar();
    }
  }

  /**
   * Delete Todo
   */
  deleteTodo() {
    this.task.deleted = !this.task.deleted;
    this._taskService.updateCurrentTask(this.task);
    this.closeSidebar();
  }

  /**
   * Toggle Complete
   */
  toggleComplete() {
    this.task.completed = !this.task.completed;
    this._taskService.updateCurrentTask(this.task);
    this.closeSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this._taskService.onCurrentTaskChange.subscribe(response => {
    //   console.log('response', response)
    //   if (Object.keys(response?.items).length > 0) {
    //     this.task = response;
    //     this.isDataEmpty = false;
    //   } else {
    //     this.task = new Task();
    //     console.log('this.task', this.task)
    //
    //     this.isDataEmpty = true;
    //   }
    // });
    this.isDataEmpty = true;
    this._taskService.onTagsChange.subscribe(response => {
      this.selectTags = response.map(tagRef => {
        return tagRef.handle;
      });
    });

    this._taskService.onAssigneeChange.subscribe(assigneeRef => {
      this.selectAssignee = assigneeRef;
    });

    this.userList = this._taskService.userList;
    this.projectList = this._taskService.projectList;
  }
}
