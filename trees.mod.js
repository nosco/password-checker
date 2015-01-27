exports.arrayToTree = function(arr, lowerCase, len) {
  lowerCase = !!lowerCase;
  len = len || 1;

  var tree = {};

  for(var i in arr) {
    var val = arr[i];
    if(len && val.length < len) continue;
    if(lowerCase) val = val.toLowerCase();
    val += '$';

    var chars = val.split('');

    var treeRef = tree;

    for(var c in chars) {
      var chr = chars[c];
      if(!treeRef[chr]) treeRef[chr] = {};
      treeRef = treeRef[chr];
    }
  }

  return tree;
};

exports.inTree = function(name, tree) {
  var chars = name.split('');
  var treeRef = tree;
  for(var i=0 ; i < name.length ; i++) {
    if(!treeRef[ name[i] ]) return false;
    treeRef = treeRef[ name[i] ];
  }
  return !!(treeRef['$'] !== null);
};
