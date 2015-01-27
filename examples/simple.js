var Checker = require('../');
var checker = new Checker();

// Require a minimum of 8 characters
checker.min_length = 8;
// Require a aximum of 20 characters
checker.max_length = 20;

// Set the allowed letters
// Default: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
checker.allowed_letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz'; // Without IOijlo

// Set the allowed numbers
// Default: "0123456789"
checker.allowed_numbers = '23456789'; // Without 01

// Set the allowed symbols
// Default: "_-!\"?$%^&*()+={}[]:;@'~#|<>,.?\\/"
checker.allowed_symbols = "_-";

// Require letters in the password
checker.requireLetters(true);

// Require numbers and/or symbols in the password
checker.requireNumbersOrSymbols(true);

// Disallow words from the words list
// Default: /lib/norvig-10000.mod.js
checker.disallowWords(true);

// Disallow words from the names list
// Default: /lib/all-names.mod.js
checker.disallowNames(true);

// Disallow words from the passwords list
// Default: /lib/passwords-10000.mod.js
checker.disallowPasswords(true);


console.log(' ');
console.log('Checking password: "abc123"');
console.log(checker.check('abc123'));
console.log('Errors:');
console.log(checker.errors);
console.log('Rules applied:');
console.log(checker.rules);
console.log(' ');

console.log('-----------------------------------');

console.log(' ');
console.log('Checking password: "bkcdshjk7678_"');
console.log(checker.check('bkcdshjk7678_'));
console.log('Errors:');
console.log(checker.errors);
console.log('Rules applied:');
console.log(checker.rules);
console.log(' ');
console.log('-----------------------------------');
