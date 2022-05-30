import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import {Task} from './task.model';
import {User} from "../user/user.model";
import {AdminApiService} from "../../../../@core/abstracts/admin-api.service";
import {Project} from "../project/project.model";

@Injectable()
export class TaskService extends AdminApiService implements Resolve<any> {
  // Public
  public tasks: Task[];
  public assignee;
  public filters;
  public tags;
  public tempTasks: Task[];
  public currentTask;
  public sortParamRef = 'id';

  public onTaskDataChange: BehaviorSubject<any>;
  public onCurrentTaskChange: BehaviorSubject<any>;
  public onAssigneeChange: BehaviorSubject<any>;
  public onFilterChange: BehaviorSubject<any>;
  public onTagChange: BehaviorSubject<any>;
  public onSearchQueryChange: BehaviorSubject<any>;
  public onFiltersChange: BehaviorSubject<any>;
  public onTagsChange: BehaviorSubject<any>;

  public model = User;
  public userList: User[];

  public projectModel = Project;
  public projectList: Project[];

  // Private
  private routeParams: any;
  private sortTodoRef = key => (a, b) => {
    let fieldA;
    let fieldB;

    // If sorting is by dueDate => Convert data to date
    if (key === 'dueDate') {
      fieldA = new Date(a[key]);
      fieldB = new Date(b[key]);
      // eslint-disable-next-line brace-style
    }

    // If sorting is by assignee => Use `fullName` of assignee
    else if (key === 'assignee') {
      fieldA = a.assignee ? a.assignee.fullName : null;
      fieldB = b.assignee ? b.assignee.fullName : null;
    } else {
      fieldA = a[key];
      fieldB = b[key];
    }

    let comparison = 0;

    if (fieldA === fieldB) {
      comparison = 0;
    } else if (fieldA === null) {
      comparison = 1;
    } else if (fieldB === null) {
      comparison = -1;
    } else if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }

    return comparison;
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
    this.onTaskDataChange = new BehaviorSubject({});
    this.onCurrentTaskChange = new BehaviorSubject({});
    this.onAssigneeChange = new BehaviorSubject({});
    this.onFilterChange = new BehaviorSubject({});
    this.onTagChange = new BehaviorSubject({});
    this.onSearchQueryChange = new BehaviorSubject({});
    this.onFiltersChange = new BehaviorSubject({});
    this.onTagsChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getTasksList(), this.getUserList(), this.getProjectList(), this.getFilters(), this.getTags(), this.getAssignee()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Todos List
   *
   * @returns {Promise<Todo[]>}
   */
  getTasksList(): Promise<any[]> {
    if (this.routeParams.filter) {
      return this.getTasksByFilter(this.routeParams.filter);
    }

    if (this.routeParams.tag) {
      return this.getTasksByTag(this.routeParams.tag);
    }
  }

  /**
   * Get Filters
   */
  getFilters() {
    return new Promise<void>((resolve, reject) => {
      this._httpClient.get('api/todos-filters').subscribe((filters: any) => {
        this.filters = filters;
        this.onFiltersChange.next(this.filters);
        resolve();
      }, reject);
    });
  }

  /**
   * Get Tags
   */
  getTags() {
    return new Promise<void>((resolve, reject) => {
      this._httpClient.get('api/todos-tags').subscribe((tags: any) => {
        this.tags = tags;
        this.onTagsChange.next(this.tags);
        resolve();
      }, reject);
    });
  }

  /**
   * Get Todos By Filter
   *
   * @param filterHandel
   */
  getTasksByFilter(filterHandel): Promise<any[]> {
    let param;
    // Setup param for filter
    if (filterHandel === 'all') {
      param = 'deleted=false';
    } else if (filterHandel === 'deleted') {
      param = filterHandel + '=true';
    } else {
      param = filterHandel + '=true' + '&&deleted=false';
    }

    return new Promise((resolve, reject) => {
      // this._httpClient.get(`${this.apiUrl}/task?` + param).subscribe((tasks: any) => {
      this._httpClient.get(`${this.apiUrl}/task?`).subscribe((tasks: any) => {
        this.tasks = tasks;
        this.tempTasks = tasks;
        this.onTaskDataChange.next(this.tasks);
        this.sortTasks(this.sortParamRef);
        resolve(this.tasks);
      }, reject);
    });
  }

  /**
   * Get Todos By Tag
   *
   * @param tagHandel
   */
  getTasksByTag(tagHandel): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/todos-data?tags=' + tagHandel).subscribe((tasks: any) => {
        this.tasks = tasks;
        this.tempTasks = tasks;
        this.onTaskDataChange.next(this.tasks);
        this.sortTasks(this.sortParamRef);
        resolve(this.tasks);
      }, reject);
    });
  }

  /**
   * Get Todos Assignee
   *
   */
  getAssignee(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/todos-assignee').subscribe((assignee: any) => {
        this.assignee = assignee;
        this.onAssigneeChange.next(this.assignee);
        resolve(this.tasks);
      }, reject);
    });
  }

  /**
   * Get Todos By Search
   *
   * @param query
   */
  getTasksBySearch(query) {
    const filteredTasks = this.tempTasks.filter(task => {
      return task.title.toLowerCase().includes(query.toLowerCase());
    });
    this.tasks = filteredTasks;
    this.onTaskDataChange.next(this.tasks);
    this.sortTasks(this.sortParamRef);
  }

  /**
   * Create New Task
   */
  createNewTask(task: any): Observable<Task> {
    // this.currentTask = {};
    // this.onCurrentTaskChange.next(this.currentTask);

    const url = `${this.apiUrl}/task`;
    console.log('URL', url)
    console.log('task', task)
    return this.http.post<Task>(url, task);
  }
  //
  // /**
  //  * Create new user
  //  * @param user
  //  */
  // createUser(user: any): Observable<User> {
  //   const url = `${this.apiUrl}/user`;
  //
  //   return this.http.post<User>(url, user);
  // }

  /**
   * Set Current Todo
   *
   * @param id
   */
  setCurrentTodo(id) {
    console.log('this.tasks', this.tasks)
    //@ts-ignore
    this.currentTask = this.tasks?.items?.find(todo => {
      return todo.id === id;
    });
    this.onCurrentTaskChange.next(this.currentTask);
  }

  /**
   * Update Current Todo
   *
   * @param todo
   */
  updateCurrentTask(task) {
    if (task.id === undefined) {
      this.currentTask = task;
      this.onCurrentTaskChange.next(this.currentTask);
      this.postNewTask();
    } else {
      this.currentTask = task;
      this.onCurrentTaskChange.next(this.currentTask);
      this.postTask();
    }
  }

  /**
   * Post Todo (Update Todo to fake-db)
   */
  postTask() {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/todos-data/' + this.currentTask.id, { ...this.currentTask }).subscribe(response => {
        this.getTasksList().then(tasks => {
          resolve(tasks);
        }, reject);
      });
    });
  }

  /**
   * Post New Task (Add Task to db)
   *
   */
  postNewTask() {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/todos-data/', this.currentTask).subscribe(response => {
        this.getTasksList().then(tasks => {
          this.sortTasks(this.sortParamRef);
          resolve(tasks);
        }, reject);
      });
    });
  }

  /**
   * Sort Tasks
   *
   * @param sortByParam
   */
  sortTasks(sortByParam) {
    this.sortParamRef = sortByParam;
    let sortDesc = true;

    const sortBy = (() => {
      if (sortByParam === 'title-asc') {
        sortDesc = false;
        return 'title';
      }
      if (sortByParam === 'title-desc') return 'title';
      if (sortByParam === 'assignee') {
        sortDesc = false;
        return 'assignee';
      }
      if (sortByParam === 'due-date') {
        sortDesc = false;
        return 'dueDate';
      }
      return 'id';
    })();

    if (sortByParam !== null) {
      // this.tasks = this.tasks.sort(this.sortTodoRef(sortBy));
      // if (sortDesc) this.tasks.reverse();

      this.onCurrentTaskChange.next(this.tasks);
    }
  }

  /**
   * Get users
   */
  getUserList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/user`).subscribe((response: any) => {
        this.userList = this.model.fromJsonArray(response.items);
        resolve(this.userList);
      }, reject);
    });
  }

  /**
   * Get projects
   */
  getProjectList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/project`).subscribe((response: any) => {
        this.projectList = this.projectModel.fromJsonArray(response.items);
        resolve(this.projectList);
      }, reject);
    });
  }
}
