var bgSeenBlock = true;
var bgTypingBlock = true;


chrome.storage.sync.get(['blockSeen', 'blockTyping', 'firstRun'], function(SeenBlock){
	if (typeof SeenBlock.firstRun  == 'undefined') {
		chrome.storage.sync.set({'blockSeen': bgSeenBlock, 'blockTyping': bgTypingBlock, 'firstRun': false}, function(){
		console.log("Set First Run Preferences");
		})
	}
	else {
		bgSeenBlock = SeenBlock.blockSeen;
		bgTypingBlock = SeenBlock.blockTyping;
	}

	})


chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
	console.log("Seen attempt");
		return {cancel: bgSeenBlock
  }
}, { urls: ['*://*.facebook.com/*change_read_status*',
            '*://*.messenger.com/*change_read_status*',
			'*://*.facebook.com/*delivery_receipts*',
            '*://*.messenger.com/*delivery_receipts*',
            '*://*.facebook.com/*unread_threads*',
            '*://*.messenger.com/*unread_threads*'] }, ['blocking'])

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	console.log("Typing status: " + bgTypingBlock);
  return {
    cancel: bgTypingBlock
  }
}, { urls: ['*://*.facebook.com/*typ.php*',
            '*://*.messenger.com/*typ.php*'] }, ['blocking'])

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	console.log("Request recived - SeenBlock = " + request.optBlockSeen + "; TypingBlock = " + request.optBlockTyping);
    bgSeenBlock = request.optBlockSeen;
	bgTypingBlock = request.optBlockTyping;
});
