(function () {
  window.ATInternet = window.ATInternet || {};
  window.ATInternet.Callbacks = window.ATInternet.Callbacks || {};
  window.ATInternet.Callbacks.viewability = window.ATInternet.Callbacks.viewability || function (tag) {
    var _at_final_blocks = [];
    var _at_global_width = 0;
    var _at_global_height = 0;
    var _at_default_percent = 100;
    var _init = function () {
      _detectViewableTag();
      _reload();
      _addEventListeners();
    };
    var _detectViewableTag = function () {
      var percent = tag.getConfig('viewabilityPercent') || _at_default_percent;
      var at_blocks = document.querySelectorAll('[data-atview-id]');
      var block;
      for (var i = 0; i < at_blocks.length; i++) {
        block = at_blocks[i];
        if (_isValidBlock(block)) {
          _at_final_blocks.push({
            'label': block.getAttribute('data-atview-id'),
            'percent': parseInt(block.getAttribute('data-atview-percent'), 10) || percent,
            'width': _width(block),
            'height': _height(block),
            'posx': _posx(block),
            'posy': _posy(block),
            'processed': false
          });
        }
      }
    };
    var _addEventListeners = function () {
      if (window.addEventListener) {
        window.addEventListener('scroll', _reload, false);
        window.addEventListener('resize', _reload, false);
        window.addEventListener('focus', _reload, false);
      } else if (window.attachEvent) {
        window.attachEvent('onscroll', _reload);
        window.attachEvent('onresize', _reload)
      }
      if (document.attachEvent) {
        document.attachEvent('onfocusin', _reload);
      }
    };
    var _reload = function () {
      _at_global_width = _getGlobalWidth();
      _at_global_height = _getGlobalHeight();
      _processBlocks();
    };
    var _getGlobalWidth = function () {
      var width1 = _getValidSize(window.innerWidth, document.documentElement ? document.documentElement.clientWidth : 0),
        width2 = document.body ? document.body.clientWidth : 0;
      return (width1 || width2);
    };
    var _getGlobalHeight = function () {
      var height1 = _getValidSize(window.innerHeight, document.documentElement ? document.documentElement.clientHeight : 0),
        height2 = document.body ? document.body.clientHeight : 0;
      return (height1 || height2);
    };
    var _getValidSize = function (win, doc) {
      var result = win ? win : 0;
      if (doc && (!result || (result > doc))) result = doc;
      return result;
    };
    var _isValidBlock = function (block) {
      var tag_names = ['DIV', 'TABLE', 'TR', 'TD', 'UL', 'LI', 'ARTICLE', 'FOOTER', 'ASIDE', 'HEADER', 'NAV', 'SECTION'],
        node_name = block.nodeName;
      for (var j = 0; j < tag_names.length; j++) {
        if ((node_name === tag_names[j]) && (block.nodeType === 1)) {
          return true;
        }
      }
      return false;
    };
    var _isSafari = function () {
      return /Safari/.test(navigator.userAgent);
    };
    var _isMac = function () {
      return /Mac/.test(navigator.appVersion);
    };
    var _width = function (element) {
      var width = element.offsetWidth || element.style.width || 0;
      if (_isSafari() && _isMac() && (element.nodeName === 'TR') && element.firstChild && element.lastChild)
        width = element.lastChild.offsetLeft + element.lastChild.offsetWidth - element.firstChild.offsetLeft;
      return width;
    };
    var _height = function (element) {
      var height = element.offsetHeight || element.style.height || 0;
      if (_isSafari() && _isMac() && (element.nodeName === 'TR') && element.firstChild && element.lastChild)
        height = element.lastChild.offsetTop + element.lastChild.offsetHeight - element.firstChild.offsetTop;
      return height;
    };
    var _posx = function (element) {
      return _pos(element, 'Left');
    };
    var _posy = function (element) {
      var posy = _pos(element, 'Top');
      if (_isSafari() && _isMac() && (element.nodeName === 'TR') && element.firstChild)
        posy += element.firstChild.offsetTop;
      return posy;
    };
    var _pos = function (element, type) {
      if (typeof element.offsetParent !== 'undefined') {
        for (var top = 0, left = 0; element; element = element.offsetParent) {
          top += element.offsetTop;
          left += element.offsetLeft;
        }
        if (type === 'Top') {
          return top;
        }
        return left;
      }
      if (type === 'Top') {
        return element.y;
      }
      return element.x;
    };
    var _getSizePart = function (blockPosition, scrollSize, blockSize, globalSize) {
      if ((blockPosition >= scrollSize) && ((blockPosition + blockSize) <= (scrollSize + globalSize)))
        return 100;
      else if (((blockPosition < scrollSize) && ((blockPosition + blockSize) <= (scrollSize))) || (blockPosition >= (scrollSize + globalSize)))
        return 0;
      else if ((blockPosition <= scrollSize) && ((blockPosition + blockSize) >= (scrollSize + globalSize)))
        return (globalSize / blockSize) * 100;
      else if (blockPosition < scrollSize)
        return ((blockPosition + blockSize - scrollSize) / blockSize) * 100;
      else if ((blockPosition + blockSize) > (scrollSize + globalSize))
        return ((scrollSize + globalSize - blockPosition) / blockSize) * 100;
    };
    var _processBlocks = function () {
      var scTop = _getScrollTop();
      var scLeft = _getScrollLeft();
      var p = 0, pX = 0, pY = 0, Lx = 0, Ly = 0, areaA = 0, areaT = 0;
      var block;
      for (var m = 0; m < _at_final_blocks.length; m++) {
        block = _at_final_blocks[m];
        pY = _getSizePart(block.posy, scTop, block.height, _at_global_height);
        pX = _getSizePart(block.posx, scLeft, block.width, _at_global_width);
        Ly = (pY * block.height) / 100;
        Lx = (pX * block.width) / 100;
        areaA = Lx * Ly;
        areaT = block.width * block.height;
        p = Math.round((areaA / areaT) * 100);
        if (p >= _at_final_blocks[m].percent && !_at_final_blocks[m].processed) {
          tag.publisher.set({
            impression: {
              campaignId: '[' + _at_final_blocks[m].label + ']',
              creation: '[' + _at_final_blocks[m].percent + ']'
            }
          });
          tag.dispatch();
          _at_final_blocks[m].processed = true;
        }
      }
    };
    var _getScrollTop = function () {
      var pag = window.pageYOffset || 0,
        st = document.documentElement ? document.documentElement.scrollTop : 0,
        bst = document.body ? document.body.scrollTop : 0;
      return Math.max(pag, st, bst);
    };
    var _getScrollLeft = function () {
      var pag = window.pageXOffset || 0,
        sl = document.documentElement ? document.documentElement.scrollLeft : 0,
        bsl = document.body ? document.body.scrollLeft : 0;
      return Math.max(pag, sl, bsl);
    };
    _init();
  };
  window.ATInternet.Utils = window.ATInternet.Utils || { dispatchCallbackEvent: function () { } };
  window.ATInternet.Utils.dispatchCallbackEvent('viewability');
})();