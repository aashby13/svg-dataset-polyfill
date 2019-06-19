interface Descriptor {
  enumerable: boolean;
  get: () => void;
  attributes: Attribute[]
}

interface Attribute {
  name: string;
  value: string | number;
}

interface DatasetMap {
  [key: string]: any | undefined;
  enumerable: boolean;
  get: () => void;
  set: () => void;
}

const svgDatasetPolyfill = (function () {

  if (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') || (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') as any).get) {
    const descriptor: Descriptor = {
      enumerable: true,
      get: () => {},
      attributes: []
    };
    //
    descriptor.get = function () {
      const element = this;
      const map: DatasetMap = {
        enumerable: true,
        get: () => { },
        set: () => { }
      };
      const attributes: Attribute[] = this.attributes;

      function toUpperCase(n0: string) {
        return n0.charAt(1).toUpperCase();
      }

      function getter(): string | number {
        return this.value;
      }

      function setter(name: string, value: string | number) {
        if (typeof value !== 'undefined') {
          this.setAttributeNS(null, name, value);
        } else {
          this.removeAttributeNS(null, name);
        }
      }

      for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];

        if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
          const name = attribute.name;
          const value = attribute.value;
          // Change to camelCase
          const propName = name.substr(5).replace(/-./g, toUpperCase);
          Object.defineProperty(map, propName, {
            enumerable: this.enumerable,
            get: getter.bind({
              value: value || ''
            }),
            set: setter.bind(element, name)
          });
        }
      }
      return map;
    };
    Object.defineProperty(SVGElement.prototype, 'dataset', descriptor);
    return 'svg-dataset-polyfill in use!';
  } else {
    return 'svg-dataset-polyfill not required for this browser';
  }

})();

export default svgDatasetPolyfill;
