export class Filters {
  language: FilterData[];
  radiostation: FilterData[];
  audienceClass: FilterData[];
  screenPreference: any[];
  mediaoption: FilterData[];
  mediaName: FilterData[];
  illumination: FilterData[];
  tier: FilterData[];
  zone: any[];
  optionType: any[];

  constructor(options: {
    language?: FilterData[],
    radiostation?: FilterData[],
    audienceClass?: FilterData[],
    screenPreference?: any[],
    mediaoption?: FilterData[],
    mediaName?: FilterData[],
    illumination?: FilterData[],
    tier?: FilterData[],
    zone?: any[]
    optionType?: any[]
  } = {}) {
    this.language = options.language || [];
    this.radiostation = options.radiostation || [];
    this.audienceClass = options.audienceClass || [];
    this.screenPreference = options.screenPreference || [];
    this.mediaoption = options.mediaoption || [];
    this.mediaName = options.mediaName || [];
    this.illumination = options.illumination || [];
    this.tier = options.tier || [];
    this.zone = options.zone || [];
    this.optionType = options.optionType || [];
  }
}

export class FilterData {
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
