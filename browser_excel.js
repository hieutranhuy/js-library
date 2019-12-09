const tableToExcel = (function() {
  const uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(tableContent, name) {
    if (!tableContent) tableContent = document.getElementById(tableContent)
    const ctx = {worksheet: name || 'Worksheet', table: tableContent || tableContent.innerHTML}
    const a = document.createElement('a');
    a.href = uri + base64(format(template, ctx));
    a.download = ''+name;
    //triggering the function
    a.click();
  }
})();

const tableParserContent = (idTable) => {
  let tableText = "<table border='2px'><tr>"; //Table Intialization, CSS included
  let index = 0;
  const table = document.getElementById(idTable); // Read table using id
  const tableLength = table.rows.length || 1;
  while (index < tableLength) {
    tableText += table.rows[index].innerHTML+"</tr>";
    index +=1;
  }
  // table close
  tableText +="</table>";
  // remove value not using
  tableText = tableText.replace(/<a[^>]*>|<\/a>/g, ""); //removes links embedded in <td>
  tableText = tableText.replace(/<img[^>]*>/gi,"");  //removes images embeded in <td>
  tableText = tableText.replace(/<input[^>]*>|<\/input>/gi, ""); //removes input tag elements
  return tableText;
}

const tableSaveAsExcel = (id, fileName) => {
  const tableText = tableParserContent(id);
  const userAgent = window.navigator.userAgent; //check client user agent to determine browser
  const msie = userAgent.indexOf("MSIE "); // If it is Internet Explorer user Aget will have string MSIE

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
  {
  //Since IE > 10 supports blob, check for blob support and use if we can
    if (typeof Blob !== "undefined") {
      //Bolb Data is ArrayStorage, convert to array
      tableText = [tableText];
      const blob = new Blob(tableText);
      window.navigator.msSaveBlob(blob, ''+fileName);
    } else {
    //If Blob is unsupported, create an iframe in HTML Page, and call that blank iframe
      textArea.document.open("text/html", "replace");
      textArea.document.write(tableText);
      textArea.document.close();
      textArea.focus();
      textArea.document.execCommand("SaveAs", true, fileName); 
    }
  }
//Other Browsers
  else  {
    tableToExcel(tableText, fileName);
  }
}