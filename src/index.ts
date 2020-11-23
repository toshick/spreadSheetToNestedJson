import { SpreadSheetSource, SpreadSheetDirLang, SpreadSheetDir } from './types/type';

const pagedata: SpreadSheetSource[] = [
  {
    pageTitle: 'ページタイトル（タイトル）',
    sectionTitle: '会議（かいぎ）をはじめる',
    ja: 'チーム内(ない)のコミュニケーション不足(ぶそく)が、問題(もんだい)になっています。',
    en: 'The lack of communication among team members is becoming a problem.',
    who: 'タコのすけ',
  },
  {
    pageTitle: '',
    sectionTitle: '',
    ja: 'ちょっと不具合(ふぐあい)があるので、今日中(きょうじゅう)に直(なお)します。',
    en: "There are some defects, so I'll fix it by the end of the day.",
    who: '',
  },
  {
    pageTitle: '',
    sectionTitle: '',
    ja: '週末（しゅうまつ）はどうでしたか？2',
    en: 'How was your weekend?',
    who: 'タコのすけ',
  },
  {
    pageTitle: '',
    sectionTitle: 'セクションタイトル',
    ja: '今日（きょう）は寒（さむ）いよね',
    en: 'It’s cold today, isn’t it?',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: '',
    ja: 'それでははじめよう',
    en: 'Shall we get started?',
    who: 'タコのすけ',
  },
  {
    pageTitle: '',
    sectionTitle: 'セクションタイトル2',
    ja: '***さんからはじめよう',
    en: 'Let’s start with Mr.***.',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: '',
    ja: '時間（じかん）がなくなってきました',
    en: 'We’re running out of time.',
    who: 'タコのすけ',
  },
  {
    pageTitle: 'ページタイトル2',
    sectionTitle: '会議（かいぎ）をはじめる',
    ja: 'ごきげんいかが？',
    en: 'Hi everyone. How’s it going?',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: 'ページタイトル2のセクション',
    ja: '週末（しゅうまつ）はどうでしたか？',
    en: 'How was your weekend?',
    who: 'タコのすけ',
  },
  {
    pageTitle: 'ページタイトル3',
    sectionTitle: '会議（かいぎ）をはじめる',
    ja: 'ごきげんいかが？',
    en: 'Hi everyone. How’s it going?',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: 'ページタイトル2のセクション',
    ja: '週末（しゅうまつ）はどうでしたか？',
    en: 'How was your weekend?',
    who: 'タコのすけ',
  },
  {
    pageTitle: 'ページタイトル4',
    sectionTitle: '会議（かいぎ）をはじめる',
    ja: 'ごきげんいかが？',
    en: 'Hi everyone. How’s it going?',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: 'ページタイトル2のセクション',
    ja: '週末（しゅうまつ）はどうでしたか？',
    en: 'How was your weekend?',
    who: 'タコのすけ',
  },
  {
    pageTitle: 'ページタイトル5',
    sectionTitle: '会議（かいぎ）をはじめる',
    ja: 'ごきげんいかが？',
    en: 'Hi everyone. How’s it going?',
    who: 'イカ二郎',
  },
  {
    pageTitle: '',
    sectionTitle: 'ページタイトル2のセクション',
    ja: '週末（しゅうまつ）はどうでしたか？',
    en: 'How was your weekend?',
    who: 'タコのすけ',
  },
];

const sheetJson = getSheetJson(pagedata, (str: string) => {
  return str.trim().replace(/\(/g, '（').replace(/\)/g, '）');
});

console.log('sheetJson', sheetJson);
// type Key = 'pageTitle' | 'sectionTitle' | 'ja' | 'en' | 'who';
// const keys: string[] = ['pageTitle', 'sectionTitle', 'ja', 'en', 'who'];

function getSheetJson(rows: SpreadSheetSource[], storeCallback?: (str: string) => void) {
  const pages = splitPageData(rows, storeCallback);

  // console.log('pages', JSON.stringify(pages));

  const d = pages.map((ary) => {
    return mergeChildren(ary);
  });

  // console.log('ori after', JSON.stringify(d));

  return d;
}

// タイトルブロックを区別する
// タイトルが存在する場合配列を別にする
function splitPageData(rows: SpreadSheetSource[], storeCallback?: (str: string) => void): SpreadSheetDir[][] {
  const ret: SpreadSheetDir[][] = [];
  let tmp: SpreadSheetDir[] = [];
  rows.forEach(function (row) {
    const obj = makeDirObj(row, storeCallback);
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

// childrenをマージする
function mergeChildren(items: SpreadSheetDir[]) {
  const ret: SpreadSheetDir = {
    title: '',
    children: [],
    sentences: [],
  };
  const children: any[] = [];
  const sentences: any[] = [];
  let tmpChildren: any[] = [];
  let tmpSentences: any[] = [];
  let currentTitle = '';
  items.forEach(function (item: SpreadSheetDir | SpreadSheetDirLang) {
    const isDir = item as SpreadSheetDir;
    const mytitle = isDir?.title;
    if (mytitle) {
      if (tmpChildren && tmpChildren.length > 0) {
        const merged = mergeChildren(tmpChildren);
        merged.title = currentTitle;
        children.push(merged);
      }
      if (tmpSentences && tmpSentences.length > 0) {
        sentences.push({
          title: currentTitle,
          children: [],
          sentences: tmpSentences,
        });
      }

      tmpChildren = [];
      tmpSentences = [];
      currentTitle = mytitle;
    }

    const mysentences = isDir?.sentences as SpreadSheetDirLang[];
    if (mysentences && mysentences.length > 0) {
      tmpSentences = tmpSentences.concat(mysentences);
    }

    const mychildren = isDir?.children as SpreadSheetDir[];
    if (mychildren && mychildren.length > 0) {
      tmpChildren = tmpChildren.concat(mychildren);
    }
  });

  if (currentTitle) {
    ret.title = currentTitle;
  }

  if (tmpSentences && tmpSentences.length > 0) {
    sentences.push({
      title: currentTitle,
      children: [],
      sentences: tmpSentences,
    });
  }
  if (sentences.length > 0) {
    ret.children = sentences;
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

// ディレクトリにchildrenとtitleを配置したオブジェクトを生成
function makeDirObj(data: SpreadSheetSource, storeCallback?: (str: string) => void): SpreadSheetDir | null {
  let ret: SpreadSheetDir | null = null;
  let tmp: SpreadSheetDir | null = null;
  type Key = keyof SpreadSheetSource;

  // for (let index = 0; index < keys.length; index++) {
  for (const key of Object.keys(data)) {
    const str = data[key as Key];
    const isTitle = key.includes('Title');

    if (tmp && str && !isTitle) {
      const rest: any = {};
      for (const k of Object.keys(data)) {
        if (k.includes('Title')) continue;
        const val = data[k as Key] || '';
        rest[k] = storeCallback ? storeCallback(val) : val;
      }
      tmp.sentences.push(rest);
      break;
    }
    const item: SpreadSheetDir = {
      title: str || '',
      children: [],
      sentences: [],
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
