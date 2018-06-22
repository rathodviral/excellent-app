export class Filters{
  language: FilterData[];
  radiostation: FilterData[];
  tier: FilterData[];
  zone: FilterData[];

  constructor(options: {
    language?: FilterData[],
    radiostation?: FilterData[],
    tier?: FilterData[],
    zone?: FilterData[]
  } = {}) {
    this.language = options.language || [];
    this.radiostation = options.radiostation || [];
    this.tier = options.tier || [];
    this.zone = options.zone || [];
  }
}

export class FilterData{
  filterValueId: string;
  filterValueName: string;
  sortOrder: string;

  constructor(options: {
    filterValueId?: string;
    filterValueName?: string;
    sortOrder?: string;
  } = {}) {
    this.filterValueId = options.filterValueId || '';
    this.filterValueName = options.filterValueName || '';
    this.sortOrder = options.sortOrder || '0';
  }
}
