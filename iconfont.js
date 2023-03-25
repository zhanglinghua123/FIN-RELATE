(function (window) {
  var svgSprite = '<svg><symbol id="icon-nextframe" class="icon" viewBox="0 0 1024 1024"><path d="M938.666667 512a52.92 52.92 0 0 1-25.78 45.666667l-618.666667 373.28a53.333333 53.333333 0 0 1-80.886667-45.666667V138.72a53.333333 53.333333 0 0 1 80.886667-45.666667l618.666667 373.28A52.92 52.92 0 0 1 938.666667 512zM128 917.333333V106.666667a21.333333 21.333333 0 0 0-42.666667 0v810.666666a21.333333 21.333333 0 0 0 42.666667 0z"></path></symbol><symbol id="icon-text" class="icon" viewBox="0 0 1024 1024"><path d="M938.666667 42.666667a42.666667 42.666667 0 0 1 42.666666 42.666666v853.333334a42.666667 42.666667 0 0 1-42.666666 42.666666H85.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V85.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h853.333334z m-42.666667 85.333333H128v768h768V128z m-234.666667 192.213333a21.333333 21.333333 0 0 1 21.333334 21.333334v42.666666a21.333333 21.333333 0 0 1-21.333334 21.333334H554.666667v277.333333a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-277.333333H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h298.666666z"></path></symbol><symbol id="icon-circle" class="icon" viewBox="0 0 1024 1024"><path d="M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z"></path></symbol><symbol id="icon-rect" class="icon" viewBox="0 0 1024 1024"><path d="M876.4664713541666 302.9680989583333H776.4029947916665V202.90462239583334c0-11.865234374999998-9.8876953125-21.7529296875-21.7529296875-21.7529296875s-21.7529296875 9.8876953125-21.7529296875 21.7529296875v100.0634765625H632.8336588541666c-11.865234374999998 0-21.7529296875 9.8876953125-21.7529296875 21.7529296875s9.8876953125 21.7529296875 21.7529296875 21.7529296875h100.0634765625v100.0634765625c0 11.865234374999998 9.8876953125 21.7529296875 21.7529296875 21.7529296875s21.7529296875-9.8876953125 21.7529296875-21.7529296875V346.4739583333333H876.4664713541666c11.865234374999998 0 21.7529296875-9.8876953125 21.7529296875-21.7529296875 0-12.2607421875-9.8876953125-21.7529296875-21.7529296875-21.7529296875zM146.75455729166666 386.0247395833333c11.07421875 0 19.775390625-8.701171874999998 19.775390625-19.775390625h0.7910156249999999v-21.7529296875h36.38671875c10.678710937499998 0 19.775390625-8.701171874999998 19.775390625-19.775390625s-9.0966796875-19.775390625-19.775390625-19.775390625l-56.953125-0.39550781249999994c-11.07421875 0-19.775390625 8.701171874999998-19.775390625 19.775390625v42.71484374999999c0 9.8876953125 8.701171874999998 18.984374999999996 19.775390625 18.984374999999996z m135.26367187500003-41.92382812499999h98.876953125c11.07421875 0 19.775390625-8.701171874999998 19.775390625-19.775390625s-8.701171874999998-19.775390625-19.775390625-19.775390625h-98.876953125c-11.07421875 0-19.775390625 9.0966796875-19.775390625 19.775390625 0 11.07421875 9.0966796875 19.775390625 19.775390625 19.775390625z m177.1875 0h98.876953125c11.07421875 0 19.775390625-8.701171874999998 19.775390625-19.775390625s-8.701171874999998-19.775390625-19.775390625-19.775390625h-98.876953125c-11.07421875 0-19.775390625 9.0966796875-19.775390625 19.775390625 0.7910156249999999 11.07421875 8.701171874999998 19.775390625 19.775390625 19.775390625zM774.8209635416665 560.8391927083335c0-11.07421875-8.701171874999998-19.775390625-19.775390625-19.775390625s-19.775390625 8.701171874999998-19.775390625 19.775390625v98.876953125c0 11.07421875 8.701171874999998 19.775390625 19.775390625 19.775390625s19.775390625-8.701171874999998 19.775390625-19.775390625v-98.876953125z m-19.775390625 157.41210937500003c-11.07421875 0-19.775390625 9.0966796875-19.775390625 19.775390625v64.072265625h-79.1015625v1.1865234374999998c-11.07421875 0-19.775390625 8.701171874999998-19.775390625 19.775390625s8.701171874999998 19.775390625 19.775390625 19.775390625h98.876953125c11.07421875 0 19.775390625-8.701171874999998 19.775390625-19.775390625V738.8177083333334c0-11.865234374999998-9.0966796875-20.56640625-19.775390625-20.56640625zM581.0221354166666 802.0989583333333L166.52994791666666 801.3079427083333V423.2024739583333h-0.7910156249999999c0-11.07421875-8.701171874999998-19.775390625-19.775390625-19.775390625s-19.775390625 8.701171874999998-19.775390625 19.775390625V821.8743489583334c0 11.07421875 8.701171874999998 19.775390625 19.775390625 19.775390625H579.8356119791666c11.07421875 0 19.775390625-9.0966796875 19.775390625-19.775390625 0-11.07421875-9.0966796875-19.775390625-18.5888671875-19.775390625z"></path></symbol><symbol id="icon-arrow" class="icon" viewBox="0 0 1024 1024"><path d="M729.6 448H128v85.333333h601.6L597.333333 665.6l59.733334 59.733333 234.666666-234.666666L661.333333 256l-59.733333 59.733333 128 132.266667z"></path></symbol><symbol id="icon-delete" class="icon" viewBox="0 0 1024 1024"><path d="M687.603949 656.994302 541.10027 510.457878 687.603949 363.943966c8.829086-8.840342 8.829086-23.122627 0-31.961946-8.850575-8.840342-23.13286-8.840342-31.962969 0L509.138324 478.495932 362.623389 331.980997c-8.840342-8.818853-23.122627-8.818853-31.962969 0-8.840342 8.840342-8.840342 23.144116 0 31.984459l146.493445 146.514935L330.638931 656.994302c-8.819876 8.830109-8.819876 23.133883 0 31.962969 8.840342 8.829086 23.144116 8.829086 31.984459 0l146.514935-146.514935 146.502655 146.514935c8.830109 8.829086 23.112394 8.829086 31.962969 0C696.433034 680.129208 696.45657 665.824411 687.603949 656.994302z"></path><path d="M938.362063 510.457878c0-237.061161-192.174857-429.234995-429.247274-429.234995-237.062184 0-429.246251 192.173834-429.246251 429.234995 0 237.083673 192.185091 429.257507 429.246251 429.257507 97.345072 0 186.435133-33.110095 258.440074-87.677898 2.958378-3.354398 4.900613-7.636934 4.900613-12.449543 0-10.506285-8.521071-19.026332-19.027355-19.026332-5.431709 0-10.287297 2.162246-13.752212 5.826705l-0.2415 0c-64.456011 47.414893-143.745868 75.800383-229.876528 75.800383-214.679407 0-388.730489-174.073594-388.730489-388.719232 0-214.688617 174.051081-388.718209 388.730489-388.718209 214.688617 0 388.697743 174.029592 388.697743 388.718209 0 65.548902-15.386432 127.277802-44.081984 181.490517l0 0.309038c-0.508583 1.811252-1.104147 3.576455-1.104147 5.519714 0 10.507308 8.520047 19.028379 19.028379 19.028379 8.18952 0 15.054881-5.254677 17.703197-12.494569l0 0.132006C920.349827 648.38625 938.362063 581.536726 938.362063 510.457878z"></path></symbol></svg>';
  var script = function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1]
  }();
  var shouldInjectCss = script.getAttribute("data-injectcss");
  var ready = function (fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function () {
          document.removeEventListener("DOMContentLoaded", loadFn, false);
          fn()
        };
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        init = function () {
          if (!done) {
            done = true;
            fn()
          }
        };
      var polling = function () {
        try {
          d.documentElement.doScroll("left")
        } catch (e) {
          setTimeout(polling, 50);
          return
        }
        init()
      };
      polling();
      d.onreadystatechange = function () {
        if (d.readyState == "complete") {
          d.onreadystatechange = null;
          init()
        }
      }
    }
  };
  var before = function (el, target) {
    target.parentNode.insertBefore(el, target)
  };
  var prepend = function (el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  };

  function appendSvg() {
    var div, svg;
    div = document.createElement("div");
    div.innerHTML = svgSprite;
    svgSprite = null;
    svg = div.getElementsByTagName("svg")[0];
    if (svg) {
      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.width = 0;
      svg.style.height = 0;
      svg.style.overflow = "hidden";
      prepend(svg, document.body)
    }
  }
  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true;
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")
    } catch (e) {
      console && console.log(e)
    }
  }
  ready(appendSvg)
})(window)