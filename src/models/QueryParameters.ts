export default class QueryParameters {
  skip?: number;
  limit?: number;
  fields?: string;
  omitFields?: string;
  asc?: string;
  desc?: string;
  embed?: string;
  startDate?: any;
  endDate?: any;

  constructor() {
    this.skip = 0;
    this.limit = 0;
    this.fields = "";
    this.omitFields = "";
    this.asc = "";
    this.desc = "";
    this.embed = "";
    this.startDate = "";
    this.endDate = "";
  }

  static describe(): Array<string> {
    return Object.getOwnPropertyNames(new QueryParameters());
  }
}
