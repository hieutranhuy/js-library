const XLSX = require('xlsx');
const { pick } = require('./utils');
const FILE_SERIVCE = require('./files');
// using function
// const excel = excelService('excel01.xlsx')
// const arr = [{a: 1, b: 2}], colums = [{key: a, name:'A'}, {key: b, name: 'B'}];
// const string buffer = excel.bufferCreate(arr, colums);

const excelService = (fileName = '') => {
  const nameSheet = fileName || "sheet";
  const bufferCreate = (arr = [], colums = [{}]) => {
    const headerItem = colums.map(item => (item.key));
    const headerVal = colums.reduce((itemReturn, item) => {
      itemReturn[`${item.key}`] = item.name;
      return itemReturn;
    }, {});
    //  format data
    const listData = [headerVal, ...arr].map(item => pick(item, headerItem));
    //  parseExcel
    const parseData = XLSX.utils.json_to_sheet(listData, { header: headerItem, skipHeader:true });
    // crate book excel
    const wb = XLSX.utils.book_new();
    // add data book
    XLSX.utils.book_append_sheet(wb, parseData, nameSheet);
    // create buffer
    const bufferContent = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx', bookSST: false });
    return bufferContent;
  };

  const createFileToJson = (pathFolder = '', arr = [], colums = [{}]) => {
    const fileService = FILE_SERIVCE(`${pathFolder}/${fileName}`);
    const bufferAddFile = bufferCreate(arr = [], colums = [{}]);
    return fileService.write(bufferAddFile);
  };

  return {
    bufferCreate,
    createFileToJson
  }
};

module.exports = excelService;