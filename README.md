# password-checker

### How it works
The checker works out of the box, but will accept any password.

You need to enable rules and change the words lists, if you don't want to use the defaults.

## The API

#### Initialize
```JavaScript
var Checker = require('password-checker');
var checker = new Checker();
```

## Checks that can be enabled

#### Minimum and maximum lengths
```JavaScript
// Change minimum length required
// Default is: 0, which is effectively disabling of the check
checker.min_length = 8;

// Change maximum length required
// Default is: 0, which is effectively disabling of the check
checker.max_length = 120;
```

#### Require letters, numbers and symbols
```JavaScript
checker.requireLetters(true);
checker.requireNumbers(true);
checker.requireSymbols(true);
```

#### Require letters + numbers and/or symbols
```JavaScript
checker.requireLetters(true);
checker.requireNumbersOrSymbols(true);
```

#### Require ONLY the letters, numbers and symbols set in the allowed_x lists
```JavaScript
checker.checkLetters(true);
checker.checkNumbers(true);
checker.checkSymbols(true);
```

#### Disallow passwords containing words that are found in disallow list(s)
Names, words and passwords checks works the same way.
They can tak up to 3 parameters.

```JavaScript
// Disallow passwords that matches a full name
checker.disallowNames(true);

// Disallow passwords that contains word(s) found in the words list
checker.disallowWords(true, true);

// Disallow passwords that contains password(s) found in the passwords list
// But limit it to passwords with 3 or more characters
checker.disallowPasswords(true, true, 3);
```

## Lists that can be modified

#### Letters, numbers and symbols
```JavaScript
// Change the letters that are allowed
// Default is: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
checker.allowed_letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';

// Default is: 0123456789
checker.allowed_numbers = '23456789';

// Default is: _- !\"?$%^&*()+={}[]:;@'~#|<>,.?\\/
checker.allowed_symbols = '_-';
```

#### Lists of words, names and passwords
The words will always be changed to lowercase and so will the actual passwords checked.
```JavaScript
checker.disallowed_words = ['some', 'Others'];
checker.disallowed_names = ['Dan', 'joe'];
checker.disallowed_passwords = ['ABCDEF', 'hijklm'];
```

## How to check and what can be gathered
Each check will return true or false.

The checker will then hold a list of errors that occurred.

A list of rules and whether they failed will also be accessible.

#### A check without errors
```JavaScript
checker.min_length = 10;
console.log(checker.check('Should work'));
// Prints:
// true

console.log(checker.errors);
// Prints:
// []

console.log(checker.rules);
// Prints:
// { min_length:
//    { name: 'min_length',
//      method: [Function],
//      error_message: null,
//      failed: false } }
```

#### A check with errors
```JavaScript
checker.min_length = 100;
console.log(checker.check('Should not work'));
// Prints:
// false

console.log(checker.errors);
// Prints:
// [ [Error: The password is too short] ]

console.log(checker.rules);
// Prints:
// { min_length:
//    { name: 'min_length',
//      method: [Function],
//      error_message: 'The password is too short',
//      failed: true } }
```

## The word lists
### Words
The words list is the first 10.000 words found in a list of 1/3 million words list.

The 1/3 million list is create by Peter Norvig who is Director of Research @ Google.

The entire list can be found here: [Natural Language Corpus Data: Beautiful Data](http://norvig.com/ngrams/) - the file is called [count_1w.txt](http://norvig.com/ngrams/count_1w.txt)

Thank you Peter Norvig!


### Names
The names list is a mashup of different sources and contains 17956 common international names:

[US Names from the US Social Security](http://www.ssa.gov/oact/babynames/limits.html)

["Given names" extracted from WikiPedia](http://en.wikipedia.org/w/api.php?action=query&continue=&list=categorymembers&cmnamespace=0&cmlimit=500&cmtitle=Category:Given_names&format=json)

[International names extracted from Baby Name Wizard](http://www.babynamewizard.com/international-names-lists-popular-names-from-around-the-world)

Thank you US Social Security, WikiPedia and Baby Name Wizard!

### Passwords

Passwords is a list of the 10.000 most used passwords according to Mark Burnett from [xato.net](http://xato.net).

You can find the list (+1 with frequency) in [this blog post by Mark Burnett](https://xato.net/passwords/more-top-worst-passwords/).

Thank you Mark Burnett!
