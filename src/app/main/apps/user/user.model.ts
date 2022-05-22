import {Model} from "../../../../@core/abstracts/model";

export class User extends Model {
  id: string;
  last_name: string;
  first_name: string;
  photo: string;
  position: string;
  phone: string;
  city: string;
  password: string;
  roles: string[];
}
