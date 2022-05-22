export class Model {

  constructor(data?: any, ignoredProperties?: string[]) {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (ignoredProperties && ignoredProperties.indexOf(key) !== -1) {
          return;
        }
        this[key] = data[key] || null;
      });
    }
  }

  static fromJson(data: any): any {
    const model: any = new this(data);

    return model;
  }

  static fromJsonArray(data: any[]): any[] {
    const models = [];

    data.forEach((item) => {
      models.push(this.fromJson(item));
    });

    return models;
  }
}
