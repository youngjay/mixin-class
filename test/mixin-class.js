'use strict';

var mixin = require('../index');
var assert = require('assert');

describe('mixin(opt0 ... optN) return a class', function() {
    it('mixin()会返回一个构造函数', function() {
        var Class = mixin();
        var a = new Class()
        assert(a instanceof Class);
    });

    it('mixin(opt0...optN)可以接受object作为参数，这些object的属性会被添加到返回的类prototype', function() {
        var Class = mixin(
                {
                    a: 1
                }, 
                {
                    b: 2
                }
            );

        var o = new Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('mixin() === mixin.extend()', function() {
        var Class = mixin.extend(
                {
                    a: 1
                }, 
                {
                    b: 2
                }
            );

        var o = new Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    })

    it('mixin(opt0...optN)可以接受function作为参数，这些function会在new的时候依次被调用', function() {
        var Class = mixin(
                function() {
                    this.a = 1;
                },
                function() {
                    this.b = 2
                }
            );

        var o = new Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('mixin(opt0...optN)可以接受class作为参数，这些class的prototype的属性会被添加到返回的类prototype，这些class的构造函数会在new的时候依次被调用', function() {
        var C = function() {
            this.a = 1;
        }
        C.prototype.b = 2;


        var Class = mixin(C);

        var o = new Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('传入的function调用时会传入arguments', function() {
        var Class = mixin(function(a, b) {
            this.a = a;
        }, function(a, b) {
            this.b = b;
        })

        var o = new  Class(1, 2);
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    })

    it('传入的function会去重', function() {
        var calledTimes = 0;
        var Ctor = function() {
            calledTimes++;
        };
        var Class = mixin(Ctor, Ctor, mixin(Ctor));
        var a = new Class();
        assert.equal(calledTimes, 1)
    })
})

describe('mixin ctor', function() {
    it('每个构造函数的返回值会作为下一个构造函数的this', function() {
        var a = {};
        var b = {};
        var c = {};


        var A = function() {
            return a;
        };

        var B = function() {
            assert.equal(this, a);
            return b;
        };

        var C = function() {
            assert.equal(this, b);
            return c;
        }

        var o = new (mixin(A, B, C))();


        assert.equal(o, c)

    })

});