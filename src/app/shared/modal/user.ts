export class User {
  name:string;
  email:string;
  phone:number;
  company:string;
  password:string;
  city:string;

  constructor(options:{
    name?:string;
    email?:string;
    phone?:number;
    company?:string;
    password?:string;
    city?:string;
  } = {}) {

    this.name = options.name || '';
    this.email = options.email || '';
    this.phone = options.phone || 0;
    this.company = options.company || '';
    this.password = options.password || '';
    this.city = options.city || '';
  }
}
