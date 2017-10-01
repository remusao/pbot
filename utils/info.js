// Not sure I like this, but at least it triggers
function setIconBadge(number) {
    if (number > 0) {
        browser.browserAction.setBadgeText({ text: number.toString() });
        browser.browserAction.setBadgeBackgroundColor({color: "#333"});
    }
    else if (number===0) {
        browser.browserAction.setBadgeText({ text: "" });
    }
}

module.exports = {
    setIconBadge: setIconBadge
};

