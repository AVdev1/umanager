import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';
import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';

import {ProjectNewComponent} from "./project-new/project-new.component";
import {ProjectNewService} from "./project-new/project-new.service";
import {ProjectListComponent} from "./project-list/project-list.component";
import {ProjectListService} from "./project-list/project-list.service";
import {ProjectViewComponent} from "./project-view/project-view.component";
import {ProjectViewService} from "./project-view/project-view.service";
import {ProjectEditComponent} from "./project-edit/project-edit.component";
import {NewProjectSidebarComponent} from "./project-list/new-project-sidebar/new-project-sidebar.component";
import {ProjectEditService} from "./project-edit/project-edit.service";

// routing
const routes: Routes = [
  {
    path: 'project-list',
    component: ProjectListComponent,
    resolve: {
      uls: ProjectListService
    },
    data: { animation: 'ProjectListComponent' }
  },
  {
    path: 'project-view/:id',
    component: ProjectViewComponent,
    resolve: {
      data: ProjectViewService,
      InvoiceListService
    },
    data: { path: 'view/:id', animation: 'ProjectViewComponent' }
  },
  {
    path: 'project-edit/:id',
    component: ProjectEditComponent,
    resolve: {
      ues: ProjectEditService
    },
    data: { animation: 'ProjectEditComponent' }
  },
  {
    path: 'project-new',
    component: ProjectNewComponent,
    resolve: {
      ues: ProjectNewService
    },
    data: { animation: 'ProjectNewComponent' }
  },
  // {
  //   path: 'user-view',
  //   redirectTo: '/apps/user/user-view/2' // Redirection
  // },
  {
    path: 'project-edit',
    redirectTo: '/apps/project/project-edit/2' // Redirection
  },
  // {
  //   path: 'user-new',
  //   redirectTo: '/apps/user/user-new/2' // Redirection
  // }
];

@NgModule({
  declarations: [
    ProjectListComponent, ProjectViewComponent, ProjectEditComponent, ProjectNewComponent, NewProjectSidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule
  ],
  providers: [ProjectListService, ProjectViewService, ProjectEditService, ProjectNewService]
})
export class ProjectModule {}
