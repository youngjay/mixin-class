'use strict';

var slice = [].slice;
var CTORS = '__ctors';

var setCtors = function(o, ctors) {
    Object.defineProperty(o, CTORS, {
        value: ctors
    });
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

var mergeObjectFromArray = function(dest, arr) {
    arr.forEach(function(o) {
        mix(dest, o)
    })
    return dest;
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
        staticProperties: staticProperties,
        instanceProperties: instanceProperties
    }
};

var CONSTRUCTOR_CONTENT = (function() {
    var args = arguments;
    return getCtors(this.constructor).reduce(function(instance, init) {
        return init.apply(instance, args) || instance;
    }, this);
}).toString().replace(/function\s*\(\)/, '');

var generateConstructor = function(ctors) {
    var constructorNames = ctors.reduce(function(names, fn) {
        if (fn.name) {
            names.push(fn.name)
        }
        return names;
    }, []).join('__');

    var Class;    
    eval('Class = function ' + constructorNames + '()' + CONSTRUCTOR_CONTENT);
    setCtors(Class, ctors);
    return Class;
};

module.exports = function() {
    var config = getMixinConfig(flatten(slice.call(arguments)));
    var Class = generateConstructor(config.constructors);
    mergeObjectFromArray(Class, config.staticProperties);
    mergeObjectFromArray(Class.prototype, config.instanceProperties);
    return Class;
};