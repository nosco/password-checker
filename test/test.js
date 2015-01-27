var assert = require('assert');
var Checker = require('../');
var checker = new Checker();

describe('Default rules', function () {
  it('Should allow anything with basic settings', function () {
    assert.strictEqual(checker.check(1), true, 'Password "1" should pass');
    assert.strictEqual(checker.check('hjdksa hkj dshkjh38 j dsjjk'), true, 'Password "hjdksa hkj dshkjh38 j dsjjk" should pass');
  });
});


describe('Length rules', function () {
  before(function() {
    checker.min_length = 8;
    checker.max_length = 12;
  });
  after(function() {
    checker.min_length = 0;
    checker.max_length = 0;
  });


  it('Should not allow too short passwords', function () {
    assert.notEqual(checker.check('short'), true, 'Password "short" should not pass');
  });

  it('Should not allow too long passwords', function () {
    assert.notEqual(checker.check('way too long to pass'), true, 'Password "way too long to pass" should not pass');
  });

  it('Should allow correct length passwords', function () {
    assert.strictEqual(checker.check('12345678'), true, 'Password "12345678" should pass');
    assert.strictEqual(checker.check('0123456789ab'), true, 'Password "0123456789ab" should pass');
  });
});


describe('Check against numbers, letters and symbols', function () {
  describe('Required letters rule', function () {
    before(function() {
      checker.allowed_letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz'; // Without IOijlo
      checker.allowed_numbers = '23456789'; // Without 01
      checker.allowed_symbols = "_-";
    });

    it('Should fail when missing letters', function () {
      checker.requireLetters(true);
      assert.notEqual(checker.check('123456789'), true, 'Password "123456789" should not pass');
      checker.requireLetters(false);
    });

    it('Should succeed when having letters', function () {
      checker.requireLetters(true);
      assert.strictEqual(checker.check('password'), true, 'Password "password" should pass');
      checker.requireLetters(false);
    });
  });

  describe('Required numbers rule', function () {
    it('Should fail when missing numbers', function () {
      checker.requireNumbers(true);
      assert.notEqual(checker.check('password'), true, 'Password "password" should not pass');
      checker.requireNumbers(false);
    });

    it('Should succeed when having numbers', function () {
      checker.requireNumbers(true);
      assert.strictEqual(checker.check('123456789'), true, 'Password "123456789" should pass');
      checker.requireNumbers(false);
    });
  });

  describe('Required symbols rule', function () {
    it('Should fail when missing symbols', function () {
      checker.requireSymbols(true);
      assert.notEqual(checker.check('abc123'), true, 'Password "abc123" should not pass');
      checker.requireSymbols(false);
    });

    it('Should succeed when having symbols', function () {
      checker.requireSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      checker.requireSymbols(false);
    });
  });

  describe('Required numbers and/or symbols rule', function () {
    it('Should fail when missing numbers and/or symbols', function () {
      checker.requireNumbersOrSymbols(true);
      assert.notEqual(checker.check('abcdef'), true, 'Password "abcdef" should not pass');
      checker.requireNumbersOrSymbols(false);
    });

    it('Should succeed when having numbers and/or symbols', function () {
      checker.requireNumbersOrSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      assert.strictEqual(checker.check('abc123'), true, 'Password "abc123" should pass');
      assert.strictEqual(checker.check('abc_'), true, 'Password "abc_" should pass');
      checker.requireNumbersOrSymbols(false);
    });
  });
});


describe('Check against default lists of words, names and passwords', function () {
  describe('Disallowed words as password rules', function () {
    before(function() { checker.disallowWords(true); });
    after(function() { checker.disallowWords(false); });

    it('Should disallow passwords that matches word in words list', function () {
      assert.notEqual(checker.check('this'), true, 'Password "this" should not pass');
    });

    it('Should allow passwords that does not match word in words list', function () {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed names as password rules', function () {
    before(function() { checker.disallowNames(true); });
    after(function() { checker.disallowNames(false); });

    it('Should disallow passwords that matches name in names list', function () {
      assert.notEqual(checker.check('Aaban'), true, 'Password "Aaban" should not pass');
    });

    it('Should allow passwords that does not match name in names list', function () {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed common passwords as password rules', function () {
    before(function() { checker.disallowPasswords(true); });
    after(function() { checker.disallowPasswords(false); });

    it('Should disallow passwords that matches password in passwords list', function () {
      assert.notEqual(checker.check('password'), true, 'Password "password" should not pass');
    });

    it('Should allow passwords that does not match password in passwords list', function () {
      assert.strictEqual(checker.check('abcdef123_-'), true, 'Password "abcdef123_-" should pass');
    });
  });


  describe('Disallowed words in password rules', function () {
    before(function() { checker.disallowWords(true, true); });
    after(function() { checker.disallowWords(false); });

    it('Should disallow passwords that has word(s) from words list', function () {
      assert.notEqual(checker.check('_-this-_'), true, 'Password "_-this-_" should not pass');
      checker.disallowWords(true, true, 2);
      assert.notEqual(checker.check('_-the-_'), true, 'Password "_-the-_" should not pass');
      checker.disallowWords(true, true);
    });

    it('Should allow passwords that does not have word(s) from words list', function () {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed names in password rules', function () {
    before(function() { checker.disallowNames(true, true); });
    after(function() { checker.disallowNames(false); });

    it('Should disallow passwords that has name(s) from names list', function () {
      assert.notEqual(checker.check('_-Aaban-_'), true, 'Password "Aaban" should not pass');
    });

    it('Should allow passwords that does not have name(s) from names list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords in password rules', function () {
    before(function() { checker.disallowPasswords(true, true); });
    after(function() { checker.disallowPasswords(false); });

    it('Should disallow passwords that has password(s) from passwords list', function () {
      assert.notEqual(checker.check('_-password-_'), true, 'Password "_-password-_" should not pass');
    });

    it('Should allow passwords that does not have password(s) from passwords list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });
});


describe('Check against custom lists of words, names and passwords', function () {
  before(function() {
    checker.disallowed_words = ['some', 'Others'];
    checker.disallowed_names = ['Dan', 'joe'];
    checker.disallowed_passwords = ['ABCDEF', 'hijklm'];
  });

  describe('Disallowed words as password rules', function () {
    before(function() { checker.disallowWords(true); });
    after(function() { checker.disallowWords(false); });

    it('Should disallow passwords that matches word in words list', function () {
      assert.notEqual(checker.check('Some'), true, 'Password "Some" should not pass');
      assert.notEqual(checker.check('others'), true, 'Password "others" should not pass');
    });

    it('Should allow passwords that does not match word in words list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed names as password rules', function () {
    before(function() { checker.disallowNames(true); });
    after(function() { checker.disallowNames(false); });

    it('Should disallow passwords that matches name in names list', function () {
      assert.notEqual(checker.check('dan'), true, 'Password "dan" should not pass');
      assert.notEqual(checker.check('Joe'), true, 'Password "Joe" should not pass');
    });

    it('Should allow passwords that does not match name in names list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords as password rules', function () {
    before(function() { checker.disallowPasswords(true); });
    after(function() { checker.disallowPasswords(false); });

    it('Should disallow passwords that matches password in passwords list', function () {
      assert.notEqual(checker.check('abcdef'), true, 'Password "abcdef" should not pass');
      assert.notEqual(checker.check('HIJKLM'), true, 'Password "HIJKLM" should not pass');
    });

    it('Should allow passwords that does not match password in passwords list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed words in password rules', function () {
    before(function() { checker.disallowWords(true, true); });
    after(function() { checker.disallowWords(false); });

    it('Should disallow passwords that has word(s) from words list', function () {
      assert.notEqual(checker.check('_-Some-_'), true, 'Password "_-Some-_" should not pass');
      assert.notEqual(checker.check('_-others-_'), true, 'Password "_-others-_" should not pass');
    });

    it('Should allow passwords that does not have word(s) from words list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed names in password rules', function () {
    before(function() { checker.disallowNames(true, true, 3); });
    after(function() { checker.disallowNames(false); });

    it('Should disallow passwords that has name(s) from names list', function () {
      assert.notEqual(checker.check('_-dan-_'), true, 'Password "_-dan-_" should not pass');
      assert.notEqual(checker.check('_-Joe-_'), true, 'Password "_-Joe-_" should not pass');
    });

    it('Should allow passwords that does not have name(s) from names list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords in password rules', function () {
    before(function() { checker.disallowPasswords(true, true); });
    after(function() { checker.disallowPasswords(false); });

    it('Should disallow passwords that has password(s) from passwords list', function () {
      assert.notEqual(checker.check('_-abcdef-_'), true, 'Password "_-abcdef-_" should not pass');
      assert.notEqual(checker.check('_-HIJKLM-_'), true, 'Password "_-HIJKLM-_" should not pass');
    });

    it('Should allow passwords that does not have password(s) from passwords list', function () {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });
});

