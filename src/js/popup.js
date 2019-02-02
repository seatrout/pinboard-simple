document.addEventListener('DOMContentLoaded', () => {
  const items = ['all', 'random', 'readLater', 'save', 'saveTabs', 'unread'];

  items.forEach((item) => {
    document.querySelector(`.js-${item} a`).addEventListener('click', Pinboard[item]);
  });

  chrome.storage.sync.get({ visibleItems: true }, (options) => {
    if (!options.visibleItems || typeof options.visibleItems !== 'object') {
      return;
    }

    items.forEach((item) => {
      if (!options.visibleItems[item]) {
        document.querySelector(`.js-${item}`).remove();
      }
    });
  });
});
