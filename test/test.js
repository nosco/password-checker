var assert = require('assert');
var Checker = require('../');

describe('Default rules', function() {
  it('Should allow anything with basic settings', function() {
    var checker = new Checker();

    assert.strictEqual(checker.check(1), true, 'Password "1" should pass');
    assert.strictEqual(checker.check('hjdksa hkj dshkjh38 j dsjjk'), true, 'Password "hjdksa hkj dshkjh38 j dsjjk" should pass');
  });
});


describe('Length rules', function() {
  var checker = new Checker();

  before(function() {
    checker.min_length = 8;
    checker.max_length = 12;
  });


  it('Should not allow too short passwords', function() {
    assert.strictEqual(checker.check('short'), false, 'Password "short" should not pass');
  });

  it('Should not allow too long passwords', function() {
    assert.strictEqual(checker.check('way too long to pass'), false, 'Password "way too long to pass" should not pass');
  });

  it('Should allow correct length passwords', function() {
    assert.strictEqual(checker.check('12345678'), true, 'Password "12345678" should pass');
    assert.strictEqual(checker.check('0123456789ab'), true, 'Password "0123456789ab" should pass');
  });
});


describe('Check against default numbers, letters and symbols', function() {
  var checker = new Checker();

  describe('Required letters rule', function() {
    it('Should fail when missing letters', function() {
      checker.requireLetters(true);
      assert.strictEqual(checker.check('123456789'), false, 'Password "123456789" should not pass');
      checker.requireLetters(false);
    });

    it('Should succeed when having letters', function() {
      checker.requireLetters(true);
      assert.strictEqual(checker.check('password'), true, 'Password "password" should pass');
      checker.requireLetters(false);
    });
  });

  describe('Required numbers rule', function() {
    it('Should fail when missing numbers', function() {
      checker.requireNumbers(true);
      assert.strictEqual(checker.check('password'), false, 'Password "password" should not pass');
      checker.requireNumbers(false);
    });

    it('Should succeed when having numbers', function() {
      checker.requireNumbers(true);
      assert.strictEqual(checker.check('123456789'), true, 'Password "123456789" should pass');
      checker.requireNumbers(false);
    });
  });

  describe('Required symbols rule', function() {
    it('Should fail when missing symbols', function() {
      checker.requireSymbols(true);
      assert.strictEqual(checker.check('abc123'), false, 'Password "abc123" should not pass');
      checker.requireSymbols(false);
    });

    it('Should succeed when having symbols', function() {
      checker.requireSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      checker.requireSymbols(false);
    });
  });

  describe('Required numbers and/or symbols rule', function() {
    it('Should fail when missing numbers and/or symbols', function() {
      checker.requireNumbersOrSymbols(true);
      assert.strictEqual(checker.check('abcdef'), false, 'Password "abcdef" should not pass');
      checker.requireNumbersOrSymbols(false);
    });

    it('Should succeed when having numbers and/or symbols', function() {
      checker.requireNumbersOrSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      assert.strictEqual(checker.check('abc123'), true, 'Password "abc123" should pass');
      assert.strictEqual(checker.check('abc_'), true, 'Password "abc_" should pass');
      checker.requireNumbersOrSymbols(false);
    });
  });
});


describe('Check allowed numbers, letters and symbols', function() {
  describe('Check allowed letters', function() {
    var checker = new Checker();
    before(function() {
      checker.allowed_letters = 'abcdefghijklmnopqrstuvwxyz';
    });

    it('Should fail when having letter(s) NOT in the allowed_letters', function() {
      checker.checkLetters(true);
      assert.strictEqual(checker.check('123456789IJ'), false, 'Password "123456789IJ" should not pass');
      checker.checkLetters(false);
    });

    it('Should succeed when having letter(s) present in the allowed_letters', function() {
      checker.checkLetters(true);
      assert.strictEqual(checker.check('password'), true, 'Password "password123" should pass');
      checker.checkLetters(false);
    });
  });

  describe('Check allowed numbers', function() {
    var checker = new Checker();
    before(function() {
      checker.allowed_numbers = '1';
    });

    it('Should fail when having number(s) NOT in the allowed_numbers', function() {
      checker.checkNumbers(true);
      assert.strictEqual(checker.check('123456789IJ'), false, 'Password "123456789IJ" should not pass');
      checker.checkNumbers(false);
    });

    it('Should succeed when having number(s) present in the allowed_numbers', function() {
      checker.checkNumbers(true);
      assert.strictEqual(checker.check('password111'), true, 'Password "password111" should pass');
      checker.checkNumbers(false);
    });
  });

  describe('Check allowed symbols', function() {
    var checker = new Checker();
    before(function() {
      checker.allowed_symbols = '-';
    });

    it('Should fail when having symbols(s) NOT in the allowed_symbols', function() {
      checker.checkSymbols(true);
      assert.strictEqual(checker.check('123456789IJ.'), false, 'Password "123456789IJ." should not pass');
      checker.checkSymbols(false);
    });

    it('Should succeed when having symbol(s) present in the allowed_symbols', function() {
      checker.checkSymbols(true);
      assert.strictEqual(checker.check('password-123'), true, 'Password "password-123" should pass');
      checker.checkSymbols(false);
    });
  });

  describe('Ensure empty lists can be used', function() {
    var checker = new Checker();
    before(function() {
      checker.allowed_symbols = '';
    });

    it('Should fail when having symbols(s) NOT in the empty allowed_symbols', function() {
      checker.checkSymbols(true);
      assert.strictEqual(checker.check('123456789IJ.'), false, 'Password "123456789IJ." should not pass');
      checker.checkSymbols(false);
    });

    it('Should succeed when not having symbols as the allowed_symbols is empty', function() {
      checker.checkSymbols(true);
      assert.strictEqual(checker.check('password123ABC'), true, 'Password "password123ABC" should pass');
      checker.checkSymbols(false);
    });
  });

});


describe('Check against custom numbers, letters and symbols', function() {
  var checker = new Checker();
  before(function() {
    checker.allowed_letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz'; // Without IOijlo
    checker.allowed_numbers = '23456789'; // Without 01
    checker.allowed_symbols = "_-";
  });

  describe('Required letters rule', function() {
    it('Should fail when missing allowed letters', function() {
      checker.requireLetters(true);
      assert.strictEqual(checker.check('123456789ij'), false, 'Password "123456789ij" should not pass');
      checker.requireLetters(false);
    });

    it('Should succeed when having letters', function() {
      checker.requireLetters(true);
      assert.strictEqual(checker.check('password'), true, 'Password "password" should pass');
      checker.requireLetters(false);
    });
  });

  describe('Required numbers rule', function() {
    it('Should fail when missing numbers', function() {
      checker.requireNumbers(true);
      assert.strictEqual(checker.check('password'), false, 'Password "password" should not pass');
      checker.requireNumbers(false);
    });

    it('Should succeed when having numbers', function() {
      checker.requireNumbers(true);
      assert.strictEqual(checker.check('123456789'), true, 'Password "123456789" should pass');
      checker.requireNumbers(false);
    });
  });

  describe('Required symbols rule', function() {
    it('Should fail when missing symbols', function() {
      checker.requireSymbols(true);
      assert.strictEqual(checker.check('abc123'), false, 'Password "abc123" should not pass');
      checker.requireSymbols(false);
    });

    it('Should succeed when having symbols', function() {
      checker.requireSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      checker.requireSymbols(false);
    });
  });

  describe('Required numbers and/or symbols rule', function() {
    it('Should fail when missing numbers and/or symbols', function() {
      checker.requireNumbersOrSymbols(true);
      assert.strictEqual(checker.check('abcdef'), false, 'Password "abcdef" should not pass');
      checker.requireNumbersOrSymbols(false);
    });

    it('Should succeed when having numbers and/or symbols', function() {
      checker.requireNumbersOrSymbols(true);
      assert.strictEqual(checker.check('abc_123'), true, 'Password "abc_123" should pass');
      assert.strictEqual(checker.check('abc123'), true, 'Password "abc123" should pass');
      assert.strictEqual(checker.check('abc_'), true, 'Password "abc_" should pass');
      checker.requireNumbersOrSymbols(false);
    });
  });
});


describe('Check against default lists of words, names and passwords', function() {
  describe('Disallowed words as password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowWords(true);
    });

    it('Should disallow passwords that matches word in words list', function() {
      assert.strictEqual(checker.check('this'), false, 'Password "this" should not pass');
    });

    it('Should allow passwords that does not match word in words list', function() {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed names as password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowNames(true);
    });

    it('Should disallow passwords that matches name in names list', function() {
      assert.strictEqual(checker.check('Aaden'), false, 'Password "Aaden" should not pass');
    });

    it('Should allow passwords that does not match name in names list', function() {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed common passwords as password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowPasswords(true);
    });

    it('Should disallow passwords that matches password in passwords list', function() {
      assert.strictEqual(checker.check('password'), false, 'Password "password" should not pass');
    });

    it('Should allow passwords that does not match password in passwords list', function() {
      assert.strictEqual(checker.check('abcdef123_-'), true, 'Password "abcdef123_-" should pass');
    });
  });


  describe('Disallowed words in password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowWords(true, true);
    });

    it('Should disallow passwords that has word(s) from words list', function() {
      assert.strictEqual(checker.check('_-this-_'), false, 'Password "_-this-_" should not pass');
      checker.disallowWords(true, true, 2);
      assert.strictEqual(checker.check('_-the-_'), false, 'Password "_-the-_" should not pass');
      checker.disallowWords(true, true);
    });

    it('Should allow passwords that does not have word(s) from words list', function() {
      assert.strictEqual(checker.check('abcdefghijkl'), true, 'Password "abcdefghijkl" should pass');
    });
  });

  describe('Disallowed names in password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowNames(true, true);
    });

    it('Should disallow passwords that has name(s) from names list', function() {
      assert.strictEqual(checker.check('_-Aaban-_'), false, 'Password "Aaban" should not pass');
    });

    it('Should allow passwords that does not have name(s) from names list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords in password rules', function() {
    var checker = new Checker();
    before(function() {
      checker.disallowPasswords(true, true);
    });

    it('Should disallow passwords that has password(s) from passwords list', function() {
      assert.strictEqual(checker.check('_-password-_'), false, 'Password "_-password-_" should not pass');
    });

    it('Should allow passwords that does not have password(s) from passwords list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });
});


describe('Check against custom lists of words, names and passwords', function() {
  var checker = new Checker();
  before(function() {
    checker.disallowed_words = ['some', 'Others'];
    checker.disallowed_names = ['Dan', 'joe'];
    checker.disallowed_passwords = ['ABCDEF', 'hijklm'];
  });

  describe('Disallowed words as password rules', function() {
    before(function() {
      checker.disallowWords(true);
    });
    after(function() {
      checker.disallowWords(false);
    });

    it('Should disallow passwords that matches word in words list', function() {
      assert.strictEqual(checker.check('Some'), false, 'Password "Some" should not pass');
      assert.strictEqual(checker.check('others'), false, 'Password "others" should not pass');
    });

    it('Should allow passwords that does not match word in words list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed names as password rules', function() {
    before(function() {
      checker.disallowNames(true);
    });
    after(function() {
      checker.disallowNames(false);
    });

    it('Should disallow passwords that matches name in names list', function() {
      assert.strictEqual(checker.check('dan'), false, 'Password "dan" should not pass');
      assert.strictEqual(checker.check('Joe'), false, 'Password "Joe" should not pass');
    });

    it('Should allow passwords that does not match name in names list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords as password rules', function() {
    before(function() {
      checker.disallowPasswords(true);
    });
    after(function() {
      checker.disallowPasswords(false);
    });

    it('Should disallow passwords that matches password in passwords list', function() {
      assert.strictEqual(checker.check('abcdef'), false, 'Password "abcdef" should not pass');
      assert.strictEqual(checker.check('HIJKLM'), false, 'Password "HIJKLM" should not pass');
    });

    it('Should allow passwords that does not match password in passwords list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed words in password rules', function() {
    before(function() {
      checker.disallowWords(true, true);
    });
    after(function() {
      checker.disallowWords(false);
    });

    it('Should disallow passwords that has word(s) from words list', function() {
      assert.strictEqual(checker.check('_-Some-_'), false, 'Password "_-Some-_" should not pass');
      assert.strictEqual(checker.check('_-others-_'), false, 'Password "_-others-_" should not pass');
    });

    it('Should allow passwords that does not have word(s) from words list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed names in password rules', function() {
    before(function() {
      checker.disallowNames(true, true, 3);
    });
    after(function() {
      checker.disallowNames(false);
    });

    it('Should disallow passwords that has name(s) from names list', function() {
      assert.strictEqual(checker.check('_-dan-_'), false, 'Password "_-dan-_" should not pass');
      assert.strictEqual(checker.check('_-Joe-_'), false, 'Password "_-Joe-_" should not pass');
    });

    it('Should allow passwords that does not have name(s) from names list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });

  describe('Disallowed common passwords in password rules', function() {
    before(function() {
      checker.disallowPasswords(true, true);
    });
    after(function() {
      checker.disallowPasswords(false);
    });

    it('Should disallow passwords that has password(s) from passwords list', function() {
      assert.strictEqual(checker.check('_-abcdef-_'), false, 'Password "_-abcdef-_" should not pass');
      assert.strictEqual(checker.check('_-HIJKLM-_'), false, 'Password "_-HIJKLM-_" should not pass');
    });

    it('Should allow passwords that does not have password(s) from passwords list', function() {
      assert.strictEqual(checker.check('_ab132-$!'), true, 'Password "_ab132-$!" should pass');
    });
  });
});

