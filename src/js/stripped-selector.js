/* eslint-disable no-var */
function fancysave() {
// This is the original pinboard-particular bookmarklet
// modified to suit my own purposes quite heavily and it will be called
// from the browser bookmarklet to get around space constraints
// and ensure cross-browser compatibility and uniformity

  // also, I am sick of being hectored about semicolons
  // jshint asi:true

  // ****************** begin configuration options ***************************/

  // Change `read` to true to invoke the promptless, self-closing version of the
  // bookmarklet.
  const tagKeywords = {
    javascript: ['javascript', 'nerd'],
    js: ['javascript', 'nerd'],
    python: ['python', 'nerd'],
    android: ['android', 'nerd'],
    schism: 'Schism',
    'Pope|Cardinal|Francis|Vatican': ['Press_Column', 'Catholic', 'Schism'],
    'Bishop|Archbishop|Church|Vicar|Priest': ['Press_Column', 'Christianity'],
    Trump: ['Politics', 'USA'],
    'Islam|Fatwa|Muslim': ['Press_Column', 'Islam', 'religion', 'Race/Immigrants'],
    'Online|youtube|twitter|facebook|troll|Google': ['culture_of_online_life', 'adtech'],
    'dn.se|expressen|svd.se|ä|å|Sverige|Svenska': ['Sweden', 'Swedish'],
    github: ['techie', 'nerd'],
    'AI|Machine learning': 'AI',
    'Asylsökande|ensamkommande': ['Swedish', 'Sweden', 'Race/Immigrants'],
  };
  const newLocal = (selection) => {
    // text = normalize(text);
    let tags = [];
    var re;
    for (let keyword in Object.keys(tagKeywords)) {
      re = keyword instanceof RegExp ? keyword : new RegExp('\\b' + keyword + '\\b', 'i');
      if (re.test(text)) {
        tags.push(tagKeywords[keyword]);
      }
    }
    console.log(tags);
    return tags;
  };
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0]
    chrome.tabs.executeScript(
      tab.id,
      {
        code: 'window.getSelection().toString();',
      },
      (selection) => {
        const url = encodeURIComponent(tab.url);
        const title = encodeURIComponent(tab.title);
        const description = encodeURIComponent(selection);
        const getTags = newLocal;
        window.open(
          `${BASE_URL}/add?showtags=yes&url=${url}&title=${title}&description=${description}&tags=${getTags}`,
          'Pinboard',
          'toolbar=no,scrollbars=no,width=700,height=550',
        );
      }
    )
  });
}
