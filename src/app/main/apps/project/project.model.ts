import {Model} from "../../../../@core/abstracts/model";

export class Project extends Model {
  id: string;
  creator: string;
  pname: string;
  pkey: string;
  summary: string;
  maintainer: string;
  category: string;
  team: string[];
  start: Date;
  end: Date;
}
