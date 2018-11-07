const moment = require("moment");
const store = require('nedb');
const talk = require("./talk");
/* 
now,nextEffect
0 : 忘れ,特になし
1~1000: 良い情報
-1~-1000: 悪い情報

impression
words: 記憶に残るような言葉
number: 記憶に残るような会話のナンバー、["1000-1002"]のように記述
*/

const memoryBase = JSON.parse(`{
  "now": {
    "emotion": {
      "joy": 0,
      "anger": 0,
      "sadness": 0,
      "happiness": 0
    },
    "think": {
      "yearn": 0,
      "love": 0
    }
  },
  "nextEffect": {
    "emotion": {
      "joy": 0,
      "anger": 0,
      "sadness": 0,
      "happiness": 0
    },
    "think": {
      "yearn": 0,
      "love": 0
    }
  },
  "impression": {
    "words": [],
    "number": []
  },
  "created_at": "${now = moment().unix()}"
}`);

var db = new store({
  filename: 'memory/memory.db',
  autoload: true
});

console.log(memoryBase);
console.log(talk("クラムボン"));