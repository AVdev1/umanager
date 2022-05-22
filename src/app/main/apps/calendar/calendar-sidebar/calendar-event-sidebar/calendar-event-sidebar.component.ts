import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EventModel } from 'app/main/apps/calendar/calendar.model';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseForm} from "../../../../../../@core/abstracts/base-form.component";
import {Observable} from "rxjs";

@Component({
  selector: 'app-calendar-event-sidebar',
  templateUrl: './calendar-event-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarEventSidebarComponent extends BaseForm implements OnInit {
  //  Decorator
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;

  // Public
  public event: EventModel;
  public isDataEmpty;
  public selectLabel = [
    { label: 'Business', bullet: 'primary' },
    { label: 'Personal', bullet: 'danger' },
    { label: 'Family', bullet: 'warning' },
    { label: 'Holiday', bullet: 'success' },
    { label: 'ETC', bullet: 'info' }
  ];
  public selectGuest = [
    { name: 'Jane Foster', avatar: 'assets/images/avatars/1-small.png' },
    { name: 'Donna Frank', avatar: 'assets/images/avatars/3-small.png' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/avatars/5-small.png' },
    { name: 'Lori Spears', avatar: 'assets/images/avatars/7-small.png' },
    { name: 'Sandy Vega', avatar: 'assets/images/avatars/9-small.png' },
    { name: 'Cheryl May', avatar: 'assets/images/avatars/11-small.png' }
  ];
  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };

  public formGroup: FormGroup = new FormGroup({
    title: this.formBuilder.control("", {
      validators: [Validators.required],
    }),
    url: this.formBuilder.control("", {}),
    calendar: this.formBuilder.control(1, {
      validators: [Validators.required],
    }),
    all_day: this.formBuilder.control(false, {}),
    extended_props: this.formBuilder.control(null, {}),
    user_id: this.formBuilder.control('1103a5cc-c1b0-11ec-be5a-0242ac120007', {}),
    start: this.formBuilder.control(null, {}),
    end: this.formBuilder.control(null, {}),
  })

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _calendarService: CalendarService, public formBuilder: FormBuilder) {
    super();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Prepare request
   *
   */
  prepareRequest(): Observable<any>{
    this.submitPrepare();
    let data = this.formGroup.value;

    //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
    data.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    data.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;

    return this._calendarService.addEvent(data);
  }

  /**
   * Toggle Event Sidebar
   */
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    if (eventForm.valid) {
      // //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
      eventForm.form.value.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
      eventForm.form.value.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
      //

      console.log('eventFOrm', eventForm.form.value)
      this._calendarService.addEvent(eventForm.form.value);
      this.toggleEventSidebar();
    }
  }

  /**
   * Update Event
   */
  updateEvent() {
    this.toggleEventSidebar();
    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    this.event.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    this.event.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    console.log('this.event', this.event);
    this._calendarService.postUpdatedEvent(this.event);
  }

  /**
   * Delete Event
   */
  deleteEvent() {
    this._calendarService.deleteEvent(this.event);
    this.toggleEventSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to current event changes
    this._calendarService.onCurrentEventChange.subscribe(response => {
      this.event = response;

      // If Event is available
      if (Object.keys(response).length > 0) {
        this.event = response;
        this.isDataEmpty = false;
        if (response.id === undefined) {
          this.isDataEmpty = true;
        }
      }
      // else Create New Event
      else {
        this.event = new EventModel();

        // Clear Flatpicker Values
        setTimeout(() => {
          this.startDatePicker.flatpickr.clear();
          this.endDatePicker.flatpickr.clear();
        });
        this.isDataEmpty = true;
      }
    });
  }
}
