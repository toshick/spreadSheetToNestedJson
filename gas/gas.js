const SPREAD_SHEET_ID = '';

/**
 * 全てのシートからデータ取得
 */
function getDataViewAll() {
  let ret = [];
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  for (let i = 0; i < sheets.length; i++) {
    // シートのIDと名前
    const sheetName = sheets[i].getSheetName();
    const data = getData(sheetName);
    ret = ret.concat(data);
  }
  return ret;
}

/**
 * 指定シートのデータ取得
 */
function getData(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREAD_SHEET_ID).getSheetByName(
    sheetName,
  );
  const rows = sheet.getDataRange().getValues();
  // 一列目はキー
  const keys = rows.splice(0, 1)[0];

  return (
    rows
      // 空の列はスキップ
      .filter(function (row) {
        const cont = [];
        row.forEach(function (item) {
          if (item) cont.push(item);
        });
        return cont.length > 0;
      })
      .map(function (row) {
        const obj = {};
        row.map(function (item, index) {
          obj[keys[index]] = encodeURI(item);
        });
        return obj;
      })
  );
}

/**
 * getによりデータ取得する
 */
function doGet() {
  const data = getDataViewAll();
  return ContentService.createTextOutput(
    JSON.stringify(data, null, 2),
  ).setMimeType(ContentService.MimeType.JSON);
}
