/* eslint-disable prefer-template */
/* eslint-disable no-restricted-syntax */
/* eslint-disable comma-dangle */

const BASE_URL = 'https://pinboard.in';

// eslint-disable-next-line no-unused-vars
const Pinboard = {
  all() {
    chrome.tabs.create({ url: BASE_URL });
  },

  random() {
    chrome.tabs.create({ url: `${BASE_URL}/random/?type=unread` });
  },

  readLater() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const url = encodeURIComponent(tab.url);
      const title = encodeURIComponent(tab.title);

      window.open(
        `${BASE_URL}/add?later=yes&noui=yes&jump=close&url=${url}&title=${title}`,
        'Pinboard',
        // eslint-disable-next-line comma-dangle
        'toolbar=no,scrollbars=no,width=50,height=50'
      );
    });
  },

  save() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.executeScript(
        tab.id,
        {
          code: 'window.getSelection().toString();',
        },
        (selection) => {
          const url = encodeURIComponent(tab.url);
          const title = encodeURIComponent(tab.title);
          const description = encodeURIComponent(selection);
          window.open(
            `${BASE_URL}/add?showtags=yes&url=${url}&title=${title}&description=${description}`,
            'Pinboard',
            'toolbar=no,scrollbars=no,width=700,height=550'
          );
        }
      );
    });
  },
  /* eslint-disable no-var */
  fancysave() {
    // This is the original pinboard-particular bookmarklet
    // modified to suit my own purposes quite heavily
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.executeScript(
        tab.id,
        {
          code: 'window.getSelection().toString();',
        },
        (selection) => {
          const url = encodeURIComponent(tab.url);
          const title = encodeURIComponent(tab.title);
          const description = encodeURIComponent(selection);
          console.log(description);
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
          const tags = [];
          let re;
          for (const keyword of Object.entries(tagKeywords)) {
            re = keyword instanceof RegExp ? keyword : new RegExp('\\b' + keyword + '\\b', 'i');
            if (re.test(description)) {
              tags.push(tagKeywords[keyword]);
            }
            // eslint-disable-next-line no-console
            console.log(tags);
          }
          window.open(
            `${BASE_URL}/add?showtags=yes&url=${url}&title=${title}&description=${description}&tags=${tags}`,
            'Pinboard',
            'toolbar=no,scrollbars=no,width=700,height=550'
          );
        }
      );
    });
  },
  saveTabs() {
    chrome.windows.getAll({ populate: true, windowTypes: ['normal'] }, (windows) => {
      const list = [];
      const postData = new FormData();
      const request = new XMLHttpRequest();

      for (let i = 0; i < windows.length; i += 1) {
        const { tabs } = windows[i];
        const sublist = [];
        for (let j = 0; j < tabs.length; j += 1) {
          sublist.push({ title: tabs[j].title, url: tabs[j].url });
        }
        list.push(sublist);
      }
      postData.append('data', JSON.stringify({ browser: 'chrome', windows: list }));
      request.open('POST', `${BASE_URL}/tabs/save/`, true);

      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          chrome.tabs.create({ url: `${BASE_URL}/tabs/show/` });
        }
      };
      request.send(postData);
    });
  },

  unread() {
    chrome.tabs.create({ url: `${BASE_URL}/toread/` });
  },
};
