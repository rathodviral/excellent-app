export class FilteredData {
  entityId:string;
  productName:string;
  sku:string;
  productOrder:string;
  productShortDescription:string;
  productLongDescription:string;
  productImage:string;
  zone:string;
  state:string;
  cityName:string;
  locality:string;
  specification:string;
  attribute:any;
  productOption:any[];
  station:string;
  language:string[];
  tier:string;

  constructor(options:{
    entityId?:string;
    productName?:string;
    sku?:string;
    productOrder?:string;
    productShortDescription?:string;
    productLongDescription?:string;
    productImage?:string;
    zone?:string;
    state?:string;
    cityName?:string;
    locality?:string;
    specification?:string;
    attribute?:any;
    productOption?:any[];
    station?:string;
    language?:string[];
    tier?:string;
  } = {}) {

    this.entityId = options.entityId || '';
    this.productName = options.productName || '';
    this.sku = options.sku || '';
    this.productOrder = options.productOrder || '';
    this.productShortDescription = options.productShortDescription || '';
    this.productLongDescription = options.productLongDescription || '';
    this.productImage = options.productImage || '';
    this.zone = options.zone || '';
    this.state = options.state || '';
    this.cityName = options.cityName || '';
    this.locality = options.locality || '';
    this.specification = options.specification || '';
    this.attribute = options.attribute || {};
    this.productOption = options.productOption || [];
    this.station = options.station || '';
    this.language = options.language || [''];
    this.tier = options.tier || '';
  }
}
