'use strict';

var slice = [].slice;
var CTORS = '__ctors';

var setCtors = function(o, ctors) {
    o[CTORS] = ctors;
};

var getCtors = function(o) {
    return o[CTORS];
};

var mix = function(dest, src) {
    var i;
    for (i in src) {
        dest[i] = src[i];
    }
    return dest;
};

var flatten = function(o) {
    if (Array.isArray(o)) {
        return o.map(flatten).reduce(function(results, arr) {
            return results.concat(arr);
        }, []);
    } else {
        return [o];
    }
};

var uniq = function(arr) {
    return arr.reduce(function(results, o) {
        if (results.indexOf(o) === -1) {
            results.push(o);
        }
        return results;
    }, []);
};

var mergeObjectFromArray = function(arr) {
    return arr.reduce(function(all, o) {
        return mix(all, o);
    }, {});
};

var getMixinConfig = function(args) {
    var staticProperties = [];
    var instanceProperties = [];
    var constructors = [];

    args.forEach(function(o) {
        if (!o) {
            return;
        }

        if (typeof o === 'function') {
            var srcProto = o.prototype;
            var srcCtors = getCtors(o);

            if (srcCtors) {
                constructors = constructors.concat(srcCtors);
            } else {
                constructors.push(o);
            }

            instanceProperties.push(srcProto);
            staticProperties.push(o);
            return;
        }

        if (typeof o === 'object') {
            instanceProperties.push(o);
            return;
        }                    
    });

    return {
        constructors: uniq(constructors),
        staticProperties: mergeObjectFromArray(staticProperties),
        instanceProperties: mergeObjectFromArray(instanceProperties)
    }
};

var fnString = (function() {
    var args = arguments;
    return getCtors(this.constructor).reduce(function(instance, init) {
        return init.apply(instance, args) || instance;
    }, this);
}).toString().replace(/function\s*\(\)/, '');

var mixin = function() {
    var config = getMixinConfig(flatten(slice.call(arguments)));

    var constructorNames = config.constructors.reduce(function(names, fn) {
        if (fn.name) {
            names.push(fn.name)
        }
        return names;
    }, []).join('__');

    var Class;

    eval('Class = function ' + constructorNames + '()' + fnString);

    setCtors(Class, config.constructors)

    mix(Class, config.staticProperties);
    mix(Class.prototype, config.instanceProperties);

    return Class
};

var Mixin = function Mixin() {};

Mixin.extend = function() {
    return mixin(this, slice.call(arguments));
};

module.exports = Mixin.extend.bind(Mixin);
module.exports.extend = module.exports;