const { parse } = require('tldjs');


// cached regex case insensitive (crci)
const KEYWORDS = [
    new RegExp('privacy', 'i'),
    new RegExp('datenschutz', 'i'),
    new RegExp('Конфиденциальность', 'i'),
    new RegExp('Приватность', 'i'),
    new RegExp('тайность', 'i'),
    new RegExp('隐私', 'i'),
    new RegExp('隱私', 'i'),
    new RegExp('プライバシー', 'i'),
    new RegExp('confidential', 'i'),
    new RegExp('mentions-legales', 'i'),
    new RegExp('conditions-generales', 'i'),
    new RegExp('mentions légales', 'i'),
    new RegExp('conditions générales', 'i'),
    new RegExp('termini-e-condizioni', 'i')
];

function matchKeyword(url) {
    for (let i = 0, len = KEYWORDS.length; i < len; i++) {
        if (KEYWORDS[i].test(url)) {
            return true;
        }
    }
}

// Finds all urls in a page that match the keywords
function candidateUrls(htmlDoc) {
    const links = htmlDoc.getElementsByTagName('a');
    const candidates = [];
    const uniqueUrls = {};
    for (let i = 0, len = links.length; i < len; i++) {
        if ((matchKeyword(links[i].href) || matchKeyword(links[i].innerText)) && !(links[i].href in uniqueUrls)) {
            
            uniqueUrls[links[i].href] = true;
            candidates.push({
                'domain': parse(location).domain,
                'text': links[i].innerText,
                'url': links[i].href
            });
        }
    }
    return candidates;
};

// Communicating with background.js
function handleResponse(message) {
    console.log(`backround.js:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
    let candidates = JSON.stringify(candidateUrls(document));

    // send candidate urls to bakcgound.js
    let sending = browser.runtime.sendMessage({
        candidates: candidates
    });
    sending.then(handleResponse, handleError);
}

// Not sure I like this, but at least it triggers, 
// and updates the icon bage text
['DOMContentLoaded', 'load', 'ontouchstart', 'scroll'].forEach( evt =>
    window.addEventListener(evt, notifyBackgroundPage, {
        once: true,
        passive: true,
        capture: true
      }
    )
);