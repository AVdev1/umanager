import { FormGroup, NgForm } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { ScrollToService } from "@nicky-lenaers/ngx-scroll-to";
import * as moment from "moment";

@Injectable()
export abstract class BaseForm {
  @Output() sent: EventEmitter<any> = new EventEmitter();
  @Output() sentSuccess: EventEmitter<any> = new EventEmitter();
  @Output() sentFailed: EventEmitter<any> = new EventEmitter();
  @Output() scrolledToErrors: EventEmitter<any> = new EventEmitter();

  protected requestSubscription = new Subscription();
  protected request$: Observable<any>;

  protected scrollToService: ScrollToService;

  isSubmitted = false;
  isSent = false;
  isModal = false;

  abstract formGroup: FormGroup;

  abstract prepareRequest(): Observable<any>;

  submitPrepare() {
    this.formGroup.setErrors(null);
    Object.keys(this.formGroup.getRawValue()).forEach(field => {
      this.formGroup.get(field).updateValueAndValidity();
    });
    this.formGroup.markAllAsTouched();
  }

  submit() {
    console.log('submit')
    this.submitPrepare();
    console.log('this.formGroup', this.formGroup)

    if (this.formGroup.valid) {
      this.isSubmitted = true;
      this.send();
    } else {
      this.scrollToError();
    }
  }

  send() {
    if (this.isSent) {
      return;
    }

    this.request$ = this.prepareRequest();
    this.isSent = true;
    this.requestSubscription = this.request$
      .pipe(finalize(() => this.onRequestFinal()))
      .subscribe(
        value => this.onRequestSuccess(value),
        error => this.onRequestFailed(error),
      );
  }

  onRequestSuccess(value): void {
    this.sentSuccess.emit(value);
    setTimeout(() => {
      try {
        this.formGroup.reset();
      } catch (e) {
        console.warn(e.message);
      }
  }, 1);
  }

  onRequestFailed(errorResponse: HttpErrorResponse): void {
    this.setFormErrors(errorResponse);
    this.sentFailed.emit(this.formGroup.errors);
  }

  onRequestFinal(): void {
    this.isSubmitted = false;
    this.isSent = false;

    if (this.formGroup.invalid) {
      this.scrollToError();
    }

    this.requestSubscription.unsubscribe();
    this.sent.emit();
  }

  /**
   * Describes how to find validation error keys in object returned by backend
   */
  setFormErrors(errorResponse: HttpErrorResponse) {
    const generalErrors: any = {};

    // Nest Errors Handler
    if (errorResponse.error && errorResponse.error.message && errorResponse.error.message.forEach) {
      errorResponse.error.message.forEach(message => {
        message.children.forEach(item => {
          if (this.formGroup.get(item.property)) {
            this.formGroup.get(item.property).setErrors({ invalid: true, ...item.constraints });
          } else {
            generalErrors[item.property] = true;
            // console.log('generalErrors[message.property]', generalErrors[message.property])
          }
        });
        // if (this.formGroup.get(message.property)) {
        //     this.formGroup.get(message.children.property).setErrors({ invalid: true });
        //     // console.log('1')
        // } else {
        //     generalErrors[message.property] = true;
        //     // console.log('generalErrors[message.property]', generalErrors[message.property])
        //     // console.log('generalErrors', generalErrors)
        //     // console.log('2')
        // }
      });
    }

    // Laravel Errors Handler
    if (errorResponse.error ? errorResponse.error.errors : null) {
      for (let [property, value] of Object.entries(errorResponse.error.errors)) {
        if (this.formGroup.get(property.toString())) {
          (value as string[]).forEach(rule => {
            console.log("");
            this.formGroup.get(property.toString()).setErrors({ [rule]: true });
          });
        } else {
          generalErrors[property.toString()] = true;
        }
      }
    }

    if (errorResponse.status === 0 ||
      errorResponse.status === 404 ||
      errorResponse.status >= 500
    ) {
      generalErrors.server = true;
    }

    if (errorResponse.status === 403) {
      generalErrors.unauthorized = true;
    }

    this.formGroup.setErrors(generalErrors);
  }

  scrollToError() {
    if (this.isModal) {
      setTimeout(() => {
        const invalidInput = document.querySelector(".form-error > p");
        if (invalidInput) {
          invalidInput.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.querySelector(".form-error > p");
      if (element) {
        element.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        // const offset = element.getBoundingClientRect().top - (window.innerHeight / 4);
        // const config: ScrollToConfigOptions = {
        //     offset
        // };
        // this.scrollToService.scrollTo(config);
      }
    }
  }

  incrementControl(formControlName) {
    const control = this.formGroup.get(formControlName);
    if (control) {
      const value = Number(control.value);
      control.setValue(value + 1);
    }
  }

  decrementControl(formControlName, unsigned = false) {
    const control = this.formGroup.get(formControlName);
    if (control) {
      const value = Number(control.value);

      if (!unsigned || value > 0) {
        control.setValue(value - 1);
      }
    }
  }

  convertFromNgbDatepicker(dateStruct) {

    return dateStruct ? moment(
      ("0000" + dateStruct.year).substr(-4, 4)
      + "-" +
      ("00" + dateStruct.month).substr(-2, 2)
      + "-" +
      ("00" + dateStruct.day).substr(-2, 2),
    ) : moment(null);
  }

  convertToNgbDatepicker(date) {

    let _date = moment(date);

    return {
      day: Number(_date.format("D")),
      month: Number(_date.format("M")),
      year: Number(_date.format("Y")),
    };
  }
}
