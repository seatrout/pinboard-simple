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
        'toolbar=no,scrollbars=no,width=50,height=50',
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
            'toolbar=no,scrollbars=no,width=700,height=550',
          );
        },
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
