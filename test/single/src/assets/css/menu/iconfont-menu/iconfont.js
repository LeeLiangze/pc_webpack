;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-llhomesearch" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M945.186492 877.772614 785.585517 721.077829c50.831712-67.312058 81.346703-150.830217 81.346703-241.688551 0-221.929532-179.8696-401.845181-401.844158-401.845181-221.951021 0-401.845181 179.915649-401.845181 401.845181 0 221.974557 179.893136 401.868717 401.845181 401.868717 102.262058 0 195.336874-38.526455 266.25097-101.432157l159.831218 156.902516c15.697517 15.419178 40.513716 14.773472 55.44887-1.477654C961.507202 919.000598 960.884009 893.237841 945.186492 877.772614zM465.111598 810.366412c-182.777837 0-330.930061-148.176784-330.930061-330.954621 0-182.755324 148.152225-330.931085 330.930061-330.931085 182.757371 0 330.932108 148.175761 330.932108 330.931085C796.042683 662.190651 647.867946 810.366412 465.111598 810.366412z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-ymqiconcaidansuoyou" viewBox="0 0 1404 1024">' +
    '' +
    '<path d="M1360.810667 130.218667 43.178667 130.218667c-23.552 0-42.666667-19.114667-42.666667-42.666667s19.114667-42.666667 42.666667-42.666667l1317.632 0c23.552 0 42.666667 19.114667 42.666667 42.666667S1384.448 130.218667 1360.810667 130.218667z"  ></path>' +
    '' +
    '<path d="M825.088 1007.36 43.178667 1007.36c-23.552 0-42.666667-19.114667-42.666667-42.666667s19.114667-42.666667 42.666667-42.666667l781.909333 0c23.552 0 42.666667 19.114667 42.666667 42.666667S848.64 1007.36 825.088 1007.36z"  ></path>' +
    '' +
    '<path d="M1136.213333 568.832 43.178667 568.832c-23.552 0-42.666667-19.114667-42.666667-42.666667s19.114667-42.666667 42.666667-42.666667l1093.12 0c23.552 0 42.666667 19.114667 42.666667 42.666667S1159.850667 568.832 1136.213333 568.832z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-shang-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M945.4 228.101c-14.472-14.285-37.748-14.213-52.072 0.224l-377.322 380.777-382.586-379.158c-14.472-14.324-37.749-14.218-52.112 0.219-14.33 14.477-14.218 37.788 0.219 52.118l406.634 402.952c0.629 0.623 1.439 0.77 2.062 1.36 0.152 0.145 0.185 0.331 0.332 0.478 7.182 7.109 16.577 10.683 25.93 10.683 9.464 0 18.967-3.647 26.149-10.902l402.952-406.634c14.363-14.477 14.251-37.789-0.186-52.117v0zM945.4 228.101z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-you-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M310.287 902.31l390.318-390.324-390.329-390.307 43.426-43.424 433.734 433.733-433.734 433.757z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)