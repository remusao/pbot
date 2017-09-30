// Populating popup with list
function populatePopup(pageCandidateUrls) {
	if (Object.keys(pageCandidateUrls).length === 1) {
		const candidates = Object.values(pageCandidateUrls)[0];
		console.log(candidates);
		let listEl = document.querySelector("ul");

		// Removes default <li> elementt
		while (listEl.firstChild) {
			listEl.removeChild(listEl.firstChild);
		}

		for (let i = 0, len = candidates.length; i < len; i++) {
			if (i >= 15) {
				break;
			}
			const candidate = candidates[i];
			const listItem = createListItemAnchor(candidate);
			listEl.appendChild(listItem);
		}
	}
}

// Async handling functions
function onGot(pageCandidates) {
	populatePopup(pageCandidates);
}

function onError(error) {
	console.log(`Error: ${error}`);
	return ;
}

function onSuccess(tabs) {
	const currentTab = tabs[0];
	const currentPage = String(currentTab.url);
	console.log(`The current page is ${currentPage}`);


	// getting candidates for this url and add the candidates to popup
	browser.storage.local.get(currentPage).then(onGot, onError);
}

// getting current tab url
browser.tabs.query({ currentWindow: true, active: true }).then(onSuccess, onError);


// Functions that create html elements
function createListItemAnchor(obj) {
	const listItem = document.createElement("li");
	listItem.textContent = obj.text;
	listItem.appendChild(document.createElement("br"));
	const anchor = document.createElement("a");
	anchor.text = obj.url;
	anchor.href = obj.url;
	listItem.appendChild(anchor);
	return listItem;
}
