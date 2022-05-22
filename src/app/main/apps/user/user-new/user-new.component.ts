import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';

import { UserNewService } from 'app/main/apps/user/user-new/user-new.service';
import {BaseForm} from "../../../../../@core/abstracts/base-form.component";
// import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserNewComponent extends BaseForm implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;

  @ViewChild('accountForm') accountForm: NgForm;
  @ViewChild('customAvatar') customAvatar: HTMLElement;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Russian'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  public formGroup: FormGroup = new FormGroup({
    username: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    last_name: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    first_name: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    email: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    position: this.formBuilder.control("", {}),
    photo: this.formBuilder.control("", {}),
    phone: this.formBuilder.control("", {}),
    status: this.formBuilder.control("Active", {}),
    permission: this.formBuilder.control({}),
    permissionList: new FormArray([]),
    password: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    roles: this.formBuilder.control([], {}),
  })

  test() {}

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userNewService
   */
  constructor(
      private router: Router,
      private _userNewService: UserNewService,
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
   * Convert DIV to Image
   *
   */
  // async convertToImage() {
  //   let reader = new FileReader();
  //
  //   let element = this.customAvatar;
  //
  //   let blob = new Blob([element], {
  //     "type": "image/png"
  //   })
  //
  //   reader.onload = (event: any) => {
  //     console.log('onload', event.target.result)
  //     this.avatarImage = event.target.result;
  //
  //   };
  //
  //   await reader.readAsDataURL(blob);
  // }

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
    console.log('data', data)
    return this._userNewService.createUser(data);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userNewService.onUserNewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.rows.map(row => {
        if (row.id == this.urlLastValue) {
          // this.currentRow = row;
          // this.avatarImage = this.currentRow.avatar;
          this.tempRow = cloneDeep(row);
        }
      });
    });

    this.currentRow = this.formGroup.getRawValue();

    this.formGroup.valueChanges.subscribe((i: any) => {
      this.currentRow = i;

      // if(i.first_name.length && i.last_name.length) {
      //   if(!this.avatarImage) {
      //     // let node = document.getElementById('my-node');
      //
      //     // let imageData = domtoimage.toPng(node).then(function (dataUrl) {
      //     //   console.log('dataUrl', dataUrl)
      //     //   return dataUrl;
      //     // }).catch(function (error) {
      //     //   console.error('oops, something went wrong!', error);
      //     // });
      //
      //     // this.formGroup.get('photo').setValue(imageData);
      //
      //   }
      // }
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
