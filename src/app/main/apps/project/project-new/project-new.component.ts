import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';

import {BaseForm} from "../../../../../@core/abstracts/base-form.component";
import {ProjectNewService} from "./project-new.service";
import { Project } from '../project.model';
import {User} from "../../../../auth/models";

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
  public currentUser: User;

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
    creator: this.formBuilder.control("", {}),
    pname: this.formBuilder.control("Eurointegration", {
      validators: [Validators.required],
    }),
    pkey: this.formBuilder.control("EUGTN", {
      validators: [Validators.required],
    }),
    summary: this.formBuilder.control("Summary", {
      validators: [Validators.required],
    }),
    maintainer: this.formBuilder.control("", {}),
    budget: this.formBuilder.control("", {}),
    category: this.formBuilder.control({}, {}),
    start: this.formBuilder.control(null, {}),
    end: this.formBuilder.control(null, {}),
  })

  // team: this.formBuilder.control([{id: ''}], {}),

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
    this.submitPrepare();
    const data = this.formGroup.value;

    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    data.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    data.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    data.budget = Number(data?.budget);
    data.creator = this.currentUser?.id;
    data.maintainer = this.currentUser?.id;

    // let test = [];
    //
    // this.formGroup.value.team.map(i => {
    //   test.push({id: i})
    // })
    //
    // data.team = test;
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
          this.tempRow = cloneDeep(row);
        }
      });
    });

    // get the currentUser details from localStorage
    this.currentUser = JSON.parse(localStorage.getItem('currentUserData'));

    this.categoryList = this._projectNewService.categoryList;
    this.userList = this._projectNewService.userList;

    this.currentRow = this.formGroup.getRawValue();

    this.formGroup.valueChanges.subscribe((i: any) => {
      console.log('this.formGroup', this.formGroup.value)



      // console.log('test', test)
      this.currentRow = i;
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
