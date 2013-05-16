// This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.

window.mqb = {

  init: function() {
    /* If the bookmarklet already exists on the page, remove it */
    var bookmarklet = document.getElementById( 'sb-mediaQueryBookmarklet' );
    if ( bookmarklet ) {
      document.body.removeChild( bookmarklet );
    }

    mqb.version = '1.4.4';
    mqb.tmpl =
      "<div id=\"mqb-linksContainer\">" +
      "  <button id=\"mqb-closeButton\">x</button>" +
      "</div>" + 
      "<p id=\"mqb-dimensions\"></p>";

    mqb.emTest = document.createElement( "div" );
    mqb.emTest.id = "mqb-emTest";
    document.body.appendChild( mqb.emTest );

    mqb.loadCSS();
    mqb.createTemplate();

    mqb.mqList = [];

    mqb.createMQList();

    window.addEventListener('resize', function() {
      mqb.showCurrentSize();
      if ( window.matchMedia ) {
        mqb.mqChange();
      }
    }, false);
    mqb.mqChange();

    mqb.initEmSize();
  },

  appendDisplay: function() {
    mqb.container = document.createElement( "div" );
    mqb.container.id = "sb-mediaQueryBookmarklet";
    mqb.container.className = "onRight";
    mqb.container.innerHTML = mqb.tmpl;
    document.body.appendChild( mqb.container );
    mqb.attachEvents();
  },

  attachEvents: function() {
    /* Close Button */
    document.getElementById( "mqb-closeButton" ).addEventListener( "click", function( e ) {
      mqb.close( e );
      mqb = null;
    });

    document.addEventListener( 'mousemove', mqb.showCurrentMousePos );
  },

  close: function( e ) {
    e.preventDefault();

    document.body.removeChild( mqb.container );
    document.body.removeChild( mqb.emTest );
    document.head.removeChild( mqb.css );

    for ( var i in mqb.guideStyles ) {
      document.head.removeChild( mqb.guideStyles[ i ] );
    }

    document.removeEventListener( 'mousemove', mqb.showCurrentMousePos );
  },

  createMQList: function() {
    var mqs = this.getMediaQueries(),
        links = document.getElementsByTagName('link'),
        i;

    for ( i = mqs.length-1; i >= 0; i-- ) {
      if ( !this.inList( mqs[i] ) ) {
        this.mqList.push( window.matchMedia( mqs[ i ] ) );
      }
    }

    for ( i = links.length-1; i >= 0; i-- ) {
      if ( links[ i ].media !== '' ) {
        this.mqList.push( window.matchMedia( links[ i ].media ) );
      }
    }
  },

  createTemplate: function() {
    mqb.appendDisplay();
    mqb.viewDimensions = document.getElementById( "mqb-dimensions" );
    mqb.viewQueries = document.getElementById( "mqb-queries" );
    mqb.showCurrentSize();
  },

  findEmSize: function() {
    return mqb.emTest.clientWidth;
  },

  getMediaQueries: function() {
    var sheetList = document.styleSheets,
        ruleList,
        i, j,
        mediaQueries = [];

    for ( i=sheetList.length-1; i >= 0; i-- ) {
      try {
        ruleList = sheetList[ i ].cssRules;
        if ( ruleList ) {
          for ( j=0; j<ruleList.length; j++ ) {
            if ( ruleList[j].type == CSSRule.MEDIA_RULE ) {
              mediaQueries.push( ruleList[ j ].media.mediaText );
            }
          }
        }
      } catch(e) {}
    }
    return mediaQueries;
  },

  initEmSize: function() {
    mqb.cssTimer = setTimeout( function() {
      if ( mqb.emTest.clientWidth === 0 ) {
        mqb.initEmSize();
      } else {
        mqb.showCurrentSize();
      }
    }, 250);
  },

  inList: function( media ) {
    for ( var i = this.mqList.length - 1; i >= 0; i-- ) {
      if ( this.mqList[ i ].media === media ) {
        return true;
      }
    }
    return false;
  },

  loadCSS: function() {
    mqb.css = document.createElement( 'link' );
    mqb.css.type = "text/css";
    mqb.css.rel = "stylesheet";
    mqb.css.href = "http://wickmanstudios.com/git/mediaQueryBookmarklet/mediaQuery.css";
    document.head.appendChild( mqb.css );
  },

  mqChange: function() {
    var html = '';

    for ( var i in mqb.mqList ) {
      if ( mqb.mqList[ i ].matches ) {
        html += "<li><span>" + mqb.mqList[ i ].media + "</span></li>";
      }
    }
    mqb.viewQueries.innerHTML = html;
  },

  showCurrentSize: function() {
    var width = window.innerWidth || window.outerWidth;
    var height = window.innerHeight || window.outerHeight;
    mqb.viewDimensions.innerHTML = width + 'px x ' + height + 'px&nbsp;&nbsp;&nbsp;' + ( width / mqb.findEmSize() ).toPrecision( 4 ) + 'em x ' + ( height / mqb.findEmSize() ).toPrecision( 4 ) + 'em';
  },

  tmplReplace: function( dstID, src ) {
    document.getElementById( dstID ).innerHTML = src;
  },

  showCurrentMousePos: function( e ) {
    mqb.mouseXPosition.style.left = e.clientX + "px";
    mqb.mouseYPosition.style.top = e.clientY + "px";

    mqb.showMousePosition.innerHTML = "x:" + e.clientX + "px&nbsp;&nbsp;&nbsp;y:" + e.clientY + "px";
  }

};

mqb.init();