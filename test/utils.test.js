const utils = require('../src/modules/utils');
const { checkType } = utils;

// checkType
// Object
test('type {} to equal Object', () => {
    expect(checkType({})).toBe('Object');
});
// Symbol
test('type Symbol() to equal Symbol', () => {
    expect(checkType(Symbol(123))).toBe('Symbol');
});
// Date
test('type new Date() to equal Date', () => {
    expect(checkType(new Date())).toBe('Date');
});
// function
test('type new Date() to equal Function', () => {
    expect(checkType(() => {})).toBe('Function');
});

