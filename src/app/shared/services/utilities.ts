export class Utilities {
  static isEmptyObj(item:any) {
    return Utilities.isUndefined(item) || Utilities.isNull(item) || item.length === 0;
  }

  static isEmptyStr(item:any) {
    return Utilities.isNull(item) || item.length === 0 || item === '';
  }

  static isEmptyWithTrim(item:any) {
    return Utilities.isNull(item) || item.length === 0 || item.trim() === '';
  }

  static isNull(item:any) {
    return item === null;
  }

  static isUndefined(item:any) {
    return item === undefined;
  }
}
