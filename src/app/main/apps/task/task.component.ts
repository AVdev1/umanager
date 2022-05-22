import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'todo-application' }
})
export class TaskComponent {}
