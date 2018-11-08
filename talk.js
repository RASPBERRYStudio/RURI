const MeCab = new require('mecab-async');
const mecab = new MeCab();

module.exports = (text) => generateReply(text);

/**
 * 後ろから文を生成していく
 * 時間や感情も取り入れる
 */
function generateReply(text) {
  const replyArrayBase = [];
  const morphs = mecab.parseSync(text);
  console.log(morphs)
  if (morphs[0][1] == '感動詞') {
    replyArrayBase.push(morphs[0][0] + "！");
  }
  morphs.reverse().map(function (morph, index) {
    if (morph[1] === '記号') {
      if (morph[0] === '?' || '？') {
        replyArrayBase.unshift('!');
      } else {
        replyArrayBase.unshift(morph[0]);
      }
    }
    if (morph[1] === '助動詞') {
      if (morph[5] == '特殊・ダ' || '特殊・デス') {
        replyArrayBase.unshift('だね');
      }
    }
    if (morph[1] === '名詞') {
      if (morph[2] == '代名詞') {
        replyArrayBase.unshift('あなた');
      }
      if (morph[2] == '一般' || '固有名詞') {
        replyArrayBase.unshift(morph[0]);
        if (morphs[index + 1] == undefined && morphs[index - 1] == undefined) {
          replyArrayBase.push('?');
        }
      }
    }
    if (morph[1] === '助詞') {
      if (morphs[index + 1][1] != '助動詞') {
        replyArrayBase.unshift(morph[0]);
      }
    }
  })
  let replyTextBase = replyArrayBase.join('');

  const replyArray = [];
  const morphs1 = mecab.parseSync(replyTextBase);

  console.log(morphs1);
  morphs1.map(function (morph, index) {
    if (morph[1] === '名詞') {
      if (morph[2] === 'サ変接続' && morph[0] === '!') {
        if (index != 0) {
          replyArray.push(morph[0]);
        }
      } else if (morph[2] == '一般') {
        replyArray.push(morph[0]);
      }
    }
    if (morph[1] == '感動詞') {
      replyArray.push(morph[0]);
    }
    if (morph[1] === '助動詞') {
      if (morph[5] == '特殊・ダ' || '特殊・デス') {
        replyArray.push('だね');
      }
    }
  })

  let replyText = replyArray.join('');
  if (replyText == '') { replyText = replyTextBase }
  return replyText;
}
