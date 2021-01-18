"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svgDatasetPolyfill = (function () {
    if (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') || (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset')).get) {
        var descriptor = {
            enumerable: true,
            get: undefined
        };
        //
        descriptor.get = function () {
            var element = this;
            var map = {};
            var attributes = this.attributes;
            function getter() {
                return this.value;
            }
            function setter(name, value) {
                if (typeof value !== 'undefined') {
                    this.setAttributeNS(null, name, value);
                }
                else {
                    this.removeAttributeNS(null, name);
                }
            }
            for (var i = 0; i < attributes.length; i++) {
                var attribute = attributes[i];
                if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
                    var name_1 = attribute.name;
                    var value = attribute.value;
                    // camelCase multi-dashed data attr: ie: data-example-one to exampleOne
                    var propName = name_1.substr(5).split('-').map(function (s, i) { return i > 0 ? s.charAt(0).toUpperCase() + s.substr(1) : s; }).join('');
                    Object.defineProperty(map, propName, {
                        enumerable: this.enumerable,
                        get: getter.bind({
                            value: value || ''
                        }),
                        set: setter.bind(element, name_1)
                    });
                }
            }
            return map;
        };
        Object.defineProperty(SVGElement.prototype, 'dataset', descriptor);
        return 'svg-dataset-polyfill in use!';
    }
    else {
        return 'svg-dataset-polyfill not required for this browser';
    }
})();
exports.default = svgDatasetPolyfill;
