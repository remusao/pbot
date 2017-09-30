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

function unique(arr) {
    var u = {}, a = [];
    for(i = 0; i < arr.length; i++) {
        if(!u.hasOwnProperty(arr[i.url])) {
            a.push(arr[i]);
            u[arr[i].url] = 1;
        }
    }
    return a;
}

function matchKeyword(url) {
    for (crci of KEYWORDS) {
        if (crci.test(url)) {
            return true;
        }
    }
}

// Finds all urls in a page that match the keywords
function candidateUrls(htmlDoc) {
    const links = htmlDoc.getElementsByTagName('a');
    const candidates = [];
    for (url of links) {
        if (matchKeyword(url.href) || matchKeyword(url.innerText)) {
            candidates.push({
                'domain': String(location), // TODO: use tld.js to get tld
                'text': url.innerText,
                'url': url.href,
            });
        }
    }
    return unique(candidates);
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

// runs on page load TODO: maybe change to when DOM loads
window.addEventListener("load", notifyBackgroundPage);