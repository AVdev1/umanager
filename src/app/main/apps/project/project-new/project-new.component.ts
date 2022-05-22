import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';

import {BaseForm} from "../../../../../@core/abstracts/base-form.component";
import {ProjectNewService} from "./project-new.service";
import { Project } from '../project.model';
import {UserListService} from "../../user/user-list/user-list.service";
// import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectNewComponent extends BaseForm implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public userList;
  public categoryList;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public project: Project;

  //  Decorator
  @ViewChild('accountForm') accountForm: NgForm;
  @ViewChild('customAvatar') customAvatar: HTMLElement;
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Russian'];
  public selectMultiLanguagesSelected = [];

  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: false
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: false
  };

  // Private
  private _unsubscribeAll: Subject<any>;
  public formGroup: FormGroup = new FormGroup({
    creator: this.formBuilder.control("d5063888-d441-11ec-a1c8-0242ac120007", {}),
    pname: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    pkey: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    summary: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    maintainer: this.formBuilder.control("d5063888-d441-11ec-a1c8-0242ac120007", {}),
    team: this.formBuilder.control([], {}),
    category: this.formBuilder.control({}, {}),
    start: this.formBuilder.control(null, {}),
    end: this.formBuilder.control(null, {}),
  })

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _projectNewService
   */
  constructor(
      private router: Router,
      private _projectNewService: ProjectNewService,
      public formBuilder: FormBuilder
  ) {
    super();
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
        this.formGroup.get('photo').setValue(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Prepare request
   *
   */
  prepareRequest(): Observable<any> {
    // console.log('this.avatarImage', this.avatarImage)
    // console.log('this.customAvatar', this.customAvatar)
    // this.submitted = true;
    this.submitPrepare();
    const data = this.formGroup.value;

    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    data.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    data.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;

    console.log('data', data)
    return this._projectNewService.createProject(data);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._projectNewService.onProjectNewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.rows.map(row => {
        if (row.id == this.urlLastValue) {
          // this.currentRow = row;
          // this.avatarImage = this.currentRow.avatar;
          this.tempRow = cloneDeep(row);
        }
      });
    });

    // this._projectNewService.onProjectNewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.userList = response;
    // });

    // this._projectNewService.onProjectNewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
    //   this.categoryList = response;
    // })
    this.categoryList = this._projectNewService.categoryList;
    this.userList = this._projectNewService.userList;

    this.currentRow = this.formGroup.getRawValue();

    this.formGroup.valueChanges.subscribe((i: any) => {
      this.currentRow = i;
      console.log('i', i)
    })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
