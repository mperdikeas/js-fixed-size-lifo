// @flow

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

FixedSizeLifo.prototype.peek = function(furtherBack: number = 0): any {
    assert.isTrue(Number.isInteger(furtherBack));
    return this.arr[this.arr.length-1-furtherBack];
};

FixedSizeLifo.prototype.maximumPeekFurtherBack = function(): number {
    return Math.min(this.arr.length, this.max)-1;
}

FixedSizeLifo.prototype.peekBottom = function(furtherFront: number = 0): any {
    assert.isTrue(Number.isInteger(furtherFront));
    return this.arr[0+furtherFront];
};

FixedSizeLifo.prototype.maximumPeekBottomFurtherFront = function(): number {
    return FixedSizeLifo.prototype.maximumPeekFurtherBack.call(this);
}

FixedSizeLifo.prototype.pop = function(): any {
    return this.arr.pop();
};

FixedSizeLifo.prototype.at = function(i: number): any {
    return this.arr[i];
};


exports.FixedSizeLifo = FixedSizeLifo;
export type {OverflowFunction};
