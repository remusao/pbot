# Privacy Bot

### What it does ##

The extension includes:

* a content_script which uses finds urls that may potentially be pricacy policy urls
* a backround script which writes these candidates to storage using the
  storage API
* a browser action with a popup including HTML, CSS, and JS, which renders
  the stats stored by the background page


When the user clicks the browser action button, the popup is shown
rendering the urls that are considered releant to privacy


### Getting the extension built
Uses `webpack`.

```
npm install
```
then 

```
npm run build
```

This populates the addon folder with all that it needs to function
in the browser.
