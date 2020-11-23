/**
 * json keyにこのキーが含まれている場合、
 * 入れ子のディレクトリとして処理する
 */
const blockRowKey = 'block';

// テキストを格納する時のコールバック
export type StoreCallback = (key: string, str: string) => void;
// GASから出力されるソースデータjson（key: スプレッドシートの1列目のキー）
export type SpreadSheetSource = { [key: string]: string };
// dataセルのデータ
export type SpreadSheetCellData = { [key: string]: string };

export type SpreadSheetDir = {
  title: string;
  children: SpreadSheetDir[];
  celldata: SpreadSheetCellData[];
};

/**
 * SpreadSheetSourceデータをnestした状態で返却
 */
export const getNestedJson = (
  rows: SpreadSheetSource[],
  onStore?: StoreCallback,
) => {
  const pages = splitPageData(rows, onStore);
  const d = pages.map((ary) => {
    return mergeChildren(ary).children;
  });
  return d;
};

/**
 * タイトルブロックを区別する
 * タイトルが存在する場合配列を別にする
 */
function splitPageData(
  rows: SpreadSheetSource[],
  onStore?: StoreCallback,
): SpreadSheetDir[][] {
  const ret: SpreadSheetDir[][] = [];
  let tmp: SpreadSheetDir[] = [];
  rows.forEach(function (row) {
    const obj = makeDirObj(row, onStore);
    if (!obj) return;
    if (obj.title) {
      if (tmp.length > 0) ret.push(tmp);
      tmp = [];
    }
    tmp.push(obj);
  });
  if (tmp.length > 0) ret.push(tmp);
  return ret;
}

/**
 * childrenをマージする
 */
function mergeChildren(items: SpreadSheetDir[]) {
  const ret: SpreadSheetDir = {
    title: '',
    children: [],
    celldata: [],
  };
  const children: any[] = [];
  const celldata: any[] = [];
  let tmpChildren: any[] = [];
  let tmpSentences: any[] = [];
  let currentTitle = '';
  items.forEach(function (item: SpreadSheetDir | SpreadSheetCellData) {
    const isDir = item as SpreadSheetDir;
    const mytitle = isDir?.title;
    if (mytitle) {
      if (tmpChildren && tmpChildren.length > 0) {
        const merged = mergeChildren(tmpChildren);
        merged.title = currentTitle;
        children.push(merged);
      }
      if (tmpSentences && tmpSentences.length > 0) {
        celldata.push({
          title: currentTitle,
          children: [],
          celldata: tmpSentences,
        });
      }

      tmpChildren = [];
      tmpSentences = [];
      currentTitle = mytitle;
    }

    const mycelldata = isDir?.celldata as SpreadSheetCellData[];
    if (mycelldata && mycelldata.length > 0) {
      tmpSentences = tmpSentences.concat(mycelldata);
    }

    const mychildren = isDir?.children as SpreadSheetDir[];
    if (mychildren && mychildren.length > 0) {
      tmpChildren = tmpChildren.concat(mychildren);
    }
  });

  if (tmpSentences && tmpSentences.length > 0) {
    celldata.push({
      title: currentTitle,
      children: [],
      celldata: tmpSentences,
    });
  }
  if (celldata.length > 0) {
    ret.children = celldata;
    return ret;
  }

  if (tmpChildren && tmpChildren.length > 0) {
    const merged = mergeChildren(tmpChildren);
    merged.title = currentTitle;
    children.push(merged);
  }
  ret.children = children;

  return ret;
}

/**
 * ディレクトリにchildrenとtitleを配置したオブジェクトを生成
 */
function makeDirObj(
  data: SpreadSheetSource,
  onStore?: StoreCallback,
): SpreadSheetDir | null {
  let ret: SpreadSheetDir | null = null;
  let tmp: SpreadSheetDir | null = null;
  type Key = keyof SpreadSheetSource;

  // for (let index = 0; index < keys.length; index++) {
  for (const key of Object.keys(data)) {
    const str = data[key as Key];
    const isBlock = key.includes(blockRowKey);

    if (tmp && str && !isBlock) {
      const rest: any = {};
      for (const k of Object.keys(data)) {
        if (k.includes(blockRowKey)) continue;
        const val = data[k as Key] || '';
        rest[k] = onStore ? onStore(k, val) : val;
      }
      tmp.celldata.push(rest);
      break;
    }
    const item: SpreadSheetDir = {
      title: str || '',
      children: [],
      celldata: [],
    };
    if (tmp && tmp.children) {
      const ary = tmp.children as SpreadSheetDir[];
      ary.push(item);
    }
    if (!ret) {
      ret = item;
    }

    tmp = item;
  }
  return ret;
}
