export class Filter {
  location: Location[];
  station: string[];
  languages: string[];
  audienceClass?: string[];
  mediaoption?: string[];
  screenPreference?: string;
  tier: string[];
  zone: string[];

  constructor(options: {
    location?: Location[];
    station?: string[];
    languages?: string[];
    audienceClass?: string[],
    mediaoption?: string[],
    screenPreference?: string,
    tier?: string[];
    zone?: string[];
  } = {}) {
    this.location = options.location || [];
    this.station = options.station || [];
    this.languages = options.languages || [];
    this.audienceClass = options.audienceClass || [];
    this.mediaoption = options.mediaoption || [];
    this.screenPreference = options.screenPreference || '';
    this.tier = options.tier || [];
    this.zone = options.zone || [];
  }
}

export class Location {
  LocationType: string;
  LocationId: string;
  LocationName: string;

  constructor(options: {
    LocationType?: string;
    LocationId?: string;
    LocationName?: string;
  } = {}) {
    this.LocationType = options.LocationType || '';
    this.LocationId = options.LocationId || '';
    this.LocationName = options.LocationName || '';
  }
}

export class Params {
  filters: Filter;
  offset: number;
  sortBy: string;
  orderBy: string;
  limit: number;
  // optionType: string[];
  optionType: string;

  constructor(options: {
    filters?: Filter;
    offset?: number;
    sortBy?: string;
    orderBy?: string;
    limit?: number;
    // optionType?: string[];
    optionType?: string;
  } = {}) {
    this.filters = options.filters || new Filter();
    this.offset = options.offset || 0;
    this.sortBy = options.sortBy || 'views';
    this.orderBy = options.orderBy || 'views';
    this.limit = options.limit || 20;
    // this.optionType = options.optionType || [];
    this.optionType = options.optionType || '';
  }
}

export class LocationFilter {
  q: string;
  media: string;

  constructor(options: {
    q?: string;
    media?: string;
  } = {}) {
    this.q = options.q || '';
    this.media = options.media || '';
  }
}
