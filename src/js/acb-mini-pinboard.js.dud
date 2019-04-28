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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = encodeURIComponent(tab.url);
    const title = encodeURIComponent(tab.title);
  });
  let readlater = false;
  const appUrl;
  // When set to true, selected text is quoted using <blockquote>.
  // Note that Markdown is not supported in link descriptions because of an XSS
  // vulnerability: https://twitter.com/Pinboard/status/22436355472625664
  // see also acb hack lower down to avoid empty blockquoted paragraphs // When this text appears in title or description, they are added as tags.
  // If I have read the code right, it should be possible to search for regexps as well as simple strings. On verra
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
    'Online|youtube|twitter|facebook|troll|Google': ['culture_of_online_life', 'Adtech'],
    'dn.se|expressen|svd.se|ö|ä|å|Sverige|Svenska': ['Sweden', 'Swedish'],
    github: ['techie', 'nerd'],
    youtube: ['video', 'adtech'],
    vimeo: 'video',
    'AI|Machine learning': 'AI',
    'Asylsökande|ensamkommande': ['Swedish', 'Sweden', 'Race/Immigrants'],
  };
  const titleTweaks = {
    'github.com': '.entry-title .js-current-repository',
  };
  const descriptionTweaks = {
    'www.kickstarter.com': '.short-blurb',
  };
  const textLengthLimit = 1500;
  const normalize = (string) => {
    string.toLowerCase();
  };
  // eslint-disable-next-line no-unused-expressions
  const elementText = (el) => { (el ? el.textContent.trim().replace(/\s+/g, ' ') : null); };
  const normalizedDocumentTitle = normalize(document.title);
  const isSubtitle = (string) => {
    if (string) {
      return normalizedDocumentTitle.indexOf(normalize(string)) !== -1;
    }
    return false;
  };
  const selectFromNodeList = (nodeList, func, thisObj) => {
    thisObj = thisObj || window;
    const l = nodeList.length;
    let result = null;
    for (let i = 0; i < l; ++i) {
      result = func.call(thisObj, nodeList[i]);
      if (result !== null) {
        return result;
      }
    }
    return null;
  };
  // eslint-disable-next-line func-names
  const getTitle = function () {
    // eslint-disable-next-line no-restricted-globals
    // eslint-disable-next-line no-undef
    // const url = location.href;
    const host = location.hostname;
    let e = '';
    if (host in titleTweaks) {
      e = document.querySelector(titleTweaks[host]);
      if (e) {
        return elementText(e);
      }
    }
    let documentTitle = document.title;
    e = document.querySelector("meta[property='og:title']");
    if (e) {
      documentTitle = e.content.trim().replace(/\s+/g, ' ');
    }
    if (selectFromNodeList(document.getElementsByClassName('hentry')), () => true);
    const htitle = document.querySelector('.hentry .entry-title');
    if (htitle) {
      return elementText(htitle);
    }
    let a_Text = selectFromNodeList(document.getElementsByTagName('A'), (a) => {
    if (a.href === url) {
      a_Text = elementText(a);
      if (isSubtitle(a_Text)) {
        return a_Text;
      }
    }
    return null;
   });
   if (a_Text) {
    return a_Text;
   }
   const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
   let headerTitle = '';
   for (let j = 0; j < headerTags.length; ++j) {
   selectFromNodeList(document.getElementsByTagName(headerTags[j]), (h) => {
      const h_text = elementText(h);
      if (isSubtitle(h_text) && (!headerTitle || h_text.length > headerTitle.length)) {
        headerTitle = h_text;
      }
      return null;
    });
   }
   if (headerTitle) {
    return headerTitle;
   // eslint-disable-next-line no-else-return
   } else {
    return documentTitle;
   }
  const getTags = (text) => {
    text = normalize(text);
    let tags = [];
    let re = null;
    for (var keyword in Object.keys(tagKeywords)) {
      re = keyword instanceof RegExp ? keyword : new RegExp('\\b' + keyword + '\\b', 'i');
      if (re.test(text)) {
        tags.push(tagKeywords[keyword]);
      }
    }
    return tags;
  };
  const getMetaDescription = function () {
    let e='';
    e = document.querySelector("meta[name='description']");
    if (e) {
      return e.content.trim().replace(/\s+/g, ' ');
    }
    e = document.querySelector("meta[property='og:description']");
    if (e) {
      return e.content.trim().replace(/\s+/g, ' ');
    }
    return '';
  };
  const getDescription = function () {
    let text = '';
    if ('' !== (text = String(document.getSelection()))) {
      if (quoteSelection) {
        text=text.replace('\n\n', '\n'); //acb add to eliminate blank paragraphs
        text = text.trim().split('\n').map(function(s) {return '<blockquote>'+s+'</blockquote>';}).join('\n');
      }
    }
    const host = location.hostname;
    let e = '';
    if (host in descriptionTweaks) {
      e = document.querySelector(descriptionTweaks[host]);
      if (e) {
        return elementText(e);
      }
    }
    if (!text) {
      text = getMetaDescription();
    }
    return text;
  };
  const url = location.href;
  let title = getTitle();
  let description = getDescription();
  const ix = description.indexOf(title);
  if (ix === 0) {
    description = description.substring(title.length).trim();
  } else if (ix === description.length - title.length) {
    description = description.substring(0, ix).trim();
  }
  const tags = getTags(document.title + ' ' + description + ' ' + getMetaDescription());
  if (textLengthLimit > 0) {
    title = title.substring(0, textLengthLimit);
    description = description.substring(0, textLengthLimit);
  }
  let args = ['url=', encodeURIComponent(url), '&title=', encodeURIComponent(title), '&description=', encodeURIComponent(description), '&tags=', encodeURIComponent(tags.join(' ')), '&later=', 'no', '&jump=', 'close'];
  if (readlater) {
    args = args.concat(['&later=', 'yes', '&jump=', 'close']);
  }
  if (appUrl) {
    args = args.concat(['&x-source=Safari', '&x-success=', encodeURIComponent(location.href), '&x-cancel=', encodeURIComponent(location.href)]);
    window.location = appUrl + args.join('');
  } else {
    try {
      const pin = open('https://pinboard.in/add?'+args.join(''), 'ACB Pinboard', 'toolbar=no,width=610,height=350');
      // The whole thing wrapped in a try/catch exception by acb to avert silent failure
      // Send the window to the background if readlater mode.
      if (readlater) {
        pin.blur();
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('Aw fuck!\n', error);
    }
  }  
}
}