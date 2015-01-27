var trees = require('./lib/trees.mod.js');

var words = require('./lib/norvig-10000.mod.js');
var names = require('./lib/all-names.mod.js');
var passwords = require('./lib/passwords-10000.mod.js');

var PasswordChecker = function() {
  var self = this;

  this.errors = [];
  this.password = null;

  this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  this.numbers = "0123456789";
  this.symbols = "_-!\"?$%^&*()+={}[]:;@'~#|<>,.?\\/ ";
  this.words = words;
  this.names = names;
  this.passwords = passwords;
  this.words_tree = trees.arrayToTree(this.words, true, 3);
  this.names_tree = trees.arrayToTree(this.names, true, 3);
  this.passwords_tree = trees.arrayToTree(this.passwords, true, 3);
  this.min_length = 8;
  this.max_length = 0;

  Object.defineProperties(this, {
    'disallowed_words': {
      set: function(words) {
        self.words = words;
        for(var i in self.words) {
          self.words[i] = self.words[i].toLowerCase()
        }
        self.words_tree = trees.arrayToTree(words, true, 3);
      }
    },
    'disallowed_names': {
      set: function(names) {
        self.names = names;
        for(var i in self.names) {
          self.names[i] = self.names[i].toLowerCase()
        }
        self.names_tree = trees.arrayToTree(names, true, 3);
      }
    },
    'disallowed_passwords': {
      set: function(passwords) {
        self.passwords = passwords;
        for(var i in self.passwords) {
          self.passwords[i] = self.passwords[i].toLowerCase()
        }
        self.passwords_tree = trees.arrayToTree(passwords, true, 3);
      }
    }
  });

  // Currently set rules
  this.rules = {};
};
module.exports = PasswordChecker;

PasswordChecker.prototype.check = function(password, cb) {
  this.errors = [];
  this.password = password;

  if(this.min_length) {
    this.rules.min_length = this.checkMinLength.bind(this);
  } else delete this.rules.min_length;

  if(this.max_length) {
    this.rules.max_length = this.checkMaxLength.bind(this);
  } else delete this.rules.max_length;

  for(var i in this.rules) {
    var err = this.rules[i]();
    if(err) {
      this.errors.push(err);
      this.rules[i].failed = false;

    } else {
      this.rules[i].failed = true;
    }
  }

  if(cb) cb(this.errors.length ? this.errors : null);
  return this.errors.length ? this.errors : null;
};


/*************************************
 * Start of settings for the checker *
 *************************************/

/**
 * Should check that the password has letters in it?
 * @param  {boolean} active true|false
 */
PasswordChecker.prototype.requireLetters = function(active) {
  if(active) this.rules.require_letters = this.checkLetters.bind(this);
  else delete this.rules.require_letters;
};

/**
 * Should check that the password has numbers in it?
 * @param  {boolean} active true|false
 */
PasswordChecker.prototype.requireNumbers = function(active) {
  if(active) this.rules.require_numbers = this.checkNumbers.bind(this);
  else delete this.rules.require_numbers;
};

/**
 * Should check that the password has symbols in it?
 * @param  {boolean} active true|false
 */
PasswordChecker.prototype.requireSymbols = function(active) {
  if(active) this.rules.require_symbols = this.checkSymbols.bind(this);
  else delete this.rules.require_symbols;
};

/**
 * Should check that the password has numbers OR symbols in it?
 * @param  {boolean} active true|false
 */
PasswordChecker.prototype.requireNumbersOrSymbols = function(active) {
  if(active) this.rules.require_numbers_or_symbols = this.checkNumbersOrSymbols.bind(this);
  else delete this.rules.require_numbers_or_symbols;
};

/**
 * Check the password against the names list
 * @param  {boolean} active     true|false
 * @param  {boolean} in_password also check if the words are IN the password
 * @param  {number} len minimum length of words to check for if in_password == true
 */
PasswordChecker.prototype.disallowNames = function(active, in_password, len) {
  if(active) this.rules.disallow_names = this.checkNames.bind(this, !!in_password, len);
  else delete this.rules.disallow_names;
};

/**
 * Check the password against the words list
 * @param  {boolean} active     true|false
 * @param  {boolean} in_password also check if the words are IN the password
 * @param  {number} len minimum length of words to check for if in_password == true
 */
PasswordChecker.prototype.disallowWords = function(active, in_password, len) {
  if(active) this.rules.disallow_words = this.checkWords.bind(this, !!in_password, len);
  else delete this.rules.disallow_words;
};

/**
 * Check the password against the passwords list
 * @param  {boolean} active     true|false
 * @param  {boolean} in_password also check if the words are IN the password
 * @param  {number} len minimum length of words to check for if in_password == true
 */
PasswordChecker.prototype.disallowPasswords = function(active, in_password, len) {
  len = (typeof len === 'undefined') ? len : 4;
  if(active) this.rules.disallow_passwords = this.checkPasswords.bind(this, !!in_password, len);
  else delete this.rules.disallow_passwords;
};
/***********************************
 * End of settings for the checker *
 ***********************************/


/**************************
 * Start of check methods *
 **************************/
/**
 * Check if the password length is >= min_length
 * @return {Error} if the length is too short
 */
PasswordChecker.prototype.checkMinLength = function() {
  if(this.min_length && this.password.length < this.min_length) {
    return new Error('The password is too short');
  }
};

/**
 * Check if the password length is <= max_length
 * @return {Error} if the length is too long
 */
PasswordChecker.prototype.checkMaxLength = function() {
  if(this.max_length && this.password.length > this.max_length) {
    return new Error('The password is too long');
  }
};

/**
 * Check that the password has letters
 * @return {Error} if no letters was found
 */
PasswordChecker.prototype.checkLetters = function() {
  var regex = new RegExp('['+this.allowed_letters+']');
  if(!regex.test(this.password)) {
    return new Error('No letters found');
  }
};

/**
 * Check that the password has numbers
 * @return {Error} if no numbers was found
 */
PasswordChecker.prototype.checkNumbers = function() {
  var regex = new RegExp('['+this.allowed_numbers+']');
  if(!regex.test(this.password)) {
    return new Error('No numbers found');
  }
};

/**
 * Check that the password has symbols
 * @return {Error} if no symbols was found
 */
PasswordChecker.prototype.checkSymbols = function() {
  var regex = new RegExp('['+this.allowed_symbols+']');
  if(!regex.test(this.password)) {
    return new Error('No symbols found');
  }
};

/**
 * Check that the password has numbers and/or symbols
 * @return {Error} if no numbers and/or symbols was found
 */
PasswordChecker.prototype.checkNumbersOrSymbols = function() {
  var regexNumbers = new RegExp('['+this.allowed_numbers+']');
  var regexSymbols = new RegExp('['+this.allowed_symbols+']');
  if(!regexNumbers.test(this.password) && !regexSymbols.test(this.password)) {
    return new Error('No numbers or symbols found');
  }
};

/**
 * Check if password is a name from the disallowed names list
 * @param  {boolean} in_password Also check if names are in the password
 * @param  {number} min_word_length minimum length of words to check for if in_password == true
 * @return {Error} if any matches was found
 */
PasswordChecker.prototype.checkNames = function(in_password, min_word_length) {
  if(in_password && this.hasWordInList(this.names, min_word_length)) {
    return new Error('Password includes name from disallowed list');
  } else if(this.wordInList(this.names_tree)) {
    return new Error('Password is in disallowed names list');
  }
};

/**
 * Check if password is a word from the disallowed words list
 * @param  {boolean} in_password Also check if words are in the password
 * @param  {number} min_word_length minimum length of words to check for if in_password == true
 * @return {Error} if any matches was found
 */
PasswordChecker.prototype.checkWords = function(in_password, min_word_length) {
  if(in_password && this.hasWordInList(this.words, min_word_length)) {
    return new Error('Password includes word from disallowed list');
  } else if(this.wordInList(this.words_tree)) {
    return new Error('Password is in disallowed words list');
  }
};

/**
 * Check if password is a password from the disallowed passwords list
 * @param  {boolean} in_password Also check if passwords are in the password
 * @param  {number} min_word_length minimum length of words to check for if in_password == true
 * @return {Error} if any matches was found
 */
PasswordChecker.prototype.checkPasswords = function(in_password, min_word_length) {
  if(in_password && this.hasWordInList(this.passwords, min_word_length)) {
    return new Error('Password includes password from disallowed list');
  } else if(this.wordInList(this.passwords_tree)) {
    return new Error('Password is in disallowed passwords list');
  }
};

/************************
 * End of check methods *
 ************************/

/**
 * Check if password is in a list
 * @param  {array}  list The list to check the password against
 * @param  {number}  min_word_length [4] Only check words of this length
 * @return {Boolean}      true if in list, false if not in list
 */
PasswordChecker.prototype.hasWordInList = function(list, min_word_length) {
  min_word_length = (typeof min_word_length !== 'undefined') ? min_word_length : 4;
  var str = this.password.toLowerCase();
  for(var i in list) {
    if(list[i].length >= min_word_length && str.indexOf(list[i]) !== -1) {
      return true;
    }
  }
  return false;
};

/**
 * Check if password is in a list
 * @param  {words list}  list_tree The list tree to check the password against
 * @return {Boolean}      true if in list, false if not in list
 */
PasswordChecker.prototype.wordInList = function(list_tree) {
  var str = this.password.toLowerCase();
  if(trees.inTree(str, list_tree)) return true;
  return false;
};
