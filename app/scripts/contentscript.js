'use strict';

var template = '<a href="" target="_blank" class="d-s ot-anchor Gs Se gplus-all-access" tabindex="0" rel="nofollow"><div class="EyHlSc" style="background-color: #FF9800;">Play</div></a>';
var buyButtonSelector = '.Hi .rSFuH';

// Parse URL Queries
// http://stackoverflow.com/a/901144/801065
function getParameterByName(url, name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
      results = regex.exec(url);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Handle the insertion of one or more Play Music "Buy" buttons
function handleMultipleButtonsInserted(buttons) {
  buttons.each(function(index, element) {
    var buyButton = $(element).parent();
    if (buyButton.parent().find('.gplus-all-access').length > 0) {
      return;
    }
    var songId = getParameterByName(buyButton.attr('href'), 'tid');
    var albumId = getParameterByName(buyButton.attr('href'), 'id');
    var id = albumId;
    if (songId) {
      songId = songId.match(/(?:song-)(.*)/)[1];
      id = songId;
    }
    var url = 'https://play.google.com/music/m/' + id;
    $(template).attr('href', url).insertBefore(buyButton);
  });
}

// build an observer
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var newNodes = mutation.addedNodes;
    if (newNodes !== null) {
      var $buttons = $(newNodes).find(buyButtonSelector);
      if ($buttons.length > 0) {
        handleMultipleButtonsInserted($buttons);
      }
    }
  });
});

// Configuration of the observer:
var config = {
  childList: true,
  subtree: true
};


var init = function() {
    // watch the whole GitHub dynamic container
  var targets = $('div[guidedhelpid="streamcontent"]');
  // watch for music share additions
  targets.each(function(index, target) {
    observer.observe(target, config);
  });

  handleMultipleButtonsInserted($(buyButtonSelector));
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'init') {
      init();
    }
  }
);

