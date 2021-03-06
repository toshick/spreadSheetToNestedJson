import fs from 'fs';
import { getNestedJson } from '@/index';
import { spreadSheetData } from '@/mock/mockdata';

describe('getNestedJson（スプレッドシートからのjsonを入れ子jsonに変換する）', () => {
  it('should be nested json', () => {
    const nested = getNestedJson({ rows: spreadSheetData });

    expect(JSON.stringify(nested)).toBe(
      '[{"title":"title","children":[{"title":"section1","children":[{"title":"item1","children":[],"celldata":[{"dataA":"A-1","dataB":"B-1","dataC":"C-1"},{"dataA":"A-2","dataB":"B-2","dataC":"C-2"}]},{"title":"item2","children":[],"celldata":[{"dataA":"A-3","dataB":"B-3","dataC":"C-3"},{"dataA":"A-4","dataB":"B-4","dataC":"C-4"}]}],"celldata":[]},{"title":"section2","children":[{"title":"item1","children":[],"celldata":[{"dataA":"sec2-A-1","dataB":"sec2-B-1","dataC":"sec2-C-1"},{"dataA":"sec2-A-2","dataB":"sec2-B-2","dataC":"sec2-C-2"},{"dataA":"sec2-A-3","dataB":"sec2-B-3","dataC":"sec2-C-3"}]}],"celldata":[]}],"celldata":[]},{"title":"title02","children":[{"title":"section1","children":[{"title":"item1","children":[],"celldata":[{"dataA":"A2-1","dataB":"B2-1","dataC":"C2-1"},{"dataA":"A2-2","dataB":"B2-2","dataC":"C2-2"}]},{"title":"item2","children":[],"celldata":[{"dataA":"item2-A","dataB":"item2-B","dataC":"item2-C"}]}],"celldata":[]}],"celldata":[]}]',
    );
  });
  it('should work store callback', () => {
    const nested = getNestedJson({
      rows: spreadSheetData,
      onStore: (key: string, str: string) => {
        if (key === 'dataA') {
          return str.trim().replace(/A/g, 'AAA');
        }
        return str;
      },
    });

    expect(JSON.stringify(nested)).toBe(
      '[{"title":"title","children":[{"title":"section1","children":[{"title":"item1","children":[],"celldata":[{"dataA":"AAA-1","dataB":"B-1","dataC":"C-1"},{"dataA":"AAA-2","dataB":"B-2","dataC":"C-2"}]},{"title":"item2","children":[],"celldata":[{"dataA":"AAA-3","dataB":"B-3","dataC":"C-3"},{"dataA":"AAA-4","dataB":"B-4","dataC":"C-4"}]}],"celldata":[]},{"title":"section2","children":[{"title":"item1","children":[],"celldata":[{"dataA":"sec2-AAA-1","dataB":"sec2-B-1","dataC":"sec2-C-1"},{"dataA":"sec2-AAA-2","dataB":"sec2-B-2","dataC":"sec2-C-2"},{"dataA":"sec2-AAA-3","dataB":"sec2-B-3","dataC":"sec2-C-3"}]}],"celldata":[]}],"celldata":[]},{"title":"title02","children":[{"title":"section1","children":[{"title":"item1","children":[],"celldata":[{"dataA":"AAA2-1","dataB":"B2-1","dataC":"C2-1"},{"dataA":"AAA2-2","dataB":"B2-2","dataC":"C2-2"}]},{"title":"item2","children":[],"celldata":[{"dataA":"item2-AAA","dataB":"item2-B","dataC":"item2-C"}]}],"celldata":[]}],"celldata":[]}]',
    );
  });
});

describe.skip('Debug用', () => {
  it('debug', () => {
    const nested = getNestedJson({ rows: spreadSheetData });
    console.log(JSON.stringify(nested));
    fs.writeFileSync('../debug.json', JSON.stringify(nested));
  });
});
