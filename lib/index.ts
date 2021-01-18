interface Attribute {
  name: string;
  value: string | number;
}

const svgDatasetPolyfill = (function () {

  if (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') || (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') as PropertyDescriptor).get) {
    const descriptor: PropertyDescriptor = {
      enumerable: true,
      get: undefined
    };
    //
    descriptor.get = function () {
      const element = this;
      const map: PropertyDescriptorMap = {};
      const attributes: Attribute[] = this.attributes;

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
          // camelCase multi-dashed data attr: ie: data-example-one to exampleOne
          const propName = name.substr(5).split('-').map((s, i) => i > 0 ? s.charAt(0).toUpperCase() + s.substr(1) : s).join('');
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
