import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';

import { CoreSidebarModule } from '@core/components';
import { CoreCommonModule } from '@core/common.module';

import { TaskListComponent } from 'app/main/apps/task/task-list/task-list.component';
import { TaskListItemComponent } from 'app/main/apps/task/task-list/task-list-item/task-list-item.component';
import { TaskMainSidebarComponent } from 'app/main/apps/task/task-sidebars/task-main-sidebar/task-main-sidebar.component';
import { TaskRightSidebarComponent } from 'app/main/apps/task/task-sidebars/task-right-sidebar/task-right-sidebar.component';

import { TaskComponent } from 'app/main/apps/task/task.component';
import { TaskService } from 'app/main/apps/task/task.service';

// routing
const routes: Routes = [
  {
    path: ':filter',
    component: TaskComponent,
    resolve: {
      data: TaskService
    }
  },
  {
    path: 'task/:tag',
    component: TaskComponent,
    resolve: {
      data: TaskService
    }
  },
  {
    path: '**',
    redirectTo: 'all',
    data: { animation: 'task' }
  }
];

@NgModule({
  declarations: [
    TaskComponent,
    TaskListComponent,
    TaskMainSidebarComponent,
    TaskRightSidebarComponent,
    TaskListItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    CoreSidebarModule,
    QuillModule.forRoot(),
    NgSelectModule,
    DragulaModule.forRoot(),
    NgbModule,
    Ng2FlatpickrModule,
    PerfectScrollbarModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
