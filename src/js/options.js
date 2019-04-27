const restoreOptions = () => {
  chrome.storage.sync.get({ visibleItems: true }, (options) => {
    Object.keys(options.visibleItems).forEach((key) => {
      document.querySelector(`.js-show-${key}`).checked = options.visibleItems[key];
    });
  });
};

const updateStatus = () => {
  const status = document.querySelector('.js-status');
  status.textContent = 'Saved!';
  setTimeout(() => {
    status.textContent = '';
  }, 750);
};

const saveOptions = () => {
  const visibleItems = {};
  const items = ['all', 'random', 'readLater', 'save', 'fancysave', 'unread'];

  items.forEach((item) => {
    visibleItems[item] = document.querySelector(`.js-show-${item}`).checked;
  });

  chrome.storage.sync.set({ visibleItems }, updateStatus());
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('.js-save').addEventListener('click', saveOptions);
