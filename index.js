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

var create = function(Ctor, args) {
    switch (args.length) {
        case 0:
            return new Ctor();            
        case 1:
            return new Ctor(args[0]);
        case 2:
            return new Ctor(args[0], args[1]);
        case 3:
            return new Ctor(args[0], args[1], args[2]);
        default:
            var instance = Object.create(Ctor.prototype);
            Ctor.apply(instance, args);
            return instance;
    }
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


var createMixinClass = function() {

    var Mixin = function() {
        var args = arguments;
        return getCtors(Mixin).reduce(function(instance, init) {
            return init.apply(instance, args) || instance;
        }, this);
    };

    setCtors(Mixin, []);

    return Mixin;
};

var Abstract = function() {};

setCtors(Abstract, []);

Abstract.mix = function() {
    var self = this;
    var proto = this.prototype;

    var ctors = getCtors(this);

    flatten(slice.call(arguments)).forEach(function(o) {
        if (!o) {
            return;
        }

        if (typeof o === 'function') {
            var srcProto = o.prototype;
            var srcCtors = getCtors(o);

            if (srcCtors) {
                ctors.push.apply(ctors, srcCtors);
            } else {
                ctors.push(o);
            }

            mix(proto, srcProto);
            mix(self, o);
            return;
        }

        if (typeof o === 'object') {
            mix(proto, o);
            return;
        }                    
    });

    setCtors(this, uniq(ctors));
    proto.constructor = this;

    return this;
};

Abstract.extend = function() {    
    return this.mix.apply(createMixinClass(), [this].concat(slice.call(arguments)));
};

Abstract.create = function() {
    return create(this, arguments);
};

Abstract.prototype.mix = function() {
    var Class = Abstract.extend.apply(Abstract, arguments);
    mix(this, Class.prototype);
    Class.call(this);
    return this;
};

Abstract.prototype.extend = function() {
    return this.mix.apply({}, [this].concat(slice.call(arguments)));
};

module.exports = function() {
    return Abstract.extend(slice.call(arguments));
};

module.exports.extend = module.exports;