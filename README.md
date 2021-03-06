# spreadSheetToNestedJson

- make nested json data from google spreadsheed data with specific format.
- first row is going to be json key.
- if key includes "block", that row will be directory (title and children)
- the other will be stored at "celldata" key data.

### How to use

```js
import { getNestedJson } from 'spread-sheet-to-nested-json';
const nested = getNestedJson({ rows: mockdata });
```

### Spreadsheet Sample

<img src="img/img01.png">

### is going to be this from GAS

```
{
    block1: 'title',
    block2: 'section1',
    block3: 'item1',
    dataA: 'A-1',
    dataB: 'B-1',
    dataC: 'C-1',
  },
  {
    block1: '',
    block2: '',
    block3: '',
    dataA: 'A-2',
    dataB: 'B-2',
    dataC: 'C-2',
  },
  {
    block1: '',
    block2: '',
    block3: 'item2',
    dataA: 'A-3',
    dataB: 'B-3',
    dataC: 'C-3',
  },
  {
    block1: '',
    block2: '',
    block3: '',
    dataA: 'A-4',
    dataB: 'B-4',
    dataC: 'C-4',
  },
  {
    block1: '',
    block2: 'section2',
    block3: 'item1',
    dataA: 'sec2-A-1',
    dataB: 'sec2-B-1',
    dataC: 'sec2-C-1',
  },
  {
    block1: '',
    block2: '',
    block3: '',
    dataA: 'sec2-A-2',
    dataB: 'sec2-B-2',
    dataC: 'sec2-C-2',
  },
  {
    block1: '',
    block2: '',
    block3: '',
    dataA: 'sec2-A-3',
    dataB: 'sec2-B-3',
    dataC: 'sec2-C-3',
  },
```

### is going to be this by "getNestedJson"

```
[
  {
    "title": "title",
    "children": [
      {
        "title": "section1",
        "children": [
          {
            "title": "item1",
            "children": [],
            "celldata": [
              { "dataA": "A-1", "dataB": "B-1", "dataC": "C-1" },
              { "dataA": "A-2", "dataB": "B-2", "dataC": "C-2" }
            ]
          },
          {
            "title": "item2",
            "children": [],
            "celldata": [
              { "dataA": "A-3", "dataB": "B-3", "dataC": "C-3" },
              { "dataA": "A-4", "dataB": "B-4", "dataC": "C-4" }
            ]
          }
        ],
        "celldata": []
      },
      {
        "title": "section2",
        "children": [
          {
            "title": "item1",
            "children": [],
            "celldata": [
              {
                "dataA": "sec2-A-1",
                "dataB": "sec2-B-1",
                "dataC": "sec2-C-1"
              },
              {
                "dataA": "sec2-A-2",
                "dataB": "sec2-B-2",
                "dataC": "sec2-C-2"
              },
              {
                "dataA": "sec2-A-3",
                "dataB": "sec2-B-3",
                "dataC": "sec2-C-3"
              }
            ]
          }
        ],
        "celldata": []
      }
    ],
    "celldata": []
  }
]

```
