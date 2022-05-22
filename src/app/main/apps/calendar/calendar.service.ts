import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { EventModel } from 'app/main/apps/calendar/calendar.model';
import {AdminApiService} from "../../../../@core/abstracts/admin-api.service";
@Injectable()
export class CalendarService extends AdminApiService implements Resolve<any> {
  // Public
  public events;
  public calendar;
  public currentEvent;
  public tempEvents;

  public onEventChange: BehaviorSubject<any>;
  public onCurrentEventChange: BehaviorSubject<any>;
  public onCalendarChange: BehaviorSubject<any>;
  public model = EventModel;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    super(_httpClient);

    this.onEventChange = new BehaviorSubject({});
    this.onCurrentEventChange = new BehaviorSubject({});
    this.onCalendarChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getEvents(), this.getCalendar()]).then(res => {
        resolve(res);
      }, reject);
    });
  }

  /**
   * Get Events
   */
  getEvents(): Promise<any[]> {
    const url = `${this.apiUrl}/calendar`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        // console.log('response', response)
        // this.events = response?.items;

        console.log('this.events', this.events)
        this.events = response?.items;
        this.onEventChange.next(this.events);
        resolve(this.events);
      }, reject);
    });
  }

  /**
   * Get Calendar
   */
  getCalendar(): Promise<any[]> {
    const url = `api/calendar-filter`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.calendar = response;
        this.onCalendarChange.next(this.calendar);
        resolve(this.calendar);
      }, reject);
    });
  }

  /**
   * Create New Event
   */
  createNewEvent() {
    this.currentEvent = {};
    this.onCurrentEventChange.next(this.currentEvent);
  }

  /**
   * Calendar Update
   *
   * @param calendars
   */
  calendarUpdate(calendars) {
    const calendarsChecked = calendars.filter(calendar => {
      return calendar.checked === true;
    });

    let calendarRef = [];
    calendarsChecked.map(res => {
      calendarRef.push(res.filter);
    });

    let filteredCalendar = this.tempEvents.filter(event => calendarRef.includes(event.calendar));
    this.events = filteredCalendar;
    console.log('this.events SERVICE', this.events)
    this.onEventChange.next(this.events);
  }

  /**
   * Delete Event
   *
   * @param event
   */
  deleteEvent(event) {
    return new Promise((resolve, reject) => {
      this._httpClient.delete('api/calendar-events/' + event.id).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    // const newEvent = new EventModel();
    // newEvent.url = eventForm.url;
    // newEvent.title = eventForm.title;
    // newEvent.start_date = eventForm.start_date;
    // newEvent.end_date = eventForm.end_date;
    // newEvent.allDay = eventForm.allDay;
    // newEvent.calendar = eventForm.selectlabel;
    // newEvent.extended_props.location = eventForm.location;
    // newEvent.extended_props.description = eventForm.description;
    // newEvent.extended_props.addGuest = eventForm.addGuest;
    this.currentEvent = eventForm;
    this.onCurrentEventChange.next(this.currentEvent);
    return this.postNewEvent();
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  updateCurrentEvent(eventRef) {
    const newEvent = new EventModel();
    newEvent.allDay = eventRef.event.allDay;
    newEvent.id = parseInt(eventRef.event.id);
    newEvent.url = eventRef.event.url;
    newEvent.title = eventRef.event.title;
    newEvent.start = eventRef.event.start;
    newEvent.end = eventRef.event.end;
    newEvent.calendar = eventRef.event.extended_props.calendar;
    newEvent.extended_props.location = eventRef.event.extended_props.location;
    newEvent.extended_props.description = eventRef.event.extended_props.description;
    newEvent.extended_props.addGuest = eventRef.event.extended_props.addGuest;
    this.currentEvent = newEvent;
    this.onCurrentEventChange.next(this.currentEvent);
  }

  /**
   * Post New Event
   */
  postNewEvent(): Observable<EventModel> {
    // return new Promise((resolve, reject) => {
    //   this._httpClient.post('api/calendar-events/', this.currentEvent).subscribe(response => {
    //     this.getEvents();
    //     resolve(response);
    //   }, reject);
    // });

    const url = `${this.apiUrl}/calendar`;

    return this.http.post<EventModel>(url, this.currentEvent);
  }

  /**
   * Post Updated Event
   *
   * @param event
   */
  postUpdatedEvent(event) {
    return new Promise((resolve, reject) => {
      this._httpClient.post('api/calendar-events/' + event.id, { ...event }).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }
}
