var mixin = require('../index');
var assert = require('assert');

describe('mixin(opt0 ... optN) return a class', function() {
    it('can called with new', function() {
        var Class = mixin();
        var a = new Class()
        assert(a instanceof Class);
    });

    it('call directly equals called with new', function() {
        var Class = mixin();
        var a = Class();
        assert(a instanceof Class);
    });

    it('can extend with *object*', function() {
        var Class = mixin(
                {
                    a: 1
                }, 
                {
                    b: 2
                }
            );

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('can extend with *function*', function() {
        var Class = mixin(
                function() {
                    this.a = 1;
                },
                function() {
                    this.b = 2
                }
            );

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('can extend with *class*', function() {
        var C = function() {
            this.a = 1;
        }
        C.prototype.b = 2;


        var Class = mixin(C);

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('can pass arguments to all constructor', function() {
        var Class = mixin(function(a, b) {
            this.a = a;
        }, function(a, b) {
            this.b = b;
        })

        var o = Class(1, 2);
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    })

    it('should uniq opts', function() {
        var calledTimes = 0;
        var Ctor = function() {
            calledTimes++;
        };
        var Class = mixin(Ctor, Ctor, mixin(Ctor));
        var a = Class();
        assert.equal(calledTimes, 1)
    })
})

describe('mixin().mix(opt0 ... optN)', function() {
    it('should mix in myself', function() {
        var Class = mixin();
        var ClassMixReturn = Class.mix({
            a: 1
        }, {
            b: 2
        })

        assert.equal(Class, ClassMixReturn)

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });
})

describe('mixin().extend(opt0 ... optN)', function() {
    it('should create new extended class', function() {
        var Class = mixin();
        var ClassMixReturn = Class.extend({
            a: 1
        }, {
            b: 2
        })

        var o = ClassMixReturn();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    })

    it('should not change self', function() {
        var Class = mixin();
        var ClassMixReturn = Class.extend({
            a: 1
        }, {
            b: 2
        })
        assert.notEqual(Class, ClassMixReturn)

        var o = Class();
        assert.equal(o.a, undefined);
        assert.equal(o.b, undefined);
    })
})