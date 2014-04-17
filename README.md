mixin-class
===========
mixin style inherit


```javascript
'use strict';

var mixin = require('../index');
var assert = require('assert');

describe('mixin(opt0 ... optN) return a class', function() {
    it('mixin()会返回一个构造函数', function() {
        var Class = mixin();
        var a = new Class()
        assert(a instanceof Class);
    });

    it('mixin()返回的构造函数可以省略new来调用', function() {
        var Class = mixin();
        var a = Class();
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

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('mixin(opt0...optN)可以接受function作为参数，这些function会在new的时候依次被调用', function() {
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

    it('mixin(opt0...optN)可以接受class作为参数，这些class的prototype的属性会被添加到返回的类prototype，这些class的构造函数会在new的时候依次被调用', function() {
        var C = function() {
            this.a = 1;
        }
        C.prototype.b = 2;


        var Class = mixin(C);

        var o = Class();
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    });

    it('传入的function调用时会传入arguments', function() {
        var Class = mixin(function(a, b) {
            this.a = a;
        }, function(a, b) {
            this.b = b;
        })

        var o = Class(1, 2);
        assert.equal(o.a, 1);
        assert.equal(o.b, 2);
    })

    it('传入的function会去重', function() {
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
    it('调用mix会改变自身', function() {
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
    it('调用extend会生成一个新的mixin', function() {
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

    it('但是不会改变自身', function() {
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
```