chrome.commands.onCommand.addListener((command) => {
  if (command === 'save') {
    Pinboard.save();
  } else if (command === 'fancysave') {
    // eslint-disable-next-line no-unused-expressions
    Pinboard.fancysave();
  } else if (command === 'read_later') {
    Pinboard.readLater();
  } else if (command === 'all') {
    Pinboard.all();
  } else if (command === 'unread') {
    Pinboard.unread();
  } else if (command === 'random') {
    Pinboard.random();
  }
});
