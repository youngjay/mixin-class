(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mixin"] = factory();
	else
		root["mixin"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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
	    mix(Class, config.staticProperties);
	    mix(Class.prototype, config.instanceProperties);
	    return Class;
	};

/***/ }
/******/ ])
});
;