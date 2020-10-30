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
    // debugger;
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
  // eslint-disable no-var

  fancysave() {
    // This is the original pinboard-particular bookmarklet
    // modified to suit my own purposes quite heavily
    // eslint-disable-next-line no-unused-vars
    /*
    function parseTags(description) {
      this.description = description;
      const tagKeywords = {
        javascript: ['javascript', 'nerd'],
        js: ['javascript', 'nerd'],
        python: ['python', 'nerd'],
        android: ['android', 'nerd'],
        schism: 'Schism',
        'Religion|Pope|Cardinal|Francis|Vatican': ['Press_Column', 'Catholic', 'Schism'],
        'Bishop|Archbishop|Church|Vicar|Priest': ['Press_Column', 'Christianity'],
        Trump: ['Politics', 'USA'],
        'Islam|Fatwa|Muslim': ['Press_Column', 'Islam', 'religion', 'Race/Immigrants'],
        'Online|youtube|twitter|facebook|troll|Google': ['culture_of_online_life', 'adtech'],
        'dn.se|expressen|svd.se|ä|å|Sverige|Svenska': ['Sweden', 'Swedish'],
        github: ['techie', 'nerd'],
        'AI|Machine learning': 'AI',
        'Asylsökande|ensamkommande': ['Swedish', 'Sweden', 'Race/Immigrants'],
      };
      // eslint-disable-next-line prefer-const
      let tags = [];
      //  console.log(this.description);
      let re;
      for (const [k, v] of Object.entries(tagKeywords)) {
        //    console.log(k);
        re = new RegExp('\\b' + k + '\\b', 'i');
        if (re.test(this.description) === true) {
          tags.push(v);
        //     console.log(k, v);
        }
        // eslint-disable-next-line no-console
      }
      return (tags.toString());
    }
    */
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
          let description = encodeURIComponent(selection);
          description = '<blockquote>' + description + '</blockquote>';
          const tagKeywords = {
            'javascript|python|groovy|java': ['nerd', 'techie'],
            js: ['javascript', 'nerd'],
            'Religion|Pope|Cardinal|Francis|Vatican|Catholic': ['Press_Column', 'Catholic', 'Schism'],
            'Bishops?|Archbishops?|Church(es)?|Vicars?|Priests?': ['Press_Column', 'Christianity'],
            Trump: ['Politics', 'USA'],
            'Islam|Fatwa|Muslim|Imam|Mosque': ['Press_Column', 'Islam', 'religion', 'Race/Immigrants'],
            'Online|youtube|twitter|facebook|troll|Google': ['culture_of_online_life', 'adtech'],
            'dn.se|expressen|svd.se|Sverige|Svenska': ['Sweden', 'Swedish'],
            github: ['techie', 'nerd'],
            'AI|Machine learning': 'AI',
            'Rekognition|facial-recognition|Xinjiang': ['AI', 'Security', 'surveillance'],
            'migrants|migration': ['Race/Immigrants'],
            'Asylsökande|ensamkommande': ['Swedish', 'Sweden', 'Race/Immigrants'],
            'Brott|Åklagare|tingsrätt|mord': ['Swedish', 'Sweden', 'crime', 'Race/Immigrants'],
            'Islamist|terrorist|terror': ['Race/Immigrants', 'Crime', 'neofash', 'Islam'],
            'Coronavirus|Covid|SARS|MERS': ['covid19'],
          };
          const SwedishLetters = {
            'ö|ä|å': 'Swedish'
          };
          // eslint-disable-next-line prefer-const
          let tags = [];
          //  console.log(this.description);
          let re;
          for (const [k, v] of Object.entries(tagKeywords)) {
            // console.log(k);
            re = new RegExp('\\b' + k + '\\b', 'i');
            if (re.test(description) === true) {
              tags.push(v);
            //     console.log(k, v);
            }
            for (const [k, v] of Object.entries(SwedishLetters)) {
              // console.log(k);
              re = new RegExp(k, 'i');
              if (re.test(description) === true) {
                tags.push(v);
              //     console.log(k, v);
              }
            // eslint-disable-next-line no-console
          }
          window.open(
            `${BASE_URL}/add?showtags=yes&url=${url}&title=${title}&description=${description}&tags=${tags.toString()}`,
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
