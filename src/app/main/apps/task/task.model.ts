import {Model} from "../../../../@core/abstracts/model";

export class Task extends Model {
  id? = undefined;
  title = '';
  code = '';
  duedate = null;
  startdate = null;
  description = '';
  assignee = '';
  avatar: '';
  project = null;
  type = '';
  tags = [];
  completed = false;
  deleted = false;
  author: '';
  manager: '';
  manager_first_name: '';
  manager_last_name: '';
  project_name: '';
}
