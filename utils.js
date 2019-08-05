
// pick({ a: 1, b: '2', c: 3 }, ['a', 'c']); // { 'a': 1, 'c': 3 }
const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});

// omit({ a: 1, b: '2', c: 3 }, ['a']); // { 'b': 2, 'c': 3 }
const omit = (obj, arr) =>
  Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});

const isArray = (item) => (!!item) && (item.constructor === Array);

const isObject = (item) => (!!item) && (item.constructor === Object);

const wait = (ms) => {
  const start = new Date().getTime();
  let end = start;
  const total = start + ms;
  while(end < total) {
    end = new Date().getTime();
  }
};

// chunkArray([1,2,3,4], 2) ;  // [[1,2][3,4]]

const chunkArray = (myArray, chunkSize) => {
  const results = [];
  while (myArray.length) {
      results.push(myArray.splice(0, chunkSize));
  }
  return results;
};


// fromCamelCase('someDatabaseFieldName', ' '); // 'some database field name'
// fromCamelCase('someLabelThatNeedsToBeCamelized', '-'); // 'some-label-that-needs-to-be-camelized'
// fromCamelCase('someJavascriptProperty', '_'); // 'some_javascript_property'

const fromCamelCase = (str, separator = '_') =>
  str
    .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    .toLowerCase();


const isBase64 = (strBase) => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(strBase);
};

const randomNumber = () => {
  const max = new Date().getTime();
  const min = Math.floor(max/1000);
  return Math.floor(Math.random()*(max-min+1)+min)
};


const removeUnicode = (str, operator) => {
  let textRemove = str;
  textRemove = textRemove.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  textRemove = textRemove.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  textRemove = textRemove.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  textRemove = textRemove.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  textRemove = textRemove.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  textRemove = textRemove.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  textRemove = textRemove.replace(/đ/g, "d");

  textRemove = textRemove.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  textRemove = textRemove.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  textRemove = textRemove.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  textRemove = textRemove.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  textRemove = textRemove.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  textRemove = textRemove.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  textRemove = textRemove.replace(/Đ/g, "D");

  if (operator) {
    textRemove= textRemove.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, operator);
    textRemove = textRemove.replace(/-+-/g, operator);
  }
  textRemove = textRemove.replace(/^\-+|\-+$/g, "");
  return textRemove;
};

module.exports = {
  pick, wait, chunkArray,
  isArray, isObject, omit,
  fromCamelCase, isBase64,
  randomNumber, removeUnicode
};