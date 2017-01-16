A trivial fixed size LIFO (stack) data structure in Javascript that can (optionally) be
plugged to overflow in some other data structure.

## Installation

    npm install fixed-size-lifo --save

## Usage

```javascript
    import {FixedSizeLifo} from 'fixed-size-lifo';
```

## Examples

### Create a LIFO of size 2
```javascript
    import {FixedSizeLifo} from 'fixed-size-lifo';
    let s = new FixedSizeLifo(2);
    s.size(); // 0
    s.remainingCapacity(); // 2
    s.numOverflown(); // 0 items have been overflown due to the size limit
```

### push / pop

**push** pushes an item into the stack; **pop** pops out the item from the top of the stack:
```javascript
    let s = new FixedSizeLifo(2);
    s.size();  // 0
    s.push(43);
    s.push(42);     
    s.size();  // 2
    s.pop();   // 42
    s.size();  // 1
```
### peek 

**peek** can be used to look at elements from the top of the LIFO stack *without* modifying
the stack.

```javascript
    s.peek();  // look at item from the top of the stack
    s.peek(0); // same as above
    s.peek(1); // look at item 1 place below the top of the stack

```

### peekBottom

**peekBottom** works just like **peek** except it looks at the bottom of the stack.


## More

For more functions and examples look at the code (*src/lib.js*) and the test cases (*test/test.js*).

