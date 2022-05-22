export class EventModel {
  id? = undefined;
  url: string;
  title: string = '';
  start: string;
  end: string;
  allDay = false;
  calendar: '';
  extended_props = {
    location: '',
    description: '',
    addGuest: []
  };
}
