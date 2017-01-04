/* @flow */
require('source-map-support').install();
import 'babel-polyfill';
import {assert} from 'chai';
import _ from 'lodash';

import {FixedSizeLifo} from '../lib/index.js';

describe('FixedSizeLifo', function () {
    describe('constructor', function () {
        it('should work'
           , function () {
               const MAX = 2;
               let s : FixedSizeLifo = new FixedSizeLifo(MAX);
               assert.strictEqual(s.size(), 0);
               assert.strictEqual(s.remainingCapacity(), MAX);
               assert.strictEqual(s.numOverflown(), 0);

               for (let i = 0 ; i < MAX ; i++) {
                   s.push(i);
                   assert.strictEqual(s.size(), i+1);
                   assert.strictEqual(s.remainingCapacity(), MAX-(i+1));
                   assert.strictEqual(s.numOverflown(), 0);
               }
               for (let i = 0 ; i < 10 ; i++) {
                   s.push(i);
                   assert.strictEqual(s.size(), MAX);
                   assert.strictEqual(s.remainingCapacity(), 0);
                   assert.strictEqual(s.numOverflown(), i+1);
               }
           });
    });
    describe('peek, pop', function () {
        it('should work'
           , function () {
               const MAX = 2;
               const overflowValues = [];
               const overflow = (x) => {overflowValues.push(x);};
               let s : FixedSizeLifo = new FixedSizeLifo(MAX, overflow);
               s.push(3);
               assert.strictEqual(s.peek(), 3);
               assert.strictEqual(s.peekBottom(), 3);
               assert.deepEqual(overflowValues, []);
               s.push(4);
               assert.strictEqual(s.peek(), 4);
               assert.strictEqual(s.peekBottom(), 3);
               assert.deepEqual(overflowValues, []);               
               s.push(5);
               assert.strictEqual(s.peek(), 5);
               assert.strictEqual(s.peekBottom(), 4);
               assert.deepEqual(overflowValues, [3]);
               s.push(6);
               assert.strictEqual(s.peek(), 6);
               assert.strictEqual(s.peekBottom(), 5);
               assert.deepEqual(overflowValues, [3,4]);
               
               assert.strictEqual(s.pop(), 6);
               assert.strictEqual(s.peekBottom(), 5);
               assert.deepEqual(overflowValues, [3,4]);

               assert.strictEqual(s.pop(), 5);
               assert.strictEqual(s.peekBottom(), undefined);
               assert.deepEqual(overflowValues, [3,4]);                              
           });
    });
    describe('clone', function () {
        it('should work'
           , function () {
               const MAX = 2;
               const overflowValues = [];
               const overflow = (x) => {overflowValues.push(x);};
               let s : FixedSizeLifo = new FixedSizeLifo(MAX, overflow);
               s.push(3);
               assert.strictEqual(s.peek(), 3);
               assert.strictEqual(s.peekBottom(), 3);
               assert.deepEqual(overflowValues, []);
               s.push(4);
               assert.strictEqual(s.peek(), 4);
               assert.strictEqual(s.peekBottom(), 3);
               assert.deepEqual(overflowValues, []);               
               s.push(5);
               assert.strictEqual(s.peek(), 5);
               assert.strictEqual(s.peekBottom(), 4);
               assert.deepEqual(overflowValues, [3]);
               s.push(6);
               assert.strictEqual(s.peek(), 6);
               assert.strictEqual(s.peekBottom(), 5);
               assert.deepEqual(overflowValues, [3,4]);
               const s2 = s.clone();
               assert.strictEqual(s2.peek(), 6);
               assert.strictEqual(s2.peekBottom(), 5);
               assert.deepEqual(overflowValues, [3,4]);
               s2.push(7);
               assert.strictEqual(s.peek(), 6);
               assert.strictEqual(s.peekBottom(), 5);
               assert.deepEqual(overflowValues, [3,4]);
               assert.strictEqual(s2.peek(), 7);
               assert.strictEqual(s2.peekBottom(), 6);
               assert.deepEqual(overflowValues, [3,4]);
           });
    });
});
