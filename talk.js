const MeCab = new require('mecab-async');
const mecab = new MeCab();

module.exports = (text) => generateReply(text);

/**
 * 後ろから文を生成していく
 * 時間や感情も取り入れる
 */
function generateReply(text) {
  const replyArray = [];
  const morphs = mecab.parseSync(text)
  console.log(morphs)
  if (morphs[0][1] == '感動詞') {
    replyArray.push(morphs[0][0] + "！");
  }
  morphs.reverse().map(function (morph, index) {
    if (morph[1] === '記号') {
      replyArray.unshift(morph[0]);
    }
    if (morph[1] === '助動詞') {
      if (morph[5] == '特殊・ダ' || '特殊・デス') {
        replyArray.unshift('だね');
      }
    }
    if (morph[1] === '名詞') {
      if (morph[2] == '代名詞') {
        replyArray.unshift('あなた');
      }
      if (morph[2] == '一般' || '固有名詞') {
        replyArray.unshift(morph[0]);
        if (morphs[index + 1] == undefined && morphs[index - 1] == undefined) {
          replyArray.push('?');
        }
      }
    }
    if (morph[1] === '助詞') {
      if (morphs[index + 1][1] != '助動詞') {
        replyArray.unshift(morph[0]);
      }
    }
  })
  return replyArray.join('');
}
