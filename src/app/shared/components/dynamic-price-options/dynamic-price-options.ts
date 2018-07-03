export class PriceOptions<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    validation: any[];
    option: { key: any, value: any }[];
    type: string;
    placeholder: string;
    step: number;
    max: number;
    min: number;

    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        order?: number,
        step?: number,
        max?: number,
        min?: number,
        controlType?: string,
        type?: string,
        placeholder?: string,
        validation?: any[],
        option?: { key: any, value: any }[]
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.type = options.type || 'number';
        this.placeholder = options.placeholder || '';
        this.validation = options.validation || [];
        this.option = options.option || [];
        this.step = options.step || 1;
        this.max = options.step || 100;
        this.min = options.step || 0;
    }
}