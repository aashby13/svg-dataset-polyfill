"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svgDatasetPolyfill = (function () {
    if (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset') || (!Object.getOwnPropertyDescriptor(SVGElement.prototype, 'dataset')).get) {
        var descriptor = {
            enumerable: true,
            get: function () { },
            attributes: []
        };
        //
        descriptor.get = function () {
            var element = this;
            var map = {
                enumerable: true,
                get: function () { },
                set: function () { }
            };
            var attributes = this.attributes;
            function toUpperCase(n0) {
                return n0.charAt(1).toUpperCase();
            }
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
                    // Change to camelCase
                    var propName = name_1.substr(5).replace(/-./g, toUpperCase);
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
