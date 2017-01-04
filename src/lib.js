// @flow
require('source-map-support').install();

'use strict';

// The rationale behind using this idiom is described in:
//     http://stackoverflow.com/a/36628148/274677
//
if (!global._babelPolyfill) // https://github.com/s-panferov/awesome-typescript-loader/issues/121
    require('babel-polyfill');
// The above is important as Babel only transforms syntax (e.g. arrow functions)
// so you need this in order to support new globals or (in my experience) well-known Symbols, e.g. the following:
//
//     console.log(Object[Symbol.hasInstance]);
//
// ... will print 'undefined' without the the babel-polyfill being required.



import {assert} from 'chai';
import _      from 'lodash';

type OverflowFunction = (x: any)=>void;

function FixedSizeLifo(max: number, f : OverflowFunction = ()=>{}) {
    assert.isTrue(Number.isInteger(max), `argument ${max} is not an integer`);
    assert.isTrue(max>=0, `argument ${max} is a negative number`);    
    this.max = max;
    this.overflownN = 0;
    this.arr = [];
    this.f = f;
}

FixedSizeLifo.prototype.push = function (vs) { // one or many values
    this.arr = this.arr.concat(vs);
    if (this.arr.length > this.max) {
        const overflown: Array<any> = this.arr.splice(0, this.arr.length - this.max);
        overflown.forEach( (x)=> {
            this.f(x);
            this.overflownN++;            
        } );
    }
};

FixedSizeLifo.prototype.clone = function(f: OverflowFunction = ()=>{}): FixedSizeLifo {
    const rv = new FixedSizeLifo(this.max, f); // you need to provide a new overflow function, can't use the existing one
    rv.overflownN = this.overflownN;
    rv.arr = this.arr;
    return rv;
};

FixedSizeLifo.prototype.size = function(): number {
    return this.arr.length;
};

FixedSizeLifo.prototype.remainingCapacity = function(): number {
    return this.max - this.arr.length;
};

FixedSizeLifo.prototype.numOverflown = function(): number {
    return this.overflownN;
};

FixedSizeLifo.prototype.peek = function(): number {
    return this.arr[this.arr.length-1];
};

FixedSizeLifo.prototype.peekBottom = function(): number {
    return this.arr[0];
};


FixedSizeLifo.prototype.pop = function(): number {
    return this.arr.pop();
};


exports.FixedSizeLifo = FixedSizeLifo;
export type {OverflowFunction};
