const moment = require("moment");
const store = require('nedb');
const Mastodon = require('mastodon-api');
const talk = require("./talk");
const conf = require("./config");

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
console.log(talk("ハロハロー"));

const mstdn = new Mastodon({
  api_url: `https://${conf.server}/api/v1/`,
  access_token: conf.token,
});
const listener = mstdn.stream('streaming/user');

listener.on('message', (msg) => {
  console.log(1);
  if (msg.event === 'notification' && msg.data.type === 'mention') {
    console.log(2);
    const content = msg.data.status.content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(conf.id, '').replace(/\s/g, '');
    const status = '@' + msg.data.status.account.acct + ' ' + talk(content);
    console.log(status + " :POST!");
    mstdn.post('statuses', { status, visibility: msg.data.status.visibility, in_reply_to_id: msg.data.status.id }, err => !!err);
  }
});