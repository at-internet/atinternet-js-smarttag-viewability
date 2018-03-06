# Viewability for AT Internet JavaScript SmartTag

This plugin allows you to measure which element on the page were actually seen by the browser, just by adding an attribute to your elements.

## Content

*	JavaScript plugin for [AT Internet Javascript SmartTag] from version 5.3.0, with **Callbacks** activated.

## Get started
* Download our main library (smarttag.js) with this plugin (at-smarttag-viewability.js) and install it on your website.
* Check out the [documentation page] for an overview of the SmartTag functionalities and code examples.

## Foreword
First of all, you must download our JavaScript library from [Tag Composer].

Tag Composer allows you to configure your SmartTag:

* Set up your tagging perimeter/scope (site, domain used to write cookies, etc.). **Use callbacks**.
* Select desired features via configurable plugins. 

Once the library is set up, you can download it and insert it with this plugin into the source code of the HTML page to be tagged.

## Usage

The plugin determines if an element is being viewed depending on which percentage of it is displayed on the user's screen.
This viewability percentage can be set at 3 levels:
* Globally : in the Tracker configuration, and will be applied to all elements ([see here](#plugin-configuration))
* At elements' level : if defined thanks to the attribute __data-atview-percent__ ([see here](#elements-level-percentage))
* By default, if none of the two before has been defined, it will be set to 100%

When an element has been defined as viewed, the plugin will send a **Publisher** hit, with the following data:
* Campaign: the element's ID ([see here](#viewable-elements-tagging))
* Creation: the percentage defined following rules above

This data will be sent only once per page view, no matter if the user scrolls up and down and displays the element multiple times.

## Tagging

### File loading

#### Standard tag

Tracker initialisation is done via the instantiation of a new ATInternet.Tracker.Tag object:

```html
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8">
    <title>My Page</title>
    <script type="text/javascript" src="http://www.site.com/smarttag.js"></script>
    <script type="text/javascript" src="http://www.site.com/at-smarttag-viewability.js"></script>
  </head>
  <body>
    <script type="text/javascript">            
      var tag = new ATInternet.Tracker.Tag();
      // your tag
    </script>
    ...
  </body>
</html>
```

#### Asynchronous tag

You can load our JavaScript library asynchronously. However, this requires an adaptation in your tagging.
Check out the [Asynchronous tag] for an overview of the functionality . 

```html
<script type="text/javascript">
window.ATInternet = {
    onTrackerLoad:function(){
        window.tag = new window.ATInternet.Tracker.Tag();
        var _callback = function () {
            // your tag
        };
        // This code loads the plugin code to track media and call the '_callback' function after loading.
        ATInternet.Utils.loadScript({url: 'http://www.site.com/at-smarttag-viewability.js'}, _callback);
    }
};
(function(){      
    var at=document.createElement('script');
    at.type='text/javascript';   
    at.async=true;    
    at.src='http://www.site.com/smarttag.js';
    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]||document.getElementsByTagName('script')[0].parentNode).insertBefore(at,null);   
})();
</script>
```

### Plugin configuration

You can set the global view percentage through the Tracker configuration, thanks to the property __viewabilityPercent__:

```javascript
var config = {
  site: 123456,
  // ...,
  viewabilityPercent: 50
};
var tag = new ATInternet.Tracker.Tag(config);
```

### Viewable elements tagging

In order to inform the plugin that an element viewability must be tracked, you need to insert an attribute **data-atview-id**, containing the ID/name that will be retrieved in your data. Please don't use any special characters, this could lead to wrong measurement.

```html
<div data-atview-id="My-viewable-div">
  <!-- ... -->
</div>
```

### Element's level percentage

In order to set a specific viewability percentage to an element, you can add the attribute **data-atview-percent** to it, containing the numeric value of the percentage.

```html
<div data-atview-id="My-viewable-div" data-atview-percent="70">
  <!-- ... -->
</div>
```

### License
MIT

[documentation page]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>
[Tag Composer]: <https://apps.atinternet-solutions.com/TagComposer/>
[Asynchronous tag]: <http://developers.atinternet-solutions.com/javascript-en/advanced-features-javascript-en/asynchronous-tag-javascript-en/>
[AT Internet Javascript SmartTag]: <http://developers.atinternet-solutions.com/javascript-en/getting-started-javascript-en/tracker-initialisation-javascript-en/>