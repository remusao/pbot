// background.js
function onError(error) {
  console.log(`ERROR: Could not put results in storage: ${error}`);
}


function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " +
    request.candidates);

    let candidates = JSON.parse(request.candidates);
    let page = candidates[0].domain;
    let toPutResult = {};
    toPutResult[page] = candidates;

    browser.storage.local.set(toPutResult).then(null, onError);
    sendResponse({response: "Received candidate urls"});
}

browser.runtime.onMessage.addListener(handleMessage);
