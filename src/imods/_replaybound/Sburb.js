DRAW_FPS = 60;


/**
$Id: Iuppiter.js 3026 2010-06-23 10:03:13Z Bear $

Copyright (c) 2010 Nuwa Information Co., Ltd, and individual contributors.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  1. Redistributions of source code must retain the above copyright notice,
     this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.

  3. Neither the name of Nuwa Information nor the names of its contributors
     may be used to endorse or promote products derived from this software
     without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

$Author: Bear $
$Date: 2010-06-23 18:03:13 +0800 (星期三, 23 六月 2010) $
$Revision: 3026 $
*/

if (typeof Iuppiter === 'undefined')
    Iuppiter = {
        version: '$Revision: 3026 $'.substring(11).replace(" $", ""),
    };

/**
 * Convert string value to a byte array.
 *
 * @param {String} input The input string value.
 * @return {Array} A byte array from string value.
 */
Iuppiter.toByteArray = function(input) {
    var b = [], i, unicode;
    for(i = 0; i < input.length; i++) {
        unicode = input.charCodeAt(i);
        // 0x00000000 - 0x0000007f -> 0xxxxxxx
        if (unicode <= 0x7f) {
            b.push(unicode);
        // 0x00000080 - 0x000007ff -> 110xxxxx 10xxxxxx
        } else if (unicode <= 0x7ff) {
            b.push((unicode >> 6) | 0xc0);
            b.push((unicode & 0x3F) | 0x80);
        // 0x00000800 - 0x0000ffff -> 1110xxxx 10xxxxxx 10xxxxxx
        } else if (unicode <= 0xffff) {
            b.push((unicode >> 12) | 0xe0);
            b.push(((unicode >> 6) & 0x3f) | 0x80);
            b.push((unicode & 0x3f) | 0x80);
        // 0x00010000 - 0x001fffff -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
        } else {
            b.push((unicode >> 18) | 0xf0);
            b.push(((unicode >> 12) & 0x3f) | 0x80);
            b.push(((unicode >> 6) & 0x3f) | 0x80);
            b.push((unicode & 0x3f) | 0x80);
        }
    }

    return b;
}

/**
 * Base64 Class.
 * Reference: http://code.google.com/p/javascriptbase64/
 *            http://www.stringify.com/static/js/base64.js
 * They both under MIT License.
 */
Iuppiter.Base64 = {

    /// Encoding characters table.
    CA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

    /// Encoding characters table for url safe encoding.
    CAS: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",

    /// Decoding reference table.
    IA: new Array(256),

    /// Decoding reference table for url safe encoded string.
    IAS: new Array(256),

    /**
 * Constructor.
 */
    init: function(){
        /// Initialize variables for Base64 namespace.
        var i;

        for (i = 0; i < 256; i++) {
            Iuppiter.Base64.IA[i] = -1;
            Iuppiter.Base64.IAS[i] = -1;
        }

        for (i = 0, iS = Iuppiter.Base64.CA.length; i < iS; i++) {
            Iuppiter.Base64.IA[Iuppiter.Base64.CA.charCodeAt(i)] = i;
            Iuppiter.Base64.IAS[Iuppiter.Base64.CAS.charCodeAt(i)] = i;
        }

        Iuppiter.Base64.IA['='] = Iuppiter.Base64.IAS['='] = 0;
    },

    /**
 * Encode base64.
 *
 * @param {Array|String} input A byte array or a string.
 * @param {Boolean} urlsafe True if you want to make encoded string is url
 *                          safe.
 * @return {String} Encoded base64 string.
 */
    encode: function(input, urlsafe) {
        var ca, dArr, sArr, sLen,
            eLen, dLen, s, d, left,
            i;

        if(urlsafe)
            ca = Iuppiter.Base64.CAS;
        else
            ca = Iuppiter.Base64.CA;

        if(input.constructor == Array)
            sArr = input;
        else
            sArr = Iuppiter.toByteArray(input);

        sLen = sArr.length;

        eLen = (sLen / 3) * 3;              // Length of even 24-bits.
        dLen = ((sLen - 1) / 3 + 1) << 2;   // Length of returned array
        dArr = new Array(dLen);

        // Encode even 24-bits
        for (s = 0, d = 0; s < eLen;) {
            // Copy next three bytes into lower 24 bits of int, paying attension to sign.
            i = (sArr[s++] & 0xff) << 16 | (sArr[s++] & 0xff) << 8 |
                (sArr[s++] & 0xff);

            // Encode the int into four chars
            dArr[d++] = ca.charAt((i >> 18) & 0x3f);
            dArr[d++] = ca.charAt((i >> 12) & 0x3f);
            dArr[d++] = ca.charAt((i >> 6) & 0x3f);
            dArr[d++] = ca.charAt(i & 0x3f);
        }

        // Pad and encode last bits if source isn't even 24 bits.
        left = sLen - eLen; // 0 - 2.
        if (left > 0) {
            // Prepare the int
            i = ((sArr[eLen] & 0xff) << 10) |
                 (left == 2 ? ((sArr[sLen - 1] & 0xff) << 2) : 0);

            // Set last four chars
            dArr[dLen - 4] = ca.charAt(i >> 12);
            dArr[dLen - 3] = ca.charAt((i >> 6) & 0x3f);
            dArr[dLen - 2] = left == 2 ? ca.charAt(i & 0x3f) : '=';
            dArr[dLen - 1] = '=';
        }

        return dArr.join("");
    },

    /**
 * Decode base64 encoded string or byte array.
 *
 * @param {Array|String} input A byte array or encoded string.
 * @param {Object} urlsafe True if the encoded string is encoded by urlsafe.
 * @return {Array|String} A decoded byte array or string depends on input
 *                        argument's type.
 */
    decode: function(input, urlsafe) {
        var ia, dArr, sArr, sLen, bytes,
            sIx, eIx, pad, cCnt, sepCnt, len,
            d, cc, left,
            i, j, r;

        if(urlsafe)
            ia = Iuppiter.Base64.IAS;
        else
            ia = Iuppiter.Base64.IA;

        if(input.constructor == Array) {
            sArr = input;
            bytes = true;
        }
        else {
            sArr = Iuppiter.toByteArray(input);
            bytes = false;
        }

        sLen = sArr.length;

        sIx = 0;
        eIx = sLen - 1;    // Start and end index after trimming.

        // Trim illegal chars from start
        while (sIx < eIx && ia[sArr[sIx]] < 0)
            sIx++;

        // Trim illegal chars from end
        while (eIx > 0 && ia[sArr[eIx]] < 0)
            eIx--;

        // get the padding count (=) (0, 1 or 2)
        // Count '=' at end.
        pad = sArr[eIx] == '=' ? (sArr[eIx - 1] == '=' ? 2 : 1) : 0;
        cCnt = eIx - sIx + 1;   // Content count including possible separators
        sepCnt = sLen > 76 ? (sArr[76] == '\r' ? cCnt / 78 : 0) << 1 : 0;

        // The number of decoded bytes
        len = ((cCnt - sepCnt) * 6 >> 3) - pad;
        dArr = new Array(len);       // Preallocate byte[] of exact length

        // Decode all but the last 0 - 2 bytes.
        d = 0;
        for (cc = 0, eLen = (len / 3) * 3; d < eLen;) {
            // Assemble three bytes into an int from four "valid" characters.
            i = ia[sArr[sIx++]] << 18 | ia[sArr[sIx++]] << 12 |
                ia[sArr[sIx++]] << 6 | ia[sArr[sIx++]];

            // Add the bytes
            dArr[d++] = (i >> 16) & 0xff;
            dArr[d++] = (i >> 8) & 0xff;
            dArr[d++] = i & 0xff;

            // If line separator, jump over it.
            if (sepCnt > 0 && ++cc == 19) {
                sIx += 2;
                cc = 0;
            }
        }

        if (d < len) {
            // Decode last 1-3 bytes (incl '=') into 1-3 bytes
            i = 0;
            for (j = 0; sIx <= eIx - pad; j++)
                i |= ia[sArr[sIx++]] << (18 - j * 6);

            for (r = 16; d < len; r -= 8)
                dArr[d++] = (i >> r) & 0xff;
        }

        if(bytes) {
            return dArr;
        }
        else {
            for(i = 0; i < dArr.length; i++)
                dArr[i] = String.fromCharCode(dArr[i]);

            return dArr.join('');
        }
    }
};

Iuppiter.Base64.init();

(function() {

// Constants was used for compress/decompress function.
NBBY = 8,
MATCH_BITS = 6,
MATCH_MIN = 3,
MATCH_MAX = ((1 << MATCH_BITS) + (MATCH_MIN - 1)),
OFFSET_MASK = ((1 << (16 - MATCH_BITS)) - 1),
LEMPEL_SIZE = 256;

/**
 * Compress string or byte array using fast and efficient algorithm.
 *
 * Because of weak of javascript's natural, many compression algorithm
 * become useless in javascript implementation. The main problem is
 * performance, even the simple Huffman, LZ77/78 algorithm will take many
 * many time to operate. We use LZJB algorithm to do that, it suprisingly
 * fulfills our requirement to compress string fastly and efficiently.
 *
 * Our implementation is based on
 * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
 * usr/src/uts/common/os/compress.c
 * It is licensed under CDDL.
 *
 * Please note it depends on toByteArray utility function.
 *
 * @param {String|Array} input The string or byte array that you want to
 *                             compress.
 * @return {Array} Compressed byte array.
 */
Iuppiter.compress = function(input) {
    var sstart, dstart = [], slen,
        src = 0, dst = 0,
        cpy, copymap,
        copymask = 1 << (NBBY - 1),
        mlen, offset,
        hp,
        lempel = new Array(LEMPEL_SIZE),
        i, bytes;

    // Initialize lempel array.
    for(i = 0; i < LEMPEL_SIZE; i++)
        lempel[i] = 3435973836;

    // Using byte array or not.
    if(input.constructor == Array) {
        sstart = input;
        bytes = true;
    }
    else {
        sstart = Iuppiter.toByteArray(input);
        bytes = false;
    }

    slen = sstart.length;

    while (src < slen) {
        if ((copymask <<= 1) == (1 << NBBY)) {
            if (dst >= slen - 1 - 2 * NBBY) {
                mlen = slen;
                for (src = 0, dst = 0; mlen; mlen--)
                    dstart[dst++] = sstart[src++];
                return dstart;
            }
            copymask = 1;
            copymap = dst;
            dstart[dst++] = 0;
        }
        if (src > slen - MATCH_MAX) {
            dstart[dst++] = sstart[src++];
            continue;
        }
        hp = ((sstart[src] + 13) ^
              (sstart[src + 1] - 13) ^
               sstart[src + 2]) &
             (LEMPEL_SIZE - 1);
        offset = (src - lempel[hp]) & OFFSET_MASK;
        lempel[hp] = src;
        cpy = src - offset;
        if (cpy >= 0 && cpy != src &&
            sstart[src] == sstart[cpy] &&
            sstart[src + 1] == sstart[cpy + 1] &&
            sstart[src + 2] == sstart[cpy + 2]) {
            dstart[copymap] |= copymask;
            for (mlen = MATCH_MIN; mlen < MATCH_MAX; mlen++)
                if (sstart[src + mlen] != sstart[cpy + mlen])
                    break;
            dstart[dst++] = ((mlen - MATCH_MIN) << (NBBY - MATCH_BITS)) |
                            (offset >> NBBY);
            dstart[dst++] = offset;
            src += mlen;
        } else {
            dstart[dst++] = sstart[src++];
        }
    }

    return dstart;
};

/**
 * Decompress string or byte array using fast and efficient algorithm.
 *
 * Our implementation is based on
 * http://src.opensolaris.org/source/raw/onnv/onnv-gate/
 * usr/src/uts/common/os/compress.c
 * It is licensed under CDDL.
 *
 * Please note it depends on toByteArray utility function.
 *
 * @param {String|Array} input The string or byte array that you want to
 *                             compress.
 * @param {Boolean} _bytes Returns byte array if true otherwise string.
 * @return {String|Array} Decompressed string or byte array.
 */
Iuppiter.decompress = function(input, _bytes) {
    var sstart, dstart = [], slen,
        src = 0, dst = 0,
        cpy, copymap,
        copymask = 1 << (NBBY - 1),
        mlen, offset,
        i, bytes, get;
        
    // Using byte array or not.
    if(input.constructor == Array) {
        sstart = input;
        bytes = true;
    }
    else {
        sstart = Iuppiter.toByteArray(input);
        bytes = false;
    }    
    
    // Default output string result.
    if(typeof(_bytes) == 'undefined')
        bytes = false;
    else
        bytes = _bytes;
    
    slen = sstart.length;    
    
    get = function() {
        if(bytes) {
            return dstart;
        }
        else {
            // Decompressed string.
            for(i = 0; i < dst; i++)
                dstart[i] = String.fromCharCode(dstart[i]);

            return dstart.join('')
        }
    };   
            
	while (src < slen) {
		if ((copymask <<= 1) == (1 << NBBY)) {
			copymask = 1;
			copymap = sstart[src++];
		}
		if (copymap & copymask) {
			mlen = (sstart[src] >> (NBBY - MATCH_BITS)) + MATCH_MIN;
			offset = ((sstart[src] << NBBY) | sstart[src + 1]) & OFFSET_MASK;
			src += 2;
			if ((cpy = dst - offset) >= 0)
				while (--mlen >= 0)
					dstart[dst++] = dstart[cpy++];
			else
				/*
				 * offset before start of destination buffer
				 * indicates corrupt source data
				 */
				return get();
		} else {
			dstart[dst++] = sstart[src++];
		}
	}
    
	return get();
};

})();
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-canvas-canvastext-audio-localstorage-sessionstorage-teststyles-network_xhr2
 */
window.Modernizr = (function(window, document, undefined) {
    var version = '2.6.2',
    Modernizr = {},
    docElement = document.documentElement,
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,
    inputElem,
    toString = {}.toString,
    omPrefixes = 'Webkit Moz O ms MS',
    cssomPrefixes = omPrefixes.split(' '),
    domPrefixes = omPrefixes.toLowerCase().split(' '),
    tests = {},
    inputs = {},
    attrs = {},
    classes = [],
    slice = classes.slice,
    featureName,
    injectElementWithStyles = function(rule, callback, nodes, testnames) {
      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          body = document.body,
          fakeBody = body || document.createElement('body');
      if(parseInt(nodes, 10)) {
          while(nodes--) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if(!body) {
          fakeBody.style.background = '';
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }
      ret = callback(div, rule);
      if(!body) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }
      return !!ret;
    },
    _hasOwnProperty = ({}).hasOwnProperty,
    hasOwnProp; // End of var declaration

    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
            return _hasOwnProperty.call(object, property);
        };
    } else {
        hasOwnProp = function(object, property) { 
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }
    if(!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {
            var target = this;
            if(typeof target != "function") {
                throw new TypeError();
            }
            var args = slice.call(arguments, 1),
                bound = function() {
                    if(this instanceof bound) {
                        var F = function(){};
                        F.prototype = target.prototype;
                        var self = new F();
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;
                    } else {
                        return target.apply(that, args.concat(slice.call(arguments)));
                    }
                };
            return bound;
        };
    }
    function setCss(str) {
        mStyle.cssText = str;
    }
    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }
    function is(obj, type) {
        return typeof obj === type;
    }
    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }
    function testProps(props, prefixed) {
        for(var i in props) {
            var prop = props[i];
            if(!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    function testDOMProps(props, obj, elem) {
        for(var i in props) {
            var item = obj[props[i]];
            if(item !== undefined) {
                if (elem === false) return props[i];
                if (is(item, 'function')){
                    return item.bind(elem || obj);
                }
                return item;
            }
        }
        return false;
    }
    function testPropsAll(prop, prefixed, elem) {
        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);
        } else {
            props = (prop + ' ' + (domPrefixes.concat(cssomPrefixes)).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }
    function prefixed(prop, obj, elem){
        if(!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    };
    // Official tests
    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };
    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };
    tests['fontface'] = function() {
        var bool;
        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule) {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';
                bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });
        return bool;
    };
    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;
        try {
            if(bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/,'');
                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');
                bool.m4a = (elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;')).replace(/^no$/,'');
            }
        } catch(e) { }
        return bool;
    };
    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };
    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };
    tests['xhr2'] = function() {
        return 'FormData' in window; // means onprogress should work, not that responseType = blob will
    };
    tests['json'] = function() {
        return !!window.JSON && !!JSON.parse;
    };
    tests['filereader'] = function() {
        return !!(window.File && window.FileList && window.FileReader);
    }
    // Extra tests
    tests['xmlserializer'] = function() {
        return 'XMLSerializer' in window;
    }
    tests['overridemimetype'] = function() {
        return !!((new XMLHttpRequest()).overrideMimeType);
    }
    tests['vbarray'] = function() {
        return 'VBArray' in window;
    }
    tests['blob'] = function () {
        var bool = false;
        try {
            if(bool = 'Blob' in window) { // This is probably the wrong test
                bool = new Boolean(bool);
                bool.slice = !!(prefixed("slice", Blob.prototype, false));
                bool.builder = !!(prefixed("BlobBuilder", window, false));
                bool.url = !!(prefixed("URL", window, false));
                try {
                    var URLCreator = window[prefixed("URL", window, false)];
                    var u = URLCreator.createObjectURL(new Blob([0,0]),{autoRevoke: false});
                    bool.revoke = true;
                    URLCreator.revokeObjectURL(u);
                } catch(e) {
                    bool.revoke = false;
                }
                try {
                    bool.creator = !!new Blob();
                } catch(e) {
                    bool.creator = false;
                }
            }
        } catch(e) {}
        return bool;
    };
    tests['arraybuffer'] = function() {
        var bool = false;
        try {
            if(bool = 'ArrayBuffer' in window) {
                bool = new Boolean(bool);
                bool.dataview = !!(prefixed("Uint8Array",window,false));
            }
        } catch(e) {}
        return bool;
    }
    // Parse tests
    for(var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();
            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }
    Modernizr.addTest = function (feature, test) {
        if(typeof feature == 'object') {
            for(var key in feature) {
                if(hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {
            feature = feature.toLowerCase();
            if(Modernizr[feature] !== undefined) {
                return Modernizr;
            }
            test = typeof test == 'function' ? test() : test;
            if(typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;
        }
        return Modernizr; 
    };
    setCss('');
    modElem = inputElem = null;
    Modernizr._version = version;
    Modernizr.testStyles = injectElementWithStyles;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    Modernizr.testProp = function(prop){ return testProps([prop]); };
    Modernizr.testAllProps = testPropsAll;
    Modernizr.prefixed = prefixed;
    return Modernizr;
})(this, this.document);

// Async tests
(function(){
    var datauri = new Image();
    datauri.onerror = function() { Modernizr.addTest('datauri', function () { return false; }); };  
    datauri.onload = function() { Modernizr.addTest('datauri', function () { return (datauri.width == 1 && datauri.height == 1); }); };
    datauri.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
})();

// String trim polyfill
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}
// Array Remove - By John Resig (MIT Licensed)
if(typeof Array.prototype.remove !== 'function') {
    Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
}
// Array contains polyfill
if(typeof Array.prototype.contains !== 'function') {
    Array.prototype.contains = function(obj) {
        return this.indexOf(obj) > -1;
    };
}
// Not a polyfill but lets add it anyway
Array.prototype.destroy = function(obj) {
    var i = this.indexOf(obj);
    if(i >= 0)
        this.remove(i);
};
// window.atob and window.btoa polyfill
(function(){var a=typeof window!="undefined"?window:exports,b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=function(){try{document.createElement("$")}catch(a){return a}}();a.btoa||(a.btoa=function(a){for(var d,e,f=0,g=b,h="";a.charAt(f|0)||(g="=",f%1);h+=g.charAt(63&d>>8-f%1*8)){e=a.charCodeAt(f+=.75);if(e>255)throw c;d=d<<8|e}return h}),a.atob||(a.atob=function(a){a=a.replace(/=+$/,"");if(a.length%4==1)throw c;for(var d=0,e,f,g=0,h="";f=a.charAt(g++);~f&&(e=d%4?e*64+f:f,d++%4)?h+=String.fromCharCode(255&e>>(-2*d&6)):0)f=b.indexOf(f);return h})})();

var Sburb = (function(Sburb){
//650x450 screen
Sburb.Keys = {backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,escape:27,space:32,left:37,up:38,right:39,down:40,w:87,a:65,s:83,d:68,tilde:192};

Sburb.name = 'Jterniabound';
Sburb.version = '1.0';
Sburb.Container = null; //"deploy" div
Sburb.Game = null; //the game div
Sburb.Map = null; //the map div
Sburb.Stage = null; //the canvas, we're gonna load it up with a bunch of flash-like game data like fps and scale factors
Sburb.Bins = {}; //the various bin divs
Sburb.cam = {x:0,y:0}
Sburb.crashed = false; // In case of catastrophic failure
Sburb.stage = null; //its context
Sburb.gameState = {};
Sburb.pressed = null; //the pressed keys
Sburb.pressedOrder = null; //reverse stack of keypress order. Higher index = pushed later
Sburb.debugger = null;
Sburb.assetManager = null; //the asset loader
Sburb.assets = null; //all images, sounds, paths
Sburb.sprites = null; //all sprites that were Serial loaded
Sburb.effects = null; //all effects that were Serial loaded
Sburb.buttons = null; //all buttons that were Serial loaded
Sburb.rooms = null; //all rooms 
Sburb.char = null; //the player
Sburb.curRoom = null;
Sburb.destRoom = null; //current room, the room we are transitioning to, if it exists.
Sburb.destX = null;
Sburb.destY = null; //the desired location in the room we are transitioning to, if it exists.
Sburb.focus = null; //the focus of the camera (a sprite), usually just the char
Sburb.destFocus = null;
Sburb.chooser = null; //the option chooser
Sburb.inputDisabled = false; //disables player-control
Sburb.curAction = null; //the current action being performed
Sburb.actionQueues = [] //additional queues for parallel actions
Sburb.nextQueueId = 0; //the next created actionQueue, specified without a id, will get this number and increment it
Sburb.bgm = null; //the current background music
Sburb.hud = null; //the hud; help and sound buttons
Sburb.Mouse = {down:false,x:0,y:0}; //current recorded properties of the mouse
Sburb.waitFor = null;
Sburb.engineMode = "wander";
Sburb.fading = false;
Sburb.lastMusicTime = -1;
Sburb.musicStoppedFor = 0;
Sburb.loadingRoom = false; // Only load one room at a time
Sburb.tests = null;
Sburb.prefixed = null;
Sburb.firedAsync = false;

Sburb.updateLoop = null; //the main updateLoop, used to interrupt updating
Sburb.initFinished = null; //only used when _hardcode_load is true
Sburb._hardcode_load = null; //set to 1 when we don't want to load from XML: see initialize()
Sburb._include_dev = false;
var lastDrawTime = 0;

Sburb.testCompatibility = function(div, levelName, includeDevTools) {
    if(Modernizr.xhr2 && !Sburb.firedAsync) {
      try {  
        // Test blob response
        var xhr = new XMLHttpRequest();
        xhr.open("GET",levelName,true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            if((this.status == 200 || this.status == 0) && this.response) {
                Modernizr.addTest('xhrblob', function () { return true; }); // TODO: Test if this.response is actually a blob?
            } else {
                Modernizr.addTest('xhrblob', function () { return false; });
            }
        }
        xhr.onabort = function() { Modernizr.addTest('xhrblob', function () { return false; }); };
        xhr.onerror = function() { Modernizr.addTest('xhrblob', function () { return false; }); };
        xhr.send();
        
        // Test Arraybuffer response
        xhr = new XMLHttpRequest();
        xhr.open("GET",levelName,true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if((this.status == 200 || this.status == 0) && this.response) {
                var arr = this.response;
                Modernizr.addTest('xhrarraybuffer', function () { return true; }); // TODO: test if this.response is actually an arraybuffer?
            } else {
                Modernizr.addTest('xhrarraybuffer', function () { return false; });
            }
        }
        xhr.onabort = function() { Modernizr.addTest('xhrarraybuffer', function () { return false; }); };
        xhr.onerror = function() { Modernizr.addTest('xhrarraybuffer', function () { return false; }); };
        xhr.send();
      } catch (e) {
        alert(e.message + "\n\nIf you are running Google Chrome, you need to run it with the -allow-file-access-from-files switch to load this.")
      }
        
        Sburb.firedAsync = true;
    } else {
        Modernizr.addTest('xhrblob', function () { return false; });
        Modernizr.addTest('xhrarraybuffer', function () { return false; });
    }
    
    // Make sure Modernizr finished loading async tests
    if(!('xhrblob' in Modernizr && 'xhrarraybuffer' in Modernizr && 'datauri' in Modernizr)) {
        setTimeout(function() { Sburb.initialize(div, levelName, includeDevTools); }, 200);
        Sburb.crashed = true;
        return;
    }
    
    // Use Modernizr to test compatibility
    var errors = [];
    if(!Modernizr.fontface)                                     errors.push("- Lack of CSS @font-face support.");
    if(!Modernizr.canvas)                                       errors.push("- Lack of canvas support.");
    if(!Modernizr.canvastext)                                   errors.push("- Lack of canvas text support.");
    if(!Modernizr.json)                                         errors.push("- Lack of JSON support.");
    if(!Modernizr.xmlserializer)                                errors.push("- Lack of XMLSerializer support.");
    
    if(errors.length) {
        // Display what failed
        var deploy = '<div style="padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; width:650px; height:450px; overflow: auto;">';
        deploy += '<p style="font-weight: bold;">Your browser is too old. Here are the problems we found:</p>';
        for(var i=0; i < errors.length; i++)
            deploy += '<p>'+errors[i]+'</p>';
        deploy += '<p>Maybe try Chrome instead?</p>';
        deploy += '</div>';
        document.getElementById(div).innerHTML = deploy;
        Sburb.crashed = true; // Stop initialization
    } else {
        Sburb.prefixed = Modernizr.prefixed;
        Sburb.tests = {};
        Sburb.tests['blobrevoke'] = Modernizr.blob && Modernizr.blob.revoke;
        if(Modernizr.audio && (Modernizr.audio.mp3 || Modernizr.audio.ogg)) {
            Sburb.tests['audio'] = new Boolean(true);
            Sburb.tests.audio.mp3 = Modernizr.audio.mp3;
            Sburb.tests.audio.ogg = Modernizr.audio.ogg;
        } else {
            Sburb.tests['audio'] = false;
        }
        if(Modernizr.localstorage || Modernizr.sessionstorage) {
            Sburb.tests['storage'] = new Boolean(true);
            Sburb.tests.storage.local = Modernizr.localstorage;
            Sburb.tests.storage.session = Modernizr.sessionstorage;
        } else {
            Sburb.tests['storage'] = false;
        }
        
        // Caution, weirdness ahead. Tests in order of preference, future tests should use increasing numbers. Do not change existing constants.
        // To deprecate a test, move it to the bottom of the list. To make it obsolete, comment it out.
        // Assets.js and Debugger.js are the only files to reference these constants
        Sburb.tests['loading'] = 0; // Just pass raw URL to elements
        if(Modernizr.xhrblob && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.creator) {
            Sburb.tests.loading = 11; // Load as blob, pass to blob constructor and generate Blob URI
        } else if(Modernizr.xhrblob && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.builder) {
            Sburb.tests.loading = 10; // Load as blob, pass to blob builder and generate Blob URI
        } else if(Modernizr.xhrblob && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.slice) {
            Sburb.tests.loading = 9; // Load as blob, pass to blob.slice and generate Blob URI
        } else if(Modernizr.xhrblob && Modernizr.datauri && Modernizr.filereader) {
            Sburb.tests.loading = 8; // Load as blob, pass to file reader and generate Data URI
        } else if(Modernizr.xhrarraybuffer && Modernizr.arraybuffer && Modernizr.arraybuffer.dataview && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.creator) {
            Sburb.tests.loading = 7; // Load as arraybuffer, convert to data view, pass to blob constructor and generate Blob URI
        } else if(Modernizr.xhrarraybuffer && Modernizr.arraybuffer && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.creator) {
            Sburb.tests.loading = 6; // Load as arraybuffer, use hacks to pass to blob constructor and generate Blob URI
        } else if(Modernizr.xhrarraybuffer && Modernizr.arraybuffer && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.builder) {
            Sburb.tests.loading = 5; // Load as arraybuffer, pass to blob builder and generate Blob URI
        } else if(Modernizr.xhrarraybuffer && Modernizr.arraybuffer && Modernizr.arraybuffer.dataview && Modernizr.datauri) {
            Sburb.tests.loading = 4; // Load as arraybuffer, convert to base 64 and generate Data URI
        } else if(Modernizr.overridemimetype && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.creator && Modernizr.arraybuffer && Modernizr.arraybuffer.dataview) {
            Sburb.tests.loading = 3; // Load as string, convert to arraybuffer, pass to blob constructor and generate Blob URI
        } else if(Modernizr.overridemimetype && Modernizr.blob && Modernizr.blob.url && Modernizr.blob.builder && Modernizr.arraybuffer && Modernizr.arraybuffer.dataview) {
            Sburb.tests.loading = 2; // Load as string, convert to arraybuffer, pass to blob builder and generate Blob URI
        } else if(Modernizr.overridemimetype && Modernizr.datauri) {
            Sburb.tests.loading = 1; // Load as string, clean it up, convert to base 64 and generate Data URI
        } else if(Modernizr.vbarray && Modernizr.datauri) {
            Sburb.tests.loading = 12; // Load as god knows what, use IE hacks, convert to base 64 and generate Data URI
        }
    }
}

Sburb.initialize = function(div,levelName,includeDevTools){
    Sburb.crashed = false;
    Sburb.testCompatibility(div, levelName, includeDevTools);
    if(Sburb.crashed)
        return; // Hard crash if the browser is too old. testCompatibility() will handle the error message
	Sburb.debugger = new Sburb.Debugger(); // Load debugger first! -- But not quite
    
    var deploy = document.createElement('div');
    deploy.style.position = "relative";
    deploy.style.padding = "0";
    deploy.style.margin = "auto";
    
	var gameDiv = document.createElement('div');
    gameDiv.id = "SBURBgameDiv";
	gameDiv.onkeydown = _onkeydown;
	gameDiv.onkeyup = _onkeyup;
    gameDiv.style.position = "absolute";
    gameDiv.style.zIndex = "100";
    deploy.appendChild(gameDiv);
	
	var movieDiv = document.createElement('div');
    movieDiv.id = "SBURBmovieBin";
    movieDiv.style.position = "absolute";
    movieDiv.style.zIndex = "200";
    deploy.appendChild(movieDiv);
    
	var fontDiv = document.createElement('div');
    fontDiv.id = "SBURBfontBin";
    deploy.appendChild(fontDiv);
    
	var gifDiv = document.createElement('div');
    gifDiv.id = "SBURBgifBin";
    gifDiv.style.width = "0";
    gifDiv.style.height = "0";
    gifDiv.style.overflow = "hidden";
    deploy.appendChild(gifDiv);
    
	var gameCanvas = document.createElement("canvas");
    gameCanvas.id = "SBURBStage";
    gameCanvas.onmousedown = function(e) { Sburb.onMouseDown(e,this); };
    gameCanvas.onmouseup = function(e) { Sburb.onMouseUp(e,this); };
    gameCanvas.onmousemove = function(e) { Sburb.onMouseMove(e,this); };
    gameCanvas.tabIndex = 0;
	gameCanvas.scaleX = gameCanvas.scaleY = 3;
	gameCanvas.x = gameCanvas.y = 0;
	gameCanvas.fps = 30;
	gameCanvas.fade = 0;
	gameCanvas.fadeRate = 0.1;
    gameCanvas.innerText = "ERROR: Your browser is too old to display this content!";
    gameDiv.appendChild(gameCanvas);
    
	var mapCanvas = document.createElement("canvas");
    mapCanvas.id = "SBURBMapCanvas";
    mapCanvas.width = 1;
    mapCanvas.height = 1;
    mapCanvas.style.display = "none";
    gameDiv.appendChild(mapCanvas);
	
    targetDiv = document.getElementById(div)
    while (c = targetDiv.firstChild) {
        targetDiv.removeChild(c);
    }
	targetDiv.appendChild(deploy);
    
    // Copy local variables into Sburb
    Sburb.Container = deploy;
    Sburb.Game = gameDiv;
    Sburb.Map = mapCanvas;
    Sburb.Stage = gameCanvas;
    Sburb.Bins["movie"] = movieDiv;
    Sburb.Bins["font"] = fontDiv;
    Sburb.Bins["gif"] = gifDiv;
    
    // Set default dimensions
    Sburb.setDimensions(650,450);
    
	Sburb.stage = Sburb.Stage.getContext("2d");
	Sburb.Stage.onblur = _onblur;
	Sburb.chooser = new Sburb.Chooser();
	Sburb.dialoger = null;
    Sburb.assetManager = new Sburb.AssetManager();
	Sburb.assets = Sburb.assetManager.assets; // shortcut for raw asset access
	Sburb.rooms = {};
	Sburb.sprites = {};
	Sburb.effects = {};
	Sburb.buttons = {};
	Sburb.hud = {};
	Sburb.gameState = {};
	Sburb.pressed = {};
	Sburb.pressedOrder = [];
    
    Sburb.loadSerialFromXML(levelName); // comment out this line and
    //loadAssets();                        // uncomment these two lines, to do a standard hardcode load
    //_hardcode_load = 1;
}

Sburb.setDimensions = function(width, height) {
    if(width) {
        Sburb.Container.style.width = width+"px";
        Sburb.Stage.width = width;
    }
    if(height) {
        Sburb.Container.style.height = height+"px";
        Sburb.Stage.height = height;
    }
}

function startUpdateProcess(){
	haltUpdateProcess();
	Sburb.assetManager.stop();
	Sburb.updateLoop=setInterval(update,1000/Sburb.Stage.fps);
	Sburb.drawLoop=setInterval(draw,1000/(DRAW_FPS));
}

function haltUpdateProcess(){
	if(Sburb.updateLoop){
		clearInterval(Sburb.updateLoop);
		clearInterval(Sburb.drawLoop);
		Sburb.updateLoop = Sburb.drawLoop = null;
	}
	Sburb.assetManager.start();
}

function update(){
	//update stuff
	handleAudio();
	handleInputs();
	handleHud();
	
	if(!Sburb.loadingRoom)
	    Sburb.curRoom.update();
	
	focusCamera();
	handleRoomChange();
	Sburb.chooser.update();
	Sburb.dialoger.update();
	chainAction();
	updateWait();
}

function draw(){
	//stage.clearRect(0,0,Stage.width,Stage.height);
	if(!Sburb.playingMovie){
		Sburb.stage.save();
		Sburb.Stage.offset = true;
		Sburb.stage.translate(-Sburb.Stage.x,-Sburb.Stage.y);
	
		Sburb.curRoom.draw();
	
		Sburb.stage.restore();
		Sburb.Stage.offset = false;
	
		if(Sburb.Stage.fade>0.1){
			Sburb.stage.fillStyle = "rgba(0,0,0,"+Sburb.Stage.fade+")";
			Sburb.stage.fillRect(0,0,Sburb.Stage.width,Sburb.Stage.height);
		}
	
		Sburb.dialoger.draw();
		drawHud();
	
		Sburb.stage.save();
		Sburb.Stage.offset = true;
		Sburb.stage.translate(-Sburb.Stage.x,-Sburb.Stage.y);
	
		Sburb.chooser.draw();
	
		Sburb.stage.restore();
		Sburb.Stage.offset = false;
		
	    Sburb.debugger.draw();
	}
}

var _onkeydown = function(e){
    if(Sburb.updateLoop && !Sburb.inputDisabled) { // Make sure we are loaded before trying to do things
	    if(Sburb.chooser.choosing){
		    if(e.keyCode == Sburb.Keys.down || e.keyCode==Sburb.Keys.s){
			    Sburb.chooser.nextChoice();
		    }
		    if(e.keyCode == Sburb.Keys.up || e.keyCode==Sburb.Keys.w){
			    Sburb.chooser.prevChoice();
		    }
		    if(e.keyCode == Sburb.Keys.space && !Sburb.pressed[Sburb.Keys.space]){
			    Sburb.performAction(Sburb.chooser.choices[Sburb.chooser.choice]);
			    Sburb.chooser.choosing = false;
		    }
	    }else if(Sburb.dialoger.talking){
		    if(e.keyCode == Sburb.Keys.space && !Sburb.pressed[Sburb.Keys.space]){
			    Sburb.dialoger.nudge();
		    }
	    }else if(hasControl()){
		    if(e.keyCode == Sburb.Keys.space && !Sburb.pressed[Sburb.Keys.space] && Sburb.engineMode=="wander"){
			    Sburb.chooser.choices = [];
			    var queries = Sburb.char.getActionQueries();
			    for(var i=0;i<queries.length;i++){
				    Sburb.chooser.choices = Sburb.curRoom.queryActions(Sburb.char,queries[i].x,queries[i].y);
				    if(Sburb.chooser.choices.length>0){
					    break;
				    }
			    }
			    if(Sburb.chooser.choices.length>0){
				    Sburb.chooser.choices.push(new Sburb.Action("cancel","cancel","Cancel."));
				    beginChoosing();
			    }
		    }
	    }
	}
    /* There is a theoretical race condition here
       in which pressing a key within the milliseconds
       between injecting the canvas into the dom
       and initializing Sburb.pressed and Sburb.pressedOrder
       could throw an exception.
       
       I'm not too worried about it. -Fugi */
	if(!Sburb.pressed[e.keyCode])
	    Sburb.pressedOrder.push(e.keyCode);
	Sburb.pressed[e.keyCode] = true;
    // return true if we want to pass keys along to the browser, i.e. Ctrl-N for a new window
    if(e.altKey || e.ctrlKey || e.metaKey) {
		// don't muck with system stuff
		return true;
    }
    return false;
}

var _onkeyup = function(e){
    // See _onkeydown for race condition warning
    if(Sburb.pressed[e.keyCode])
    	Sburb.pressedOrder.destroy(e.keyCode);
	Sburb.pressed[e.keyCode] = false;
}

function purgeKeys(){
    // See _onkeydown for race condition warning
	Sburb.pressed = {};
	Sburb.pressedOrder = [];
}

var _onblur = function(e){
    // See _onkeydown for race condition warning
	purgeKeys();
}

Sburb.onMouseMove = function(e,canvas){
    // See _onkeydown for race condition warning
	var point = relMouseCoords(e,canvas);
	Sburb.Mouse.x = point.x;
	Sburb.Mouse.y = point.y;
}

Sburb.onMouseDown = function(e,canvas){
    if(!Sburb.updateLoop) return; // Make sure we are loaded before trying to do things
	if(Sburb.engineMode=="strife" && hasControl()){
		Sburb.chooser.choices = Sburb.curRoom.queryActionsVisual(Sburb.char,Sburb.Stage.x+Sburb.Mouse.x,Sburb.Stage.y+Sburb.Mouse.y);
		if(Sburb.chooser.choices.length>0){
			Sburb.chooser.choices.push(new Sburb.Action("cancel","cancel","cancel"));
			beginChoosing();
		}
	}
	Sburb.Mouse.down = true;
	
}

Sburb.onMouseUp = function(e,canvas){
	Sburb.Mouse.down = false;
    if(!Sburb.updateLoop) return; // Make sure we are loaded before trying to do things
	if(Sburb.dialoger && Sburb.dialoger.box && Sburb.dialoger.box.isVisuallyUnder(Sburb.Mouse.x,Sburb.Mouse.y)){
		Sburb.dialoger.nudge();
	}
}

function relMouseCoords(event,canvas){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = canvas;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)
    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    return {x:canvasX,y:canvasY};
}

function handleAudio(){
	if(Sburb.bgm && Sburb.bgm.asset){
		if(Sburb.bgm.asset.ended || Sburb.bgm.asset.currentTime>=Sburb.bgm.asset.duration ){
			Sburb.bgm.loop();
		}
		if (Sburb.lastMusicTime == Sburb.bgm.asset.currentTime){
			Sburb.musicStoppedFor++;
			if(Sburb.musicStoppedFor>4){
		    Sburb.bgm.asset.pause(); 
		    Sburb.bgm.asset.play(); // asset.play() because sometimes this condition is true on startup
		  }
    }else{
    	Sburb.musicStoppedFor = 0;
    }
		if(Sburb.bgm.asset.paused){
		//	console.log("The sound is paused??? THIS SHOULD NOT BE.");
			Sburb.bgm.play();
		}
		Sburb.lastMusicTime = Sburb.bgm.asset.currentTime;
	}else{
		//console.log("The music doesn't exist!");
	}
}

function handleInputs(){
	if(Sburb.Stage){
		Sburb.Stage.style.cursor = "default";
	}
	if(hasControl() && !Sburb.inputDisabled){
		Sburb.char.handleInputs(Sburb.pressed, Sburb.pressedOrder);
	}else{
		Sburb.char.moveNone();
	}
	Sburb.debugger.handleInputs(Sburb.pressed);
}

function handleHud(){
	for(var content in Sburb.hud){
	    if(!Sburb.hud.hasOwnProperty(content)) continue;
	    var obj = Sburb.hud[content];
	    obj.update();
	}
}

function drawHud(){
	for(var content in Sburb.hud){
	    if(!Sburb.hud.hasOwnProperty(content)) continue;
	    Sburb.hud[content].draw();
	}
}

function hasControl(){
	return !Sburb.dialoger.talking 
		&& !Sburb.chooser.choosing 
		&& !Sburb.destRoom  
		&& !Sburb.fading 
		&& !Sburb.destFocus;
}

function focusCamera(){
	//need to divide these by scaleX and scaleY if repurposed
	if(!Sburb.destFocus){
		if(Sburb.focus){
			Sburb.cam.x = Sburb.focus.x-Sburb.Stage.width/2;
			Sburb.cam.y = Sburb.focus.y-Sburb.Stage.height/2;
		}
	}else if(Math.abs(Sburb.destFocus.x-Sburb.cam.x-Sburb.Stage.width/2)>4 || Math.abs(Sburb.destFocus.y-Sburb.cam.y-Sburb.Stage.height/2)>4){
		Sburb.cam.x += (Sburb.destFocus.x-Sburb.Stage.width/2-Sburb.cam.x)/5;
		Sburb.cam.y += (Sburb.destFocus.y-Sburb.Stage.height/2-Sburb.cam.y)/5;
	}else{
		Sburb.focus = Sburb.destFocus;
		Sburb.destFocus = null;
	}
	Sburb.Stage.x = Math.max(0,Math.min(Math.round(Sburb.cam.x/Sburb.Stage.scaleX)*Sburb.Stage.scaleX,Sburb.curRoom.width-Sburb.Stage.width));
	Sburb.Stage.y = Math.max(0,Math.min(Math.round(Sburb.cam.y/Sburb.Stage.scaleX)*Sburb.Stage.scaleX,Sburb.curRoom.height-Sburb.Stage.height));
}

function handleRoomChange(){
	if(Sburb.destRoom || Sburb.fading){
		if(Sburb.Stage.fade<1.1){
			Sburb.Stage.fade=Math.min(1.1,Sburb.Stage.fade+Sburb.Stage.fadeRate);
		}else if(Sburb.destRoom){
			var deltaX = Sburb.destX-Sburb.char.x; 
			var deltaY = Sburb.destY-Sburb.char.y; 
			var curSprite = Sburb.char;
			while(curSprite){
				curSprite.x+=deltaX;
				curSprite.y+=deltaY;
				curSprite.followBuffer = [];
				curSprite = curSprite.follower;
			}
			Sburb.moveSprite(Sburb.char,Sburb.curRoom,Sburb.destRoom);
			Sburb.curRoom.exit();
			Sburb.curRoom = Sburb.destRoom;
			Sburb.curRoom.enter();
			Sburb.destRoom = null;
		}else{
			Sburb.fading = false;
		}
	}else if(hasControl() && Sburb.Stage.fade>0.01){
		Sburb.Stage.fade=Math.max(0.01,Sburb.Stage.fade-Sburb.Stage.fadeRate);
		//apparently alpha 0 is buggy?
	}
}

function beginChoosing(){
	Sburb.char.idle();
	Sburb.chooser.beginChoosing(Sburb.char.x,Sburb.char.y);
}

function chainAction(){
	if(Sburb.curAction) {
		chainActionInQueue(Sburb);
	}
	for(var i=0;i<Sburb.actionQueues.length;i++) {
		var queue=Sburb.actionQueues[i];
		if(!queue.curAction) {
			Sburb.actionQueues.remove(i);
			i--;
			continue;
		}
		if(queue.paused || queue.waitFor) {
			if((queue.trigger && queue.trigger.checkCompletion()) 
                || queue.waitFor) {
				queue.paused = false;
				queue.trigger = null;
			} else {
				continue;
			}
		}
        chainActionInQueue(queue);
	}
}    

function chainActionInQueue(queue) {
	if(queue.curAction.times<=0){
		if(queue.curAction.followUp){
			if(hasControl() || queue.curAction.followUp.noWait || queue.noWait){
				Sburb.performAction(queue.curAction.followUp,queue);
			}
		}else{
			queue.curAction = null;
		}
	}else if(hasControl() || queue.curAction.noWait || queue.noWait){
		Sburb.performAction(queue.curAction,queue);
	}
}

function updateWait(){
	if(Sburb.waitFor){
		if(Sburb.waitFor.checkCompletion()){
			Sburb.waitFor = null;
		}
	}
    if(Sburb.inputDisabled && Sburb.inputDisabled.checkCompletion){
        if(Sburb.inputDisabled.checkCompletion()){
            Sburb.inputDisabled = false;
        }
    }
}

Sburb.performAction = function(action, queue){
	if(action.silent){
		if((action.times==1)&&(!action.followUp)) {
			Sburb.performActionSilent(action);
			return null;
		}
		if((!queue)||(queue==Sburb)) {
			if(action.silent===true) {
				queue=new Sburb.ActionQueue(action);
			} else {
				var options=action.silent.split(":");
				var noWait=(options[0]=="full")?true:false;
				var id=null;
				if(noWait) {
					options.shift();
				}
				if(options.length>0) {
					id=options.shift();
				}
				queue=new Sburb.ActionQueue(action,id,options,noWait);
			}
			Sburb.actionQueues.push(queue);
		}
	}
	if(queue&&(queue!=Sburb)) {
		performActionInQueue(action, queue);
		return queue;
	}
	if(((Sburb.curAction && Sburb.curAction.followUp!=action && Sburb.curAction!=action) || !hasControl()) && action.soft){
		return null;
	}
	performActionInQueue(action, Sburb);
	return null;
}

function performActionInQueue(action, queue) {
	var looped = false;
	queue.curAction = action.clone();
	do{
		if(looped){
			queue.curAction = queue.curAction.followUp.clone();
		}
       	var result = Sburb.performActionSilent(queue.curAction);
        handleCommandResult(queue,result);
       	looped = true;
	}while(queue.curAction && queue.curAction.times<=0 && queue.curAction.followUp && queue.curAction.followUp.noDelay);
}

Sburb.performActionSilent = function(action){
	action.times--;
	var info = action.info();
	if(info){
		info = info.trim();
	}
	return Sburb.commands[action.command.trim()](info);
}

function handleCommandResult(queue,result){
    if(result){
        if(queue.hasOwnProperty("trigger")){
            queue.paused = true;
            queue.trigger = result;
        }else{
            queue.waitFor = result;
        }
    }
}



Sburb.changeRoom = function(newRoom,newX,newY){
	Sburb.destRoom = newRoom;
	Sburb.destX = newX;
	Sburb.destY = newY;
}



Sburb.moveSprite = function(sprite,oldRoom,newRoom){
	var curSprite = sprite;
	while(curSprite){
		oldRoom.removeSprite(curSprite);
		newRoom.addSprite(curSprite);
		curSprite = curSprite.follower;
	}
}



Sburb.setCurRoomOf = function(sprite){
	if(!Sburb.curRoom.contains(sprite)){
		for(var room in Sburb.rooms){
		    if(!Sburb.rooms.hasOwnProperty(room)) continue;
		    if(Sburb.rooms[room].contains(sprite)){
			    Sburb.changeRoom(Sburb.rooms[room],Sburb.char.x,Sburb.char.y);
			    return;
		    }
		}
	}
}

Sburb.changeBGM = function(newSong) {
    if(newSong){
		if(Sburb.bgm) {
			if (Sburb.bgm.asset == newSong.asset && Sburb.bgm.startLoop == newSong.startLoop) {
				// maybe check for some kind of restart value
				return;
			}
			Sburb.bgm.stop();
		}
		Sburb.bgm = newSong;
		Sburb.bgm.stop();
		Sburb.bgm.play();
    }
}

Sburb.playEffect = function(effect,x,y){
	Sburb.curRoom.addEffect(effect.clone(x,y));
}

Sburb.playSound = function(sound){
	sound.stop();
	sound.play();
}

Sburb.playMovie = function(movie){
	var name = movie.name;
	document.getElementById(name).style.display = "block";
	Sburb.waitFor = new Sburb.Trigger("movie,"+name+",5");
	Sburb.playingMovie = true;
}

Sburb.startUpdateProcess = startUpdateProcess;
Sburb.haltUpdateProcess = haltUpdateProcess;
Sburb.draw = draw;
return Sburb;
})(Sburb || {});

    
var Sburb = (function(Sburb){




//////////////////////////////////////////
//Sprite Class
//////////////////////////////////////////

function Sprite(name,x,y,width,height,dx,dy,depthing,collidable){
	this.x = x;
	this.y = y;
	this.dx = typeof dx == "number" ? dx : 0;
	this.dy = typeof dy == "number" ? dy : 0;
	this.width = width;
	this.height = height;
	this.depthing = typeof depthing == "number" ? depthing : this.BG_DEPTHING; //bg, fg, or mg
	this.collidable = typeof collidable == "boolean" ? collidable : false;
	this.animations = {};
	this.animation = null;
	this.state = null;
	this.lastTime = 0;
	this.actions = [];
	this.name = name;
	this.queries = null;
}

Sprite.prototype.BG_DEPTHING = 0;
Sprite.prototype.MG_DEPTHING = 1;
Sprite.prototype.FG_DEPTHING = 2;

Sprite.prototype.addAnimation = function(anim){
	this.animations[anim.name] = anim;
}

Sprite.prototype.startAnimation = function(name){
	if(this.state!=name && this.animations[name]){
		this.animation = this.animations[name];
		this.animation.reset();
		this.state = name;
	}
}

Sprite.prototype.update = function(curRoom){
	if(this.animation){
		if(this.animation.hasPlayed() && this.animation.followUp){
			this.startAnimation(this.animation.followUp);
		}else{
			this.animation.update();
		}
	}
}

Sprite.prototype.draw = function(){
	if(this.animation){
		this.animation.draw(this.x,this.y);
	}
}


Sprite.prototype.isBehind = function(other){
	if(this.depthing == other.depthing){
		return this.y+this.dy<other.y+other.dy;
	}else{
		return this.depthing<other.depthing;
	}
}

Sprite.prototype.collides = function(other,dx,dy){
	var x = this.x+(dx?dx:0);
	var y = this.y+(dy?dy:0);
	if(other.collidable){
		if( (x-this.width/2<other.x+other.width/2) &&
			 (x+this.width/2>other.x-other.width/2) &&
			 (y-this.height/2<other.y+other.height/2) &&
			 (y+this.height/2>other.y-other.height/2) ) {
			 return true;
		}
	}
	return false;
}
Sprite.prototype.hitsPoint = function(x,y){
	if( (this.x-this.width/2 <=x) &&
		(this.x+this.width/2 >=x) &&
		(this.y-this.height/2 <=y) &&
		(this.y+this.height/2 >=y) ) {
		return true;
	}
    return false;
}

Sprite.prototype.isVisuallyUnder = function(x,y){
	return this.animation && this.animation.isVisuallyUnder(x-this.x,y-this.y);
}

Sprite.prototype.addAction = function(action){
	this.actions.push(action);
}

Sprite.prototype.removeAction = function(name){
	for(var i=0;i<this.actions.length;i++){
		if(this.actions[i].name==name){
			this.actions.splice(i,1);
			return;
		}
	}
}

Sprite.prototype.getActions = function(sprite){
	var validActions = [];
	for(var i=0;i<this.actions.length;i++){
		var action = this.actions[i];
		var desired = action.sprite;
		if(!desired || desired==sprite.name
			|| (desired.charAt(0)=="!" && desired.substring(1)!=sprite.name)){
			validActions.push(action);
		}
	}
	return validActions;
}

Sprite.prototype.getBoundaryQueries = function(dx,dy){
	var spriteX = this.x+(dx?dx:0);
	var spriteY = this.y+(dy?dy:0);
	var w = this.width/2;
	var h = this.height/2;
	if(!this.queries){
		this.queries = {upRight:{},upLeft:{},downLeft:{},downRight:{},downMid:{},upMid:{}};
	}
	this.queries.upRight.x=spriteX+w;
	this.queries.upRight.y=spriteY-h;
	this.queries.upLeft.x=spriteX-w;
	this.queries.upLeft.y=spriteY-h;
	this.queries.downLeft.x=spriteX-w;
	this.queries.downLeft.y=spriteY+h;
	this.queries.downRight.x=spriteX+w;
	this.queries.downRight.y=spriteY+h;
	this.queries.downMid.x=spriteX;
	this.queries.downMid.y=spriteY+h;
	this.queries.upMid.x=spriteX;
	this.queries.upMid.y=spriteY-h;
	return this.queries;
}

Sprite.prototype.serialize = function(output){
	var animationCount = 0;
	for(var anim in this.animations){
        if(!this.animations.hasOwnProperty(anim)) continue;
        animationCount++;
	}
	
	output = output.concat("\n<sprite "+
		Sburb.serializeAttributes(this,"name","x","y","dx","dy","width","height","depthing","collidable")+
		(animationCount>1?"state='"+this.state+"' ":"")+
		">");

	for(var anim in this.animations){
        if(!this.animations.hasOwnProperty(anim)) continue;
		output = this.animations[anim].serialize(output);
	}
	for(var i=0; i < this.actions.length; i++){
		output = this.actions[i].serialize(output);
	}
	output = output.concat("\n</sprite>");
	return output;
}

Sprite.prototype.clone = function(newName) {
	var newSprite = new Sburb.Sprite(newName,this.x,this.y,this.width,this.height,this.dx,this.dy,this.depthing,this.collidable);
	for(var anim in this.animations) {
		if(this.animations.hasOwnProperty(anim)) {
			newSprite.addAnimation(this.animations[anim].clone());
		}
	}
	for(var action in this.actions) {
		if(this.actions.hasOwnProperty(action)) {
			newSprite.addAction(this.actions[action].clone());
		}
	}
	if(this.animation) {
		newSprite.startAnimation(this.animation.name);
	}
	Sburb.sprites[newName]=newSprite;
	return newSprite;
}





///////////////////////////////////////////
//Related Utility Functions
///////////////////////////////////////////

Sburb.parseSprite = function(spriteNode, assetFolder) {
	var attributes = spriteNode.attributes;
	
	var newName = null;
	var newX = 0;
	var newY = 0;
	var newWidth = 0;
	var newHeight = 0;
	var newDx = 0;
	var newDy = 0;
	var newDepthing = 0;
	var newCollidable = false;
	var newState = null;
	var newAnimations = {};

	var temp;
	newName = (temp=attributes.getNamedItem("name"))?temp.value:newName;
	newX = (temp=attributes.getNamedItem("x"))?parseInt(temp.value):newX;
	newY = (temp=attributes.getNamedItem("y"))?parseInt(temp.value):newY;
	newWidth = (temp=attributes.getNamedItem("width"))?parseInt(temp.value):newWidth;
	newHeight = (temp=attributes.getNamedItem("height"))?parseInt(temp.value):newHeight;
	newDx = (temp=attributes.getNamedItem("dx"))?parseInt(temp.value):newDx;
	newDy = (temp=attributes.getNamedItem("dy"))?parseInt(temp.value):newDy;
	newDepthing = (temp=attributes.getNamedItem("depthing"))?parseInt(temp.value):newDepthing;
	newCollidable = (temp=attributes.getNamedItem("collidable"))?temp.value!="false":newCollidable;
	newState = (temp=attributes.getNamedItem("state"))?temp.value:newState;
	
 	var newSprite = new Sprite(newName,newX,newY,newWidth,newHeight,newDx,newDy,newDepthing,newCollidable);
	
	
	var anims = spriteNode.getElementsByTagName("animation");
	for(var j=0;j<anims.length;j++){
		var newAnim = Sburb.parseAnimation(anims[j],assetFolder);
		newSprite.addAnimation(newAnim);
		if(newState==null){
			newState = newAnim.name;
		}
	}
	if(anims.length==0) {
		var asset = Sburb.assets[newName];
		if(asset && asset.type == "graphic") {
			newSprite.addAnimation(new Sburb.Animation("image",asset));
			newState = "image";
		}
	}
	newSprite.startAnimation(newState);
	
	return newSprite;
}




Sburb.Sprite = Sprite;

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




////////////////////////////////////////
//Fighter Class (inherits Sprite)
////////////////////////////////////////

//Fighter
Sburb.Fighter = function(name,x,y,width,height){
	Sburb.Sprite.call(this,name,x,y,width,height,null,null,Sburb.Sprite.prototype.MG_DEPTHING,true);
	
	this.accel = 1.5;
	this.decel = 1;
	this.friction = 0.87;
	this.vx = 0;
	this.vy = 0;
	this.facing = "Right";
}

Sburb.Fighter.prototype = new Sburb.Sprite();

//update the Fighter one frame
Sburb.Fighter.prototype.update = function(curRoom){
	this.tryToMove(curRoom);
	Sburb.Sprite.prototype.update.call(this,curRoom);
	this.animation.flipX = (this.facing=="Left");
}

//parse keyboard input into movements
Sburb.Fighter.prototype.handleInputs = function(pressed){
	var moved = false;
	if(pressed[Sburb.Keys.down] || pressed[Sburb.Keys.s]){
		this.moveDown(); moved = true;
	}else if(pressed[Sburb.Keys.up] || pressed[Sburb.Keys.w]){
		this.moveUp(); moved = true;
	}
	if(pressed[Sburb.Keys.left] || pressed[Sburb.Keys.a]){
		this.moveLeft(); moved = true;
	}else if(pressed[Sburb.Keys.right] || pressed[Sburb.Keys.d]){
		this.moveRight(); moved = true;
	}
	if(pressed[Sburb.Keys.space] || pressed[Sburb.Keys.enter] || pressed[Sburb.Keys.ctrl]){
		this.attack();
	}
	if(!moved){
		this.idle();
	}
}

//stand still
Sburb.Fighter.prototype.idle = function(){
	if(this.state=="walk"){
		this.startAnimation("idle");
	}
}

//walk
Sburb.Fighter.prototype.walk = function(){
	if(this.state=="idle"){
		this.startAnimation("walk");
	}
}

//attack
Sburb.Fighter.prototype.attack = function(){
	this.startAnimation("attack");
}

//impulse fighter to move up
Sburb.Fighter.prototype.moveUp = function(){
	this.walk();
	this.vy-=this.accel;
}
//impulse fighter to move down
Sburb.Fighter.prototype.moveDown = function(){
	this.walk();
	this.vy+=this.accel;
}
//impulse fighter to move left
Sburb.Fighter.prototype.moveLeft = function(){
	this.walk();
	this.vx-=this.accel;
	this.facing = "Left";
}
//impulse fighter to move right
Sburb.Fighter.prototype.moveRight = function(){
	this.walk();
	this.vx+=this.accel;
	this.facing = "Right";
}
Sburb.Fighter.prototype.moveNone = function(){

}

//behave as a PC
Sburb.Fighter.prototype.becomePlayer = function(){

}

//behave as an NPC
Sburb.Fighter.prototype.becomeNPC = function(){
}

//get all the locations the Fighter would wich to query for actions
Sburb.Fighter.prototype.getActionQueries = function(){
	var queries = [];
	return queries;
}

//determine if the Fighter collides with the given sprite, if it were offset by dx,dy
Sburb.Fighter.prototype.collides = function(sprite,dx,dy){
	if(!this.width || !sprite.width){
		return false;
	}
	var x1 = this.x+(dx?dx:0);
	var y1 = this.y+(dy?dy:0);
	var w1 = this.width/2;
	var h1 = this.height/2;
	
	var x2 = sprite.x;
	var y2 = sprite.y;
	var w2 = sprite.width/2;
	var h2 = sprite.height/2;
	
	var xDiff = x2-x1;
	var yDiff = y2-y1;
	return Math.sqrt(xDiff*xDiff/w2/w1+yDiff*yDiff/h2/h1)<2;
}

//get the points where the Fighter might collide with something
Sburb.Fighter.prototype.getBoundaryQueries = function(dx,dy){
	var x = this.x+(dx?dx:0);
	var y = this.y+(dy?dy:0);
	var queries = {};
	var queryCount = 8;
	var angleDiff = 2*Math.PI/queryCount;
	for(var i=0,theta=0;i<queryCount;i++,theta+=angleDiff){
		queries[i] = {x:x+Math.cos(theta)*this.width/2 ,y:y+Math.sin(theta)*this.height/2};
	}
	return queries;
}

//try to move through the room
Sburb.Fighter.prototype.tryToMove = function(room){
	this.vx*=this.friction;
	this.vy*=this.friction;
	if(Math.abs(this.vx)<this.decel){
		this.vx = 0;
	}
	if(Math.abs(this.vy)<this.decel){
		this.vy = 0;
	}
	var vx = this.vx;
	var vy = this.vy;
	
	var i;
	var moveMap = room.getMoveFunction(this);
	var wasShifted = false;
	if(moveMap) { //our motion could be modified somehow
		l = moveMap(vx, vy);
		if(vx!=l.x || vy!=l.y){
			wasShifted = true;
		}
		vx = l.x;
		vy = l.y;
	}
	var dx = vx;
	var dy = vy;
	this.x+=vx;
	this.y+=vy;
	
	var collides = room.collides(this);
	if(collides){
		var tx = 0;
		var ty = 0;
		var theta = Math.atan2(this.y-collides.y,this.x-collides.x);
		var xOff = Math.cos(theta);
		var yOff = Math.sin(theta);
		while(this.collides(collides,tx,ty)){
			tx-=(dx-xOff)*0.1;
			ty-=(dy-yOff)*0.1;
		}
		if(room.collides(this,tx,ty)){
			this.x-=dx;
			this.y-=dy;
			return false;
		}
		this.x+=tx;
		this.y+=ty;
		dx+=tx;
		dy+=ty;
		
		var theta = Math.atan2(this.y-collides.y,this.x-collides.x);
		this.vx += tx;
		this.vy += ty;
		this.vx*=0.9;
		this.vy*=0.9;
	}

	var queries = room.isInBoundsBatch(this.getBoundaryQueries());
	var queryCount = 8;
	var collided = false;
	var hitX = 0;
	var hitY = 0;
	var angleDiff = 2*Math.PI/queryCount;
	for(var i=0,theta=0;i<queryCount;i++,theta+=angleDiff){
		var query = queries[i];
		if(!query){
			hitX+=Math.cos(theta);
			hitY+=Math.sin(theta);
			collided = true;
		}
	}
	
	if(collided){
		var tx = 0;
		var ty = 0;
		var theta = Math.atan2(hitY,hitX);
		var xOff = Math.cos(theta);
		var yOff = Math.sin(theta);
		var timeout = 0;
		while(!room.isInBounds(this,tx,ty) && timeout<20){
			tx-=xOff*2;
			ty-=yOff*2;
			timeout++;
		}
		if(timeout>=20 || room.collides(this,tx,ty)){
			console.log(tx,ty);
			this.x-=dx;
			this.y-=dy;
			return false;
		}
		this.x+=tx;
		this.y+=ty;
		dx+=tx;
		dy+=ty;
		
		this.vx += tx;
		this.vy += ty;
		this.vx*=0.9;
		this.vy*=0.9;
	}
	return true;
}

//serialize this Fighter to XML
Sburb.Fighter.prototype.serialize = function(output){
	var animationCount = 0;
	for(var anim in this.animations){
	    if(!this.animations.hasOwnProperty(anim)) continue;
		animationCount++;
	}
	output = output.concat("<fighter "+
		Sburb.serializeAttributes(this,"name","x","y","width","height","facing")+
		(animationCount>1?"state='"+this.state+"' ":"")+
		">");
	for(var animation in this.animations){
	    if(!this.animations.hasOwnProperty(animation)) continue;
	    output = this.animations[animation].serialize(output);
	}
	for(var i=0; i < this.actions.length; i++){
		output = this.actions[i].serialize(output);
	}
	output = output.concat("</fighter>");
	return output;
}







//////////////////////////////////////////
//Related Utility Functions
//////////////////////////////////////////


Sburb.parseFighter = function(spriteNode, assetFolder) {
	var attributes = spriteNode.attributes;
	
	var newName = null;
	var newX = 0;
	var newY = 0;
	var newWidth = 0;
	var newHeight = 0;
	var newState = null;

	var temp;
	newName = (temp=attributes.getNamedItem("name"))?temp.value:newName;
	newX = (temp=attributes.getNamedItem("x"))?parseInt(temp.value):newX;
	newY = (temp=attributes.getNamedItem("y"))?parseInt(temp.value):newY;
	newWidth = (temp=attributes.getNamedItem("width"))?parseInt(temp.value):newWidth;
	newHeight = (temp=attributes.getNamedItem("height"))?parseInt(temp.value):newHeight;
	newState = (temp=attributes.getNamedItem("state"))?temp.value:newState;
	var newFacing = (temp=attributes.getNamedItem("facing"))?temp.value:"Right";
 	var newSprite = new Sburb.Fighter(newName,newX,newY,newWidth,newHeight);
	newSprite.facing = newFacing;
	var anims = spriteNode.getElementsByTagName("animation");
	for(var j=0;j<anims.length;j++){
		var newAnim = Sburb.parseAnimation(anims[j],assetFolder);
		newSprite.addAnimation(newAnim);
		if(newState==null){
			newState = newAnim.name;
		}
	}
	newSprite.startAnimation(newState);
	
	return newSprite;
}

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){


///////////////////////////////////////
//Chracter Class (inherits Sprite)
///////////////////////////////////////

//constructor
Sburb.Character = function(name,x,y,width,height,sx,sy,sWidth,sHeight,sheet,bootstrap){
	Sburb.Sprite.call(this,name,x,y,width,height,null,null,Sburb.Sprite.prototype.MG_DEPTHING,true);

	this.speed = 12;
	this.vx = 0;
	this.vy = 0;
	this.facing = "Front";
	this.npc = true;
	this.spriteType = "character";
	this.following = null;
	this.followBuffer = null;
	this.follower = null;
	this.lastLeaderPos = null;
	this.handledInput = -1;
	this.oldX = 0;
	this.oldY = 0;
	
	if(!bootstrap){ //automagically generate standard animations
		sWidth = typeof sWidth == "number" ? sWidth : width;
		sHeight = typeof sHeight == "number" ? sHeight : height;

		this.addAnimation(new Sburb.Animation("idleFront",sheet,sx,sy,sWidth,sHeight,0,1,2));
		this.addAnimation(new Sburb.Animation("idleRight",sheet,sx,sy,sWidth,sHeight,1,1,2));
		this.addAnimation(new Sburb.Animation("idleBack",sheet,sx,sy,sWidth,sHeight,2,1,2));
		this.addAnimation(new Sburb.Animation("idleLeft",sheet,sx,sy,sWidth,sHeight,3,1,2));
		this.addAnimation(new Sburb.Animation("walkFront",sheet,sx,sy,sWidth,sHeight,4,2,4));
		this.addAnimation(new Sburb.Animation("walkRight",sheet,sx,sy,sWidth,sHeight,6,2,4));
		this.addAnimation(new Sburb.Animation("walkBack",sheet,sx,sy,sWidth,sHeight,8,2,4));
		this.addAnimation(new Sburb.Animation("walkLeft",sheet,sx,sy,sWidth,sHeight,10,2,4));
	

		this.startAnimation("walkFront");
	}else{
		this.bootstrap = true;
	}
	
	this.becomeNPC();
	
}

Sburb.Character.prototype = new Sburb.Sprite();
Sburb.Character.prototype.followBufferLength = 6;

//update as if one frame has passed
Sburb.Character.prototype.update = function(curRoom){


	if (Sburb.pressed[Sburb.Keys.shift]) {
		this.speed = 32;
    } else {
		this.speed = 12;
    }


	this.handleFollowing(curRoom);

	//what does this code block do????
	if(this.handleInput>0){
		--this.handleInput;
		if(this.handleInput==0){
			moveNone();
		}
	}

	this.tryToMove(this.vx,this.vy,curRoom);
	Sburb.Sprite.prototype.update.call(this,curRoom);
}

Sburb.Character.prototype.handleFollowing = function(curRoom){
	if(this.following){
		if(this.following.isNPC() && !this.isNPC()){
			this.becomeNPC();
			this.collidable = true;
			this.walk();
		}else if(!this.following.isNPC() && this.isNPC()){
			this.becomePlayer();
			this.collidable = false;
		}
		
		if(this.following.x!=this.lastLeaderPos.x || this.following.y!=this.lastLeaderPos.y){
			this.followBuffer.push({x:this.following.x,y:this.following.y});
			this.lastLeaderPos.x = this.following.x;
			this.lastLeaderPos.y = this.following.y;
			
		}
		var destPos = null;
		while(this.followBuffer.length>this.followBufferLength){
			destPos = this.followBuffer[0];
			var movingSideways = false;
			var moveMap = curRoom.getInverseMoveFunction(this);
			var delta;
			if(moveMap){
				delta = moveMap(destPos.x-this.x,destPos.y-this.y);
			}else{
				delta = {x:destPos.x-this.x,y:destPos.y-this.y};
			}
			if(Math.abs(delta.x)>=this.speed/1.9){
				if(delta.x>0){
					this.moveRight();
				}else{
					this.moveLeft();
				}
				movingSideways = true;
			}
			if(Math.abs(delta.y)>=this.speed/1.9){
				if(delta.y>0){
					this.moveDown(movingSideways);
				}else{
					this.moveUp(movingSideways);
				}
			}else if(!movingSideways){
				this.followBuffer.splice(0,1);
				continue;
			}
			break;
		}
		if(this.followBuffer.length<=this.followBufferLength && !this.following.isNPC()){
			if(destPos){
				this.x = destPos.x;
				this.y = destPos.y;
			}
			this.moveNone();
		}
	}
}

//impulse character to move up
Sburb.Character.prototype.moveUp = function(movingSideways){
	if(!movingSideways){
		this.facing = "Back";
		this.walk();
		this.vx = 0; this.vy = -this.speed;
	}else{
		this.vx*=2/3;
		this.vy = -this.speed*2/3;
	}
}

//impulse character to move down
Sburb.Character.prototype.moveDown = function(movingSideways){
	if(!movingSideways){
		this.facing = "Front";
		this.walk();
		this.vx = 0; this.vy = this.speed;
	}else{
		this.vx*=2/3;
		this.vy = this.speed*2/3;
	}
}

//impulse character to move left
Sburb.Character.prototype.moveLeft = function(){
	this.facing = "Left";
	this.walk();
	this.vx = -this.speed; this.vy = 0;
}

//impulse character to move right
Sburb.Character.prototype.moveRight = function(){
	this.facing = "Right";
	this.walk();
	this.vx = this.speed; this.vy = 0;
}

//impulse character to stand still
Sburb.Character.prototype.moveNone = function(){
	if(this.animations.walkFront.frameInterval == 4){
		this.idle();
		this.vx = 0; this.vy = 0;
	}
}

//make character walk
Sburb.Character.prototype.walk = function(){
	this.startAnimation("walk"+this.facing);
}

//make character idle
Sburb.Character.prototype.idle = function(){
	this.startAnimation("idle"+this.facing);
}

//behave as an NPC
Sburb.Character.prototype.becomeNPC = function(){
	this.animations.walkFront.frameInterval = 12;
	this.animations.walkBack.frameInterval = 12;
	this.animations.walkLeft.frameInterval = 12;
	this.animations.walkRight.frameInterval = 12;
}

//behave as a PC
Sburb.Character.prototype.becomePlayer = function(){
	this.animations.walkFront.frameInterval = 4;
	this.animations.walkBack.frameInterval = 4;
	this.animations.walkLeft.frameInterval = 4;
	this.animations.walkRight.frameInterval = 4;
}

//parse key inputs into actions
Sburb.Character.prototype.handleInputs = function(pressed, order){
    var down = -1, up = -1, left = -1, right = -1, none = -0.5;
    down  = Math.max(order.indexOf(Sburb.Keys.down), order.indexOf(Sburb.Keys.s));
    up    = Math.max(order.indexOf(Sburb.Keys.up),   order.indexOf(Sburb.Keys.w));
    left  = Math.max(order.indexOf(Sburb.Keys.left), order.indexOf(Sburb.Keys.a));
    right = Math.max(order.indexOf(Sburb.Keys.right),order.indexOf(Sburb.Keys.d));
    var most  = Math.max(left, right, none);
    var movingSideways = true;
    if(left == most) {
        this.moveLeft();
    } else if(right == most) {
        this.moveRight();
    }else{
    	movingSideways = false;
    } 
    var most  = Math.max(up, down, none);
    var movingVertical = true;
    if(down == most) {
        this.moveDown(movingSideways);
    } else if(up == most) {
        this.moveUp(movingSideways);
    }else{
    	movingVertical = false;
    }

    if(!movingSideways && !movingVertical){
        this.moveNone();
    }
	this.handledInput = 2;
}

//have character try to move through room
Sburb.Character.prototype.tryToMove = function(vx,vy,room){
	
	var i;
	var moveMap = room.getMoveFunction(this);
	var wasShifted = false;
	if(moveMap) { //our motion could be modified somehow
		l = moveMap(vx, vy);
		if(vx!=l.x || vy!=l.y){
			wasShifted = true;
		}
		vx = l.x;
		vy = l.y;
	}
	if(vx!=0 || vy!=0){
		this.oldX = this.x;
		this.oldY = this.y;
	}
	var minX = Sburb.Stage.scaleX;
	var minY = Sburb.Stage.scaleY;
	while(Math.abs(vx)>=minX || Math.abs(vy)>=minY){
		var dx = 0;
		var dy = 0;
		if(Math.abs(vx)>=minX){
			dx=Math.round((minX)*vx/Math.abs(vx));
			this.x+=dx;
			vx-=dx;
		}
		if(Math.abs(vy)>=minY){
			dy=Math.round((minY)*vy/Math.abs(vy));
			this.y+=dy;
			vy-=dy;
		}
		
		if(!this.following){
			var collision;
			if(collision = room.collides(this)){
				var fixed = false;
				if(dx!=0){
					if(!this.collides(collision,0,minY)){
						dy+=minY;
						this.y+=minY;
						fixed = true;
					}else if(!this.collides(collision,0,-minY)){
						dy-=minY;
						this.y-=minY;
						fixed = true;
					}
				}
				if(!fixed && dy!=0){
					if(!this.collides(collision,minX,0)){
						dx+=minX;
						this.x+=minX;
						fixed = true;
					}else if(!this.collides(collision,-minX,0)){
						dx-=minX;
						this.x-=minX;
						fixed = true;
					}
				}
				if(!fixed || room.collides(this)){
					this.x-=dx;
					this.y-=dy;
					return false;
				}
			}
		
			if(!room.isInBounds(this)){
				var fixed = false;
				if(dx!=0){
					if(room.isInBounds(this,0,minY)){
						dy+=minY;
						this.y+=minY;
						fixed = true;
					}else if(room.isInBounds(this,0,-minY)){
						dy-=minY;
						this.y-=minY;
						fixed = true;
					}
				}
				if(!fixed && dy!=0){
					if(room.isInBounds(this,minX,0)){
						dx+=minX;
						this.x+=minX;
						fixed = true;
					}else if(room.isInBounds(this,-minX,0)){
						dx-=minX;
						this.x-=minX;
						fixed = true;
					}
				}
				if(!fixed || room.collides(this)){
					this.x-=dx;
					this.y-=dy;
					return false;
				}
			}
		}
	}	
	return true;
}

Sburb.Character.prototype.follow = function(sprite){
	while(sprite.follower!=null){
		sprite = sprite.follower;
	}
	this.following = sprite;
	sprite.follower = this;
	this.followBuffer = [];
	this.lastLeaderPos = {};
	this.collidable = false;
}

Sburb.Character.prototype.unfollow = function(){
	if(this.following){
		this.following.follower = this.follower;
		if(this.follower){
			this.follower.following = this.following;
			this.follower.followBuffer = [];
		}
		this.following = null;
		this.follower = null;
		this.lastLeaderPos = null;
		this.collidable = true;
		this.becomeNPC();
	}
}

//get locations character wishes to query for actions
Sburb.Character.prototype.getActionQueries = function(){
	var queries = [];
	queries.push({x:this.x,y:this.y});
	if(this.facing=="Front"){
		queries.push({x:this.x,y:this.y+(this.height/2+15)});
		queries.push({x:this.x-this.width/2,y:this.y+(this.height/2+15)});
		queries.push({x:this.x+this.width/2,y:this.y+(this.height/2+15)});
	}else if(this.facing=="Back"){
		queries.push({x:this.x,y:this.y-(this.height/2+15)});
		queries.push({x:this.x-this.width/2,y:this.y-(this.height/2+15)});
		queries.push({x:this.x+this.width/2,y:this.y-(this.height/2+15)});
	}else if(this.facing=="Right"){
		queries.push({x:this.x+(this.width/2+15),y:this.y});
		queries.push({x:this.x+(this.width/2+15),y:this.y+this.height/2});
		queries.push({x:this.x+(this.width/2+15),y:this.y-this.height/2});
	}else if(this.facing=="Left"){
		queries.push({x:this.x-(this.width/2+15),y:this.y});
		queries.push({x:this.x-(this.width/2+15),y:this.y+this.height/2});
		queries.push({x:this.x-(this.width/2+15),y:this.y-this.height/2});
	}
	return queries;
}

//serialize character to XML
Sburb.Character.prototype.serialize = function(output){
	output = output.concat("\n<character name='"+this.name+
		"' x='"+this.x+
		"' y='"+this.y+
		"' width='"+this.width+
		"' height='"+this.height+
		"' state='"+this.state+
		"' facing='"+this.facing);
		if(!this.bootstrap){
			output = output.concat("' sx='"+this.animations.walkFront.x+
			"' sy='"+this.animations.walkFront.y+
			"' sWidth='"+this.animations.walkFront.colSize+
			"' sHeight='"+this.animations.walkFront.rowSize+
			"' sheet='"+this.animations.walkFront.sheet.name);
		}else{
			output = output.concat("' bootstrap='true");
		}
		if(this.following){
			output = output.concat("' following='"+this.following.name+"");
		}
		if(this.follower){
			output = output.concat("' follower='"+this.follower.name+"");
		}
		output = output.concat("'>");
	for(var animation in this.animations){
	    if(!this.animations.hasOwnProperty(animation)) continue;
	    var anim = this.animations[animation];
	    if(this.bootstrap || (anim.name.indexOf("idle")==-1 && anim.name.indexOf("walk")==-1)){
		    output = anim.serialize(output);
		}
	}
	for(var i=0; i < this.actions.length; i++){
		output = this.actions[i].serialize(output);
	}
	
	output = output.concat("\n</character>");
	return output;
}



Sburb.Character.prototype.isNPC = function(){
	return this.animations.walkFront.frameInterval == 12;
}





////////////////////////////////////////////
//Related Utiltity functions
////////////////////////////////////////////

//parse character from XML DOM Node
Sburb.parseCharacter = function(charNode, assetFolder) {
  	var attributes = charNode.attributes;
  	var newChar = new Sburb.Character(attributes.getNamedItem("name").value,
  				    attributes.getNamedItem("x")?parseInt(attributes.getNamedItem("x").value):0,
  				    attributes.getNamedItem("y")?parseInt(attributes.getNamedItem("y").value):0,
  				    parseInt(attributes.getNamedItem("width").value),
  				    parseInt(attributes.getNamedItem("height").value),
  				    attributes.getNamedItem("sx")?parseInt(attributes.getNamedItem("sx").value):0,
  				    attributes.getNamedItem("sy")?parseInt(attributes.getNamedItem("sy").value):0,
  				    parseInt(attributes.getNamedItem("sWidth").value),
  				    parseInt(attributes.getNamedItem("sHeight").value),
  				    assetFolder[attributes.getNamedItem("sheet").value]);
  	
  	var temp = attributes.getNamedItem("following");
  	if(temp){
  		var following = Sburb.sprites[temp.value];
  		if(following){
  			newChar.follow(following);
  		}
  	} 			 
  	var temp = attributes.getNamedItem("follower");
  	if(temp){
  		var follower = Sburb.sprites[temp.value];
  		if(follower){
  			follower.follow(newChar);
  		}
  	} 	   
  	
  	var anims = charNode.getElementsByTagName("animation");
	for(var j=0;j<anims.length;j++){
		var newAnim = Sburb.parseAnimation(anims[j],assetFolder);
		newChar.addAnimation(newAnim); 
	}
  	newChar.startAnimation(attributes.getNamedItem("state").value);
  	newChar.facing = attributes.getNamedItem("facing").value;
	return newChar;
}




return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




///////////////////////////////////////////
//SpriteButton class
///////////////////////////////////////////

//constructor
Sburb.SpriteButton = function(name,x,y,width,height,sheet,action){
	Sburb.Sprite.call(this,name,x,y,width,height);
	
	this.pressed = false;
	this.mousePressed = false;
	this.clicked = false;
	this.action?action:null;
	
	for(var i=0;i<(sheet.width/this.width)*(sheet.height/this.height);i++){
		this.addAnimation(new Sburb.Animation("state"+i,sheet,0,0,width,height,i,1,1000));
	}
	
	this.startAnimation("state0");
}

Sburb.SpriteButton.prototype = new Sburb.Sprite();

Sburb.SpriteButton.prototype.update = function(){
	Sburb.Sprite.prototype.update.call(this);
	this.updateMouse();
}

//update button in relation to mouse state
Sburb.SpriteButton.prototype.updateMouse = function(){
	var x = Sburb.Mouse.x;
	var y = Sburb.Mouse.y;
	var mouseDown = Sburb.Mouse.down;
	this.clicked = false;
	if(this.hitsPoint(x-this.width/2,y-this.height/2)){
		Sburb.Stage.style.cursor = "pointer";
	}
	if(mouseDown){
		if(!this.mousePressed){
			this.mousePressed = true;
			if(this.hitsPoint(x-this.width/2,y-this.height/2)){
				this.pressed = true;
			}
		}
	}else{
		if(this.pressed){
			if(this.hitsPoint(x-this.width/2,y-this.height/2)){
				this.clicked = true;
				var nextState = "state"+(parseInt(this.animation.name.substring(5,this.animation.name.length))+1);
				if(this.animations[nextState]){
					this.startAnimation(nextState);
				}else{
					this.startAnimation("state0");
				}
			}
		}
		this.pressed = false;
		this.mousePressed = false;
	}
	if(this.clicked && this.action){
		Sburb.performAction(this.action);
	}
}

Sburb.SpriteButton.prototype.setState = function(state){
	this.startAnimation("state"+state);
}

//serialize this SpriteButton to XML
Sburb.SpriteButton.prototype.serialize = function(output){
	output = output.concat("\n<spritebutton name='"+this.name+
		(this.x?"' x='"+this.x:"")+
		(this.y?"' y='"+this.y:"")+
		"' width='"+this.width+
		"' height='"+this.height+
		"' sheet='"+this.animation.sheet.name+
		"' >");
	if(this.action){
		output = this.action.serialize(output);
	}
	output = output.concat("</spritebutton>");
	return output;
}




///////////////////////////////////////////////
//Related Utility Functions
///////////////////////////////////////////////

//Parse a SpriteButton from XML
Sburb.parseSpriteButton = function(button){
	var attributes = button.attributes;
	var sheet = Sburb.assets[attributes.getNamedItem("sheet").value];
	var newButton = new Sburb.SpriteButton(attributes.getNamedItem("name").value,
  									attributes.getNamedItem("x")?parseInt(attributes.getNamedItem("x").value):0,
  									attributes.getNamedItem("y")?parseInt(attributes.getNamedItem("y").value):0,
  									attributes.getNamedItem("width")?parseInt(attributes.getNamedItem("width").value):sheet.width,
  									attributes.getNamedItem("width")?parseInt(attributes.getNamedItem("height").value):sheet.height,
  									sheet);
  	var curAction = button.getElementsByTagName("action");
  	if(curAction.length>0){
  		var newAction = Sburb.parseAction(curAction[0]);
  		newButton.action = newAction;
  	}
  	return newButton;
}




return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




////////////////////////////////////
//Animation Class
////////////////////////////////////


//Constructor
Sburb.Animation = function(name,sheet,x,y,colSize,rowSize,startPos,length,frameInterval,loopNum,followUp,flipX,flipY, sliced, numCols, numRows){
	this.sheet = sheet;
	this.sliced = sliced?true:false;
	this.x = x?x:0;
	this.y = y?y:0;
	this.rowSize = rowSize?rowSize:sheet.height;
	this.colSize = colSize?colSize:sheet.width;
	this.startPos = startPos?startPos:0;
	this.length = length?length:1;
	this.curInterval = 0;
	this.curFrame = 0;
	this.name = name;
	this.loopNum = typeof loopNum == "number"?loopNum:-1;
	this.curLoop = 0;
	this.followUp = followUp;
	this.flipX = flipX?true:false;
	this.flipY = flipY?true:false;
	
	if(sliced){
		this.numRows = numRows;
		this.numCols = numCols;
		this.sheets = {};
		for(var colNum = 0;colNum<this.numCols;colNum++){
			for(var rowNum = 0;rowNum<this.numRows;rowNum++){
				var sheet = Sburb.assets[this.sheet+"_"+colNum+"_"+rowNum];
				if(sheet){
					if(!this.sheets[colNum]){
						this.sheets[colNum] = {};
					}
					this.sheets[colNum][rowNum] = sheet;
				}
			}
		}
		this.draw = this.drawSliced;
	}else{
		this.numRows = sheet.height/this.rowSize;
		this.numCols = sheet.width/this.colSize;
		this.draw = this.drawNormal;
	}
	
	if(typeof frameInterval == "string"){
		if(frameInterval.indexOf(":")==-1){
			this.frameInterval = parseInt(frameInterval);
		}else{
			var intervals = frameInterval.split(",");
			this.frameIntervals = {};
			for(var i=0; i<intervals.length; i++){
				var pair = intervals[i].split(":");
				this.frameIntervals[parseInt(pair[0])] = parseInt(pair[1]);
			}
			if(!this.frameIntervals[0]){
				this.frameIntervals[0] = 1;
			}
			this.frameInterval = this.frameIntervals[this.curFrame];
		}
	}else{
		this.frameInterval = frameInterval?frameInterval:1;
	}
}


//go to the next frame of the animation
Sburb.Animation.prototype.nextFrame = function() {
	this.curFrame++;
	if(this.curFrame>=this.length){
		if(this.curLoop==this.loopNum){
			this.curFrame = this.length-1;
		}else{
			this.curFrame=0;
			if(this.loopNum>=0){
				this.curLoop++;
			}
		}
	}
	if(this.frameIntervals && this.frameIntervals[this.curFrame]){
		this.frameInterval = this.frameIntervals[this.curFrame];
	}
	
}

//update the animation as if a frame of time has elapsed
Sburb.Animation.prototype.update = function(){
	this.curInterval++;
	while(this.curInterval>this.frameInterval){
		this.curInterval-=this.frameInterval;
		this.nextFrame();
	}
}

//draw the animation
Sburb.Animation.prototype.drawNormal = function(x,y){
	var Stage = Sburb.Stage;
	var stage = Sburb.stage;
	var stageX = Stage.offset?Stage.x:0;
	var stageY = Stage.offset?Stage.y:0;
	var stageWidth = Stage.width;
	var stageHeight = Stage.height;
	
	if(this.flipX){
		stageX = -stageX-stageWidth;
		x = -x;
	}
	if(this.flipY){
		stageY = -stageY-stageHeight;
		y = -y;
	}
	
	x= Math.round((this.x+x)/Stage.scaleX)*Stage.scaleX;
	y= Math.round((this.y+y)/Stage.scaleY)*Stage.scaleY;

	var colNum = ((this.startPos+this.curFrame)%this.numCols);
	var rowNum = (Math.floor((this.startPos+this.curFrame-colNum)/this.numCols));
	var frameX = colNum*this.colSize;
	var frameY = rowNum*this.rowSize;
	var drawWidth = this.colSize;
	var drawHeight = this.rowSize;
	
	
	
	var delta = x-stageX;
	if(delta<0){
		frameX-=delta;
		drawWidth+=delta;
		x=stageX;
		if(frameX>=this.sheet.width){
			return;
		}
	}
	
	delta = y-stageY;
	if(delta<0){
		frameY-=delta;
		drawHeight+=delta;
		y=stageY;
		if(frameY>=this.sheet.height){
			return;
		}
	}
	
	
	
	
	delta = drawWidth+x-stageX-stageWidth;
	if(delta>0){
		drawWidth-=delta;
		
	}
	if(drawWidth<=0){
		return;
	}
	
	delta = drawHeight+y-stageY-stageHeight;
	if(delta>0){
		drawHeight-=delta;
	}
	if(drawHeight<=0){
		return;
	}
	
	var scaleX = 1;
	var scaleY = 1;
	
	if(this.flipX){
		scaleX = -1;
	}
	if(this.flipY){
		scaleY = -1;
	}
	if(scaleX!=1 || scaleY!=1){
		stage.scale(scaleX,scaleY);
	}
	stage.drawImage(this.sheet,frameX,frameY,drawWidth,drawHeight,x,y,drawWidth,drawHeight);
	if(scaleX!=1 || scaleY!=1){
		stage.scale(scaleX,scaleY);
	}
	
}

Sburb.Animation.prototype.drawSliced = function(x,y){
	var Stage = Sburb.Stage;
	var stage = Sburb.stage;
	var stageX = Stage.offset?Stage.x:0;
	var stageY = Stage.offset?Stage.y:0;
	var stageWidth = Stage.width;
	var stageHeight = Stage.height;
	
	if(this.flipX){
		stageX = -stageX-stageWidth;
		x = -x;
	}
	if(this.flipY){
		stageY = -stageY-stageHeight;
		y = -y;
	}
	
	
	
	x= Math.round((this.x+x)/Stage.scaleX)*Stage.scaleX;
	y= Math.round((this.y+y)/Stage.scaleY)*Stage.scaleY;
	
	var minCol = Math.floor((stageX-x)/this.colSize);
	var maxCol = Math.floor((stageX+stageWidth-x)/this.colSize);
	var minRow = Math.floor((stageY-y)/this.rowSize);
	var maxRow = Math.floor((stageY+stageHeight-y)/this.colSize);
	
	for(var colNum = minCol; colNum<=maxCol; colNum++){
		for(var rowNum = minRow; rowNum<=maxRow; rowNum++){
			if(this.sheets[colNum] && this.sheets[colNum][rowNum]){
			
				var sheet = this.sheets[colNum][rowNum];
				var frameX = 0;
				var frameY = 0;
				var drawWidth = sheet.width;
				var drawHeight = sheet.height;
				var x = this.x+colNum*this.colSize;
				var y = this.y+rowNum*this.rowSize;
				
				var delta = x-stageX;
				if(delta<0){
					frameX-=delta;
					drawWidth+=delta;
					x=stageX;
					if(frameX>=this.colSize){
						continue;
					}
				}
	
				delta = y-stageY;
				if(delta<0){
					frameY-=delta;
					drawHeight+=delta;
					y=stageY;
					if(frameY>=this.rowSize){
						continue;
					}
				}
	
	
	
	
				delta = drawWidth+x-stageX-stageWidth;
				if(delta>0){
					drawWidth-=delta;
		
				}
				if(drawWidth<=0){
					continue;
				}
	
				delta = drawHeight+y-stageY-stageHeight;
				if(delta>0){
					drawHeight-=delta;
				}
				if(drawHeight<=0){
					continue;
				}
	
				var scaleX = 1;
				var scaleY = 1;
	
				if(this.flipX){
					scaleX = -1;
				}
				if(this.flipY){
					scaleY = -1;
				}
				if(scaleX!=1 || scaleY!=1){
					stage.scale(scaleX,scaleY);
				}

				stage.drawImage(sheet,frameX,frameY,drawWidth,drawHeight,x,y,drawWidth,drawHeight);
				if(scaleX!=1 || scaleY!=1){
					stage.scale(scaleX,scaleY);
				}
			}
		}
	} 
	
	
	
}

//reinitialize the animation to its first frame and loop
Sburb.Animation.prototype.reset = function(){
	this.curFrame = 0;
	this.curInterval = 0;
	this.curLoop = 0;
}

//has the animation stopped playing
Sburb.Animation.prototype.hasPlayed = function(){
	return this.curLoop == this.loopNum && this.curFrame==this.length-1;
}

//set the column size (width)
Sburb.Animation.prototype.setColSize = function(newSize){
	this.colSize = newSize;
	this.numCols = this.sheet.width/this.colSize;
	this.reset();
}

//set the row size (height)
Sburb.Animation.prototype.setRowSize = function(newSize){
	this.rowSize = newSize;
	this.numRows = this.sheet.height/this.rowSize;
	this.reset();
}

//set the sheet
Sburb.Animation.prototype.setSheet = function(newSheet){
	this.sheet = newSheet;
	this.numRows = this.sheet.height/this.rowSize;
	this.numCols = this.sheet.width/this.colSize;
	this.reset();
}

//does the image render in the given pixel
Sburb.Animation.prototype.isVisuallyUnder = function(x,y){
	if(x>=this.x && x<=this.x+this.colSize){
		if(y>=this.y && y<=this.y+this.rowSize){
			return true;
		}
	}
	return false;
}

//make an exact copy of this animation
Sburb.Animation.prototype.clone = function(x,y){
	return new Sburb.Animation(this.name, this.sheet, (x?x:0)+this.x, (y?y:0)+this.y, this.colSize,this.rowSize, this.startPos, this.length, this.frameInterval, this.loopNum, this.followUp, this.flipX, this.flipY, this.sliced, this.numCols, this.numRows);
}

//serialize this Animation to XML
Sburb.Animation.prototype.serialize = function(output){

	var frameInterval = "";
	var firstInterval = true;

	if(this.frameIntervals)
	{
		for(var interval in this.frameIntervals)
		{
		    if(!this.frameIntervals.hasOwnProperty(interval)) continue;
		    frameInterval = frameInterval + (firstInterval?"":",") + interval + ":" + this.frameIntervals[interval];
		    firstInterval = false;
		}
	}
	else if(this.frameInterval !== 1)
	{
		frameInterval = this.frameInterval;
	}

	output = output.concat("\n<animation "+
		("sheet='"+(this.sheet.name?this.sheet.name:this.sheet)+"' ")+
		((this.name!="image")?"name='"+this.name+"' ":"")+
		Sburb.serializeAttributes(this,"x","y")+
		((this.rowSize!=this.sheet.height)?"rowSize='"+this.rowSize+"' ":"")+
		((this.colSize!=this.sheet.width)?"colSize='"+this.colSize+"' ":"")+
		Sburb.serializeAttribute(this,"startPos")+
		((this.length!=1)?"length='"+this.length+"' ":"")+
		((frameInterval!=="")?"frameInterval='"+frameInterval+"' ":"")+
		((this.loopNum!=-1)?"loopNum='"+this.loopNum+"' ":"")+
		Sburb.serializeAttributes(this,"folowUp","flipX","flipY")+
		(this.sliced?("sliced='true' numCols='"+this.numCols+"' numRows='"+this.numRows+"' "):(""))+
		" />");
	return output;
}







///////////////////////////////////////
//Related Utility functions
///////////////////////////////////////

Sburb.parseAnimation = function(animationNode, assetFolder){
	var attributes = animationNode.attributes;

	var name = "image";
	var sheet = null;
	var x = 0;
	var y = 0;
	
	var colSize = null;
	var rowSize = null;
	var numCols = 1;
	var numRows = 1;
	var sliced = false;
	
	var startPos = 0;
	var length = 1;
	var frameInterval = 1;
	var loopNum = -1;
	var followUp = null;
	
	var temp;
	
	sliced = (temp = attributes.getNamedItem("sliced"))?temp.value!="false":sliced;
	
	name = (temp = attributes.getNamedItem("name"))?temp.value:name;
	
	if(!sliced){
		sheet = (temp = attributes.getNamedItem("sheet"))?assetFolder[temp.value]:sheet;
	}else{
		sheet = (temp = attributes.getNamedItem("sheet"))?temp.value:sheet;
	}
	
	x = (temp = attributes.getNamedItem("x"))?parseInt(temp.value):x;
	y = (temp = attributes.getNamedItem("y"))?parseInt(temp.value):y;
	length = (temp = attributes.getNamedItem("length"))?parseInt(temp.value):length;
	
	numCols = (temp = attributes.getNamedItem("numCols"))?parseInt(temp.value):numCols;
	numRows = (temp = attributes.getNamedItem("numRows"))?parseInt(temp.value):numRows;
	
	colSize = (temp = attributes.getNamedItem("colSize"))?parseInt(temp.value):Math.round(sheet.width/length);
	rowSize = (temp = attributes.getNamedItem("rowSize"))?parseInt(temp.value):sheet.height;
	startPos = (temp = attributes.getNamedItem("startPos"))?parseInt(temp.value):startPos;
	
	
	
	
	
	frameInterval = (temp = attributes.getNamedItem("frameInterval"))?temp.value:frameInterval;
	loopNum = (temp = attributes.getNamedItem("loopNum"))?parseInt(temp.value):loopNum;
	followUp = (temp = attributes.getNamedItem("followUp"))?temp.value:followUp;
	var flipX = (temp = attributes.getNamedItem("flipX"))?temp.value!="false":false;
	var flipY = (temp = attributes.getNamedItem("flipY"))?temp.value!="false":false;
	return new Sburb.Animation(name,sheet,x,y,colSize,rowSize,startPos,length,frameInterval,loopNum,followUp,flipX,flipY, sliced,numCols,numRows);
}

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){





///////////////////////////////////
//Room Class
///////////////////////////////////

//constructor
Sburb.Room = function(name,width,height){
	this.name = name;
	this.width = width;
	this.height = height;
	this.sprites = [];
	this.effects = [];
	this.walkables = [];
	this.unwalkables = [];
	this.motionPaths = [];
	this.triggers = [];
	this.walkableMap = null;
	this.mapScale = 4;
}

Sburb.Room.prototype.mapData = null;
Sburb.Room.prototype.blockSize = 500;

//add an Effect to the room
Sburb.Room.prototype.addEffect = function(effect){
	this.effects.push(effect);
}

//add a Trigger to the room
Sburb.Room.prototype.addTrigger = function(trigger){
	this.triggers.push(trigger);
}

//add a Sprite to the room
Sburb.Room.prototype.addSprite = function(sprite){
	if(!this.contains(sprite)){
		this.sprites.push(sprite);
	}
}

//remove a Sprite from the room
Sburb.Room.prototype.removeSprite = function(sprite){
	var i;
	for(i=0;i<this.sprites.length;i++){
		if(this.sprites[i]==sprite){
			this.sprites.splice(i,1);
			return true;
		}
	}
	return false;
}

//add a walkable to the room
Sburb.Room.prototype.addWalkable = function(path){
	this.walkables.push(path);
}

//add an unwalkable to the room
Sburb.Room.prototype.addUnwalkable = function(path){
	this.unwalkables.push(path);
}

//add a motionPath to the room
Sburb.Room.prototype.addMotionPath = function(path,xtox,xtoy,ytox,ytoy,dx,dy) {
	var motionPath = new function (){
		this.path = path;
		this.xtox = xtox; this.xtoy = xtoy;
		this.ytox = ytox; this.ytoy = ytoy;
		this.dx = dx; this.dy = dy;
	};
	this.motionPaths.push(motionPath);
}

//remove a walkable from the room
Sburb.Room.prototype.removeWalkable = function(path){
	this.walkables.splice(this.walkables.indexOf(path),1);
}

//remove an unwalkable to the room
Sburb.Room.prototype.removeUnwalkable = function(path){
	this.unwalkables.splice(this.unwalkables.indexOf(path),1);
}

//remove a motionPath from the room
Sburb.Room.prototype.removeMotionPath = function(path) {
	for(var i=0;i<this.motionPaths.length;i++){
		var mpath = this.motionPaths[i];
		if(mpath.name == path.name){
			this.motionPaths.splice(i,1);
			return;
		}
	}
}

//perform any intialization
Sburb.Room.prototype.enter = function(){
	
	if(this.walkableMap){
		var mapCanvas = Sburb.Map;
		
		var drawWidth = mapCanvas.width = this.walkableMap.width;
		var drawHeight = mapCanvas.height = this.walkableMap.height;
		var ctx = mapCanvas.getContext("2d");
		ctx.drawImage(this.walkableMap,0,0,drawWidth,drawHeight, 0,0,drawWidth,drawHeight);
		
		this.mapData = ctx.getImageData(0,0,drawWidth,drawHeight).data;
		/*this.mapData = new Uint8Array(drawWidth*drawHeight);
		for(var x=0;x<drawWidth;x+=this.blockSize){
			var width = Math.min(this.blockSize,drawWidth-x);
			for(var y=0;y<drawHeight;y+=this.blockSize){
				var height = Math.min(this.blockSize,drawHeight-y);
				var data = ctx.getImageData(x,y,width,height).data;
				for(var j=0;j<height;j++){
					for(var i=0;i<width;i++){
						
						this.mapData[x+i+(y+j)*drawWidth] = data[(i+j*width)*4];
					}
				}
			}
		}*/
	}
}

//perform any exit activities necessary
Sburb.Room.prototype.exit = function(){
	this.effects = [];
	this.mapData = null;
}

//check if the room contains the sprite
Sburb.Room.prototype.contains = function(sprite){
	for(var i=0;i<this.sprites.length;i++){
		if(this.sprites[i]==sprite){
			return true;
		}
	}
	return false;
}

//update the room one frame
Sburb.Room.prototype.update = function(){
	var i;
	for(i=0;i<this.sprites.length;i++){
		this.sprites[i].update(this);
	}
	for(i=this.effects.length-1;i>=0;i--){
		if(this.effects[i].hasPlayed()){
			this.effects.splice(i,1);
		}else{
			this.effects[i].update();
		}
	}
	for(i=this.triggers.length-1;i>=0;i--){
		if(this.triggers[i].tryToTrigger()){
			this.triggers.splice(i,1);
		}
	}
}

//draw the room
Sburb.Room.prototype.draw = function(){
	this.sortDepths();
	
	for(var i=0;i<this.sprites.length;i++){
		this.sprites[i].draw();
	}
	for(i=0;i<this.effects.length;i++){
		this.effects[i].draw(0,0);
	}
}

//sort the sprites by depth
Sburb.Room.prototype.sortDepths = function(){
	//insertion sort?!?
	var i,j;
	for(i=1,j=1;i<this.sprites.length;i++,j=i){
		var temp = this.sprites[j];
		while(j>0 && temp.isBehind(this.sprites[j-1])){
			this.sprites[j] = this.sprites[j-1]
			j--;
		}
		this.sprites[j] = temp;
	}
}

//query the room for an action based on actual collisions
Sburb.Room.prototype.queryActions = function(query,x,y){
	var validActions = [];
	for(var i=0;i<this.sprites.length;i++){
		var sprite = this.sprites[i];
		if(sprite!=query && sprite.hitsPoint(x,y)){
			validActions = validActions.concat(sprite.getActions(query));
		}
	}
	return validActions;
}

//query the room for an action based on visual collisions
Sburb.Room.prototype.queryActionsVisual = function(query,x,y){
	var validActions = [];
	for(var i=0;i<this.sprites.length;i++){
		var sprite = this.sprites[i];
		if(sprite.isVisuallyUnder(x,y)){
			validActions = validActions.concat(sprite.getActions(query));
		}
	}
	return validActions;
}

//check if the sprite is in bounds
Sburb.Room.prototype.isInBounds = function(sprite,dx,dy){
	if (Sburb.pressed[Sburb.Keys.tab]) {
        return true;
    }
	var queries = sprite.getBoundaryQueries(dx,dy);
	var result = this.isInBoundsBatch(queries);
	for(var point in result){
		if(!result[point]){ // I'll let this lack of hasOwnProperty slide
			return false;
		}
	}
	return true;
}

//check if a series of points are in bounds
Sburb.Room.prototype.isInBoundsBatch = function(queries,results){
	if(typeof results != "object"){
		results = {};
		for(var queryName in queries){
		    if(!queries.hasOwnProperty(queryName)) continue;
		    results[queryName] = false;
		}
	}
	if(this.walkableMap){
		for(var query in queries){
		    if(!queries.hasOwnProperty(query)) continue;
			var pt = queries[query];
			var data = this.mapData;
			var width = this.walkableMap.width;
			var height = this.walkableMap.height;
			if(pt.x<0 || pt.x>width*this.mapScale || pt.y<0 || pt.y>height*this.mapScale){
				results[query] = false;
			}else{
				var imgPt = (Math.round(pt.x/this.mapScale)+Math.round(pt.y/this.mapScale)*width)*4;
				results[query] = !!data[imgPt];
			}
		}
	}
	for(var i=0;i<this.walkables.length;i++){
		this.walkables[i].queryBatchPos(queries,results);
	}
	for(var i=0;i<this.unwalkables.length;i++){
		this.unwalkables[i].queryBatchNeg(queries,results);
	}
	
	return results;
}

//get the move function
Sburb.Room.prototype.getMoveFunction = function(sprite) {
	var motionPath = this.getMotionPath(sprite);
    if(motionPath){
		return function(ax, ay) {
			var fx,fy;
			fx = (ax*motionPath.xtox + ay*motionPath.ytox + motionPath.dx);
			fy = (ax*motionPath.xtoy + ay*motionPath.ytoy + motionPath.dy);
			return {x:fx,y:fy};
		};
    }
}

Sburb.Room.prototype.getInverseMoveFunction = function(sprite){
   var motionPath = this.getMotionPath(sprite);
    if(motionPath){
        return function(ax, ay) {
            ax -= motionPath.dx;
            ay -= motionPath.dy;
            var fx,fy;
            var det =  motionPath.xtox*motionPath.ytoy - motionPath.xtoy*motionPath.ytox;
            if(det){
                fx = (ax*motionPath.ytoy - ay*motionPath.ytox)/det;
                fy = (-ax*motionPath.xtoy + ay*motionPath.xtox)/det;
                return {x:fx,y:fy};
            }else{
                //there is no inverse
                return {x:0, y:0};
            }
        };
    } 
}

Sburb.Room.prototype.getMotionPath = function(sprite){
    for(i=0; i<this.motionPaths.length; i++) {
        var motionPath = this.motionPaths[i];
        if( motionPath.path.query(sprite)) {
            return motionPath;
        }
    }
    return null;
}

//check if a sprite collides with anything
Sburb.Room.prototype.collides = function(sprite,dx,dy){
    if (Sburb.pressed[Sburb.Keys.tab]) {
        return null;
    } else {
	for(var i=0;i<this.sprites.length;i++){
		var theSprite = this.sprites[i];
		if(theSprite.collidable && sprite!=theSprite){
			if( sprite.collides(theSprite,dx,dy)){
				return theSprite;
			}
		}
	}
	return null;
    }
}

//serialize the room to XML
Sburb.Room.prototype.serialize = function(output){
	output = output.concat("\n<room name='"+this.name+
	"' width='"+this.width+
	"' height='"+this.height+
	(this.walkableMap?("' walkableMap='"+this.walkableMap.name):"")+
	(this.mapScale!=4?("' mapScale='"+this.mapScale):"")+
	"' >");
	output = output.concat("\n<paths>");
	for(var i=0;i<this.walkables.length;i++){
		var walkable = this.walkables[i];
		output = output.concat("\n<walkable path='"+walkable.name+"'/>");
	}
	for(var i=0;i<this.unwalkables.length;i++){
		var unwalkable = this.unwalkables[i];
		output = output.concat("\n<unwalkable path='"+unwalkable.name+"'/>");
	}
	for(var i=0;i<this.motionPaths.length;i++){
		var motionPath = this.motionPaths[i];
		 output = output.concat("\n<motionpath path='"+motionPath.path.name+"' xtox='"+motionPath.xtox+"' xtoy='"+motionPath.xtoy+
		 "' ytox='"+motionPath.ytox+"' ytoy='"+motionPath.ytoy+"' dx='"+motionPath.dx+"' dy='"+motionPath.dy+"'/>");
	}
	output = output.concat("\n</paths>");
	output = output.concat("\n<triggers>");

	for(var i=0;i<this.triggers.length;i++){
		output = this.triggers[i].serialize(output);
	}
	output = output.concat("\n</triggers>");
	for(var i=0; i < this.sprites.length; i++){
	    output = this.sprites[i].serialize(output);
	}
	
	output = output.concat("\n</room>");
	return output;
}






///////////////////////////////////////////////
//Related Utility Functions
///////////////////////////////////////////////

//parse a room from XML
Sburb.parseRoom = function(roomNode, assetFolder, spriteFolder) {
  	var attributes = roomNode.attributes;
  	var newRoom = new Sburb.Room(attributes.getNamedItem("name").value,
  			       attributes.getNamedItem("width")?parseInt(attributes.getNamedItem("width").value):0,
  			       attributes.getNamedItem("height")?parseInt(attributes.getNamedItem("height").value):0);
  	
  	var mapScale = attributes.getNamedItem("mapScale");
  	if(mapScale){
  		newRoom.mapScale = parseInt(mapScale.value);
  	}
  	
  	var walkableMap = attributes.getNamedItem("walkableMap");
  	if(walkableMap){
  		newRoom.walkableMap = assetFolder[walkableMap.value];
  		if(!newRoom.width){
  			newRoom.width = newRoom.walkableMap.width*newRoom.mapScale;
  		}
  		
  		if(!newRoom.height){
  			newRoom.height = newRoom.walkableMap.height*newRoom.mapScale;
  		}
  	}
  	
  	Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("sprite"), spriteFolder);
  	Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("character"), spriteFolder);
  	Sburb.serialLoadRoomSprites(newRoom,roomNode.getElementsByTagName("fighter"), spriteFolder);
  	var paths = roomNode.getElementsByTagName("paths");
  	if(paths.length>0){
		Sburb.serialLoadRoomPaths(newRoom, paths, assetFolder);
	}
	var triggers = roomNode.getElementsByTagName("triggers")
	if(triggers.length>0){
		Sburb.serialLoadRoomTriggers(newRoom,triggers,spriteFolder);
	}
	return newRoom;
}




return Sburb;
})(Sburb || {});

(function() {
  try {
    var a = new Uint8Array(1);
    return; //no need
  } catch(e) { }

  function subarray(start, end) {
    return this.slice(start, end);
  }

  function set_(array, offset) {
    if (arguments.length < 2) offset = 0;
    for (var i = 0, n = array.length; i < n; ++i, ++offset)
      this[offset] = array[i] & 0xFF;
  }

  // we need typed arrays
  function TypedArray(arg1) {
    var result;
    if (typeof arg1 === "number") {
       result = new Array(arg1);
       for (var i = 0; i < arg1; ++i)
         result[i] = 0;
    } else
       result = arg1.slice(0);
    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = set_;
    if (typeof arg1 === "object" && arg1.buffer)
      result.buffer = arg1.buffer;

    return result;
  }

  window.Uint8Array = TypedArray;
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
})();
var Sburb = (function(Sburb){

/* Talking text markup
@ denotes a new dialogue box, the string following it indicates character animation, 
the first two characters indicating character specific formatting.
Alternatively, you can use an underscore to override the two character identifier
limit.

EX:

@CGIdle wordwordswords
@TTAngry Blahblahblah
@CGBored snoooooze
@Karkat_Stupid blarhagahl

Inserting underscores underlines the text between them, e.g. _blah blah blah_
Inserting /0xff00ff colours all following text with the specificed colour.
Insterting /0x/ ends the previously specified behaviour.
*/







////////////////////////////////////////////////
//FontEngine class
////////////////////////////////////////////////

//constructor
Sburb.FontEngine = function(text){

	//This is intended for monospace fonts
	//this.font-family 
	this.font = "bold 14px SburbFont";
	this.color = "#000000";
	this.text = typeof text == "string"?text:"";
	this.x=0;
	this.y=0;
	this.width=999999;
	this.height=999999;
	this.start=0;
	this.end=999999;
	this.lines = [];
	this.lineHeight = 17;
	this.charWidth = 8;
	this.align = "left";
	
	this.formatted = true;
	
	this.formatQueue = [];
}

Sburb.FontEngine.prototype.prefixColours = {	
	aa : "#a10000",aradia : "#a10000",
	ac : "#416600",nepeta : "#416600",
	ag : "#005682",vriska : "#005682",
	at : "#a15000",tavros : "#a15000",
	ca : "#6a006a",eridan : "#6a006a",
	cc : "#77003c",feferi : "#77003c",
	cg : "#626262",karkat : "#626262",
	ct : "#000056",equius : "#000056",
	ga : "#008141",kanaya : "#008141", kanaya2 : "#008141",
	gc : "#008282",terezi : "#008282",
	ta : "#a1a100",sollux : "#a1a100",
	tc : "#2b0057",gamzee : "#6c00da",
	dave:"#e00707",meenah : "#77003c",
	rose:"#b536da",aranea : "#005682",
	kankri:"#ff0000",porrim: "#008141",
	latula:"#008282",cronus: "#6a006a",
	mituna:"#a1a100", kurloz: "#6c00da",
	meulin:"#416600", rufioh: "#a15000",
	horuss:"#000056", damara: "#a10000"
};

//set the style
Sburb.FontEngine.prototype.setStyle = function(font,color,lineHeight,charWidth){
	this.font = typeof font == "string" ? font:this.font;
	this.color = typeof color == "string" ? color:this.color;
	this.lineHeight = typeof lineHeight == "number" ? lineHeight:this.lineHeight;
	this.charWidth = typeof charWidth == "number" ? charWidth:this.charWidth;
	this.parseText();
}

//set formatted
Sburb.FontEngine.prototype.setFormatted = function(formatted){
	this.formatted = formatted;
}

//set the text
Sburb.FontEngine.prototype.setText = function(text){
	this.text = text;
	this.parseEverything();
}

Sburb.FontEngine.prototype.setAlign = function(align){
	this.align = align;
}

//show a substring of the text
Sburb.FontEngine.prototype.showSubText = function(start,end){
	this.start = typeof start == "number" ? start:this.start;
	this.end = typeof end == "number" ? end:this.end;
}

//set the dimensions
Sburb.FontEngine.prototype.setDimensions = function(x,y,width,height){
	this.x = typeof x == "number" ? x:this.x;
	this.y = typeof y == "number" ? y:this.y;
	this.width = typeof width == "number" ? width:this.width;
	this.height = typeof height == "number" ? height:this.height;
	this.parseText();
}

//parse and format the current text with the current settings
Sburb.FontEngine.prototype.parseEverything = function(){
	this.parseFormatting();
	this.parseText();
}

//parse the text
Sburb.FontEngine.prototype.parseText = function(){ //break it up into lines
	Sburb.stage.font = this.font;
	this.lines = [];
	var i = 0;
	var lastSpace = 0;
	var lineStart = 0;
	for(i=0;i<this.text.length;i++){
		if(this.text.charAt(i)==" "){
			lastSpace = i;
		}else if(this.text.charAt(i)=="\\" && this.text.charAt(i+1)=="n"){
			this.lines.push(this.text.substring(lineStart,i));
			lineStart = i+2;
			lastSpace = lineStart;
			continue;
		}
		if(Sburb.stage.measureText(this.text.substring(lineStart,i+1)).width>this.width){
			if(lineStart==lastSpace){
				this.lines.push(this.text.substring(lineStart,i));
				lineStart = i;
				lastSpace = i;
			}else{
				this.lines.push(this.text.substring(lineStart,lastSpace));
				lineStart = lastSpace+1;
				lastSpace = lineStart;
			}
		}
	}
	this.lines.push(this.text.substring(lineStart,i));
}

//parse the formatting of the text
Sburb.FontEngine.prototype.parseFormatting = function(){
	this.formatQueue = [];
	if(this.formatted){
		
		this.escaped = {};
		
		this.parsePrefixes();
	
		this.parseEscapes();
	
		
	
		this.parseUnderlines();
	
		this.parseColors();
	}
}

Sburb.FontEngine.prototype.parseEscapes = function(){
	var index;
	var escapeLocation = 0;
	do{
		index = this.text.indexOf("/",escapeLocation);
		
		if(index<this.text.length-1 && index>=0){
			var character = this.text.charAt(index+1);
			if(character=="/"){
				escapeLocation=index+1;
			}else{
				var characterListing = this.escaped[character];
				if(!characterListing){
					characterListing = this.escaped[character] = {};
				}
				var count = 0;
				for(var i=0;i<index;i++){
					if(this.text.charAt(i)==character){
						count++;			
					}
				}
				characterListing[count+1] = true;
			}
		}
		this.text = this.text.substring(0,index)+this.text.substring(index+1,this.text.length);
	}while(index>=0);
}

Sburb.FontEngine.prototype.parsePrefixes = function(){
	var prefix = this.text.split(" ",1)[0];
	var actor;
	if(prefix!="!"){
		if(prefix.indexOf("_")>=0){
			actor = prefix.substring(0,this.text.indexOf("_"));	
		}else{
			actor = prefix.substring(0,2);
		}
		this.parsePrefix(actor);
	}
	this.text = this.text.substring(prefix.length,this.text.length).trim();
}

Sburb.FontEngine.prototype.parseUnderlines = function(){
	var escapePoint = 0;
	var index = 0;
	var count = 0;
	while(true){
		while(true){
			count++;
			index = this.text.indexOf("_",escapePoint);
			if(this.escaped["_"] && this.escaped["_"][count]){
				escapePoint = index+1;
			}else{
				break;
			}
		}
		if(index==-1){
			break;
		}
		var closing = false;
		for(var i=this.formatQueue.length-1;i>=0;i--){
			if(this.formatQueue[i].type=="underline" && this.formatQueue[i].maxIndex==999999){
				this.formatQueue[i].maxIndex=index;
				closing = true;
				break;
			}
		}
		if(!closing){
			this.addToFormatQueue(new Sburb.FormatRange(index,999999,"underline"));
		}
		this.text = this.text.substring(0,index)+this.text.substring(index+1,this.text.length);
		this.realignFormatQueue(index,1);
	}
}

Sburb.FontEngine.prototype.parseColors = function(){
	var escapePoint = 0;
	var index = 0;
	var count = 0;
	while(true){
		while(true){
			count++;
			index = this.text.indexOf("#",escapePoint);
			if(this.escaped["#"] && this.escaped["#"][count]){
				escapePoint = index+1;
			}else{
				break;
			}
		}
		if(index==-1){
			break;
		}
		if(this.text.indexOf("##",escapePoint)==index){
			for(var i=this.formatQueue.length-1;i>=0;i--){
				if(this.formatQueue[i].type=="colour" && this.formatQueue[i].maxIndex==999999){
					this.formatQueue[i].maxIndex=index;
					break;
				}
			}
			count++;
			this.text = this.text.substring(0,index)+this.text.substring(index+2,this.text.length);
			this.realignFormatQueue(index,2);
		}else{
			this.addToFormatQueue(new Sburb.FormatRange(index,999999,"colour","#"+this.text.substring(index+1,index+7)));
			this.text = this.text.substring(0,index)+this.text.substring(index+7,this.text.length);
			this.realignFormatQueue(index,7);
		}
	}
}

//add a format object to the formatQueue
Sburb.FontEngine.prototype.addToFormatQueue = function(format){
	var newPlace = this.formatQueue.length;
	for(var i=0;i<this.formatQueue.length;i++){
		if(this.formatQueue[i].minIndex>format.minIndex){
			newPlace = i;
			break;
		}
	}
	this.formatQueue.splice(newPlace,0,format);
}

//clean up any descrepencies in the formatQueue
Sburb.FontEngine.prototype.realignFormatQueue = function(startPos,shiftSize){
	for(var i=0;i<this.formatQueue.length;i++){
		var curFormat = this.formatQueue[i];
		if(curFormat.maxIndex>startPos && curFormat.maxIndex!=999999){
			curFormat.maxIndex-=shiftSize;
		}
		if(curFormat.minIndex>startPos){
			curFormat.minIndex-=shiftSize;
		}
	}
}

//parse a dialog prefix into formats
Sburb.FontEngine.prototype.parsePrefix = function(prefix){
	this.formatQueue.push(new Sburb.FormatRange(0,this.text.length,"colour",this.prefixColouration(prefix)));
}

//get the colour of a prefix
Sburb.FontEngine.prototype.prefixColouration = function(prefix){
	if(this.prefixColours[prefix.toLowerCase()]){
		return this.prefixColours[prefix.toLowerCase()];
	}else{
		return "#000000";
	}
}

//get the next "box" of lines
Sburb.FontEngine.prototype.nextBatch = function(){
	this.realignFormatQueue(-1,this.batchLength());
	this.lines.splice(0,Math.min(this.lines.length,Math.floor(this.height/this.lineHeight)));
	return this.lines.length;
}

Sburb.FontEngine.prototype.onLastBatch = function(){
	return Math.floor(this.height/this.lineHeight)>=this.lines.length;
}

//draw the FontEngine
Sburb.FontEngine.prototype.draw = function(){

	var i;
	var lenCount;
	var linePos=0;
	var strStart,strEnd;
	var currentFormat = 0;
	var currentFormats = [];
	var nextStop;
	var curLine;
	
	
	i=0;
	lenCount=0;
	var offsetX = 0;
	while(i<Math.floor(this.height/this.lineHeight) && i<this.lines.length){
		Sburb.stage.save();
		//if(Sburb.stage.textBaseline != "top"){
			Sburb.stage.textBaseline = "top";
		//}
		//if(Sburb.stage.textAlign!=this.align){
			Sburb.stage.textAlign = this.align;
		//}
		curLine = this.lines[i];
		var curFont = this.font;
		var curColor = this.color;
		var underlining = false;
		
		nextStop = curLine.length;
		
		if(currentFormat<this.formatQueue.length && this.formatQueue[currentFormat].minIndex<=lenCount+linePos){
			currentFormats.push(this.formatQueue[currentFormat]);
			currentFormat++;
		}
		for(var k=currentFormats.length-1;k>=0;k--){
			if(currentFormats[k].maxIndex<=lenCount+linePos){
				currentFormats.splice(k,1);
			}
		}
		for(var k=0;k<currentFormats.length;k++){
			if(currentFormats[k].type=="colour"){
				curColor = currentFormats[k].extra;
				
			}else if(currentFormats[k].type=="underline"){
				underlining = true;
			}else if(currentFormats[k].type=="italic"){
				curFont = "italic "+this.font;
			}
		}
		if(currentFormat<this.formatQueue.length && this.formatQueue[currentFormat].minIndex<lenCount+curLine.length){
			if(this.formatQueue[currentFormat].minIndex<this.end){
				nextStop = Math.min(nextStop,this.formatQueue[currentFormat].minIndex-lenCount);
			}
		}
		for(var k=0;k<currentFormats.length;k++){
			if(currentFormats[k].maxIndex<this.end){
				nextStop = Math.min(nextStop,currentFormats[k].maxIndex-lenCount);
			}
		}
		if(nextStop!=curLine.length){
			strStart = linePos;
			strEnd = nextStop;
			linePos+=strEnd-strStart;
		}else{
			if(lenCount+curLine.length<=this.end){ //if the line wouldn't take me past the displayed length
				strEnd = curLine.length; //do the whole line
			}else{ //otherwise, if the line would take me past the displayed length
				strEnd = this.end-lenCount; //only show up to the limit
			}
			if(lenCount+linePos>=this.start){ //if the start of the line is within the bounds of the displayed length
				strStart = linePos; //display from the start of the line
			}else if(lenCount+curLine.length>=this.start){ //otherwise, if any part of the line should be displayed
				strStart = this.start-(lenCount)+linePos; //display from where we should start
				offsetX+=Sburb.stage.measureText(curLine.substring(linePos,strStart)).width;
			}else{ //otherwise, don't show this line at all
				strStart = linePos;
				strEnd = linePos;
			}
			linePos = -1;
		}
		var numChars = strEnd-strStart;
		
		if(numChars>0){
			
			var startX = this.x+offsetX;
			var startY = this.y+i*this.lineHeight;
			
			//if(Sburb.stage.font != curFont){
				Sburb.stage.font = curFont;
			//}
			//if(Sburb.stage.fillStyle!=curColor){
				Sburb.stage.strokeStyle = Sburb.stage.fillStyle = curColor;
			//}
			//console.log(Sburb.stage.fillStyle, Sburb.stage.strokeStyle, Sburb.stage.font, Sburb.stage.textBaseline, Sburb.stage.textAlign,curLine.substring(strStart,strEnd));
			//console.log(strStart,strEnd,startX,startY,numChars*this.charWidth,);
			Sburb.stage.fillText(curLine.substring(strStart,strEnd),startX,startY);
			offsetX+=Sburb.stage.measureText(curLine.substring(strStart,strEnd)).width;
			if(underlining && strStart<strEnd){
				if(Sburb.stage.lineWidth!=0.6){
					Sburb.stage.lineWidth = 0.6;
				}
				if(Sburb.stage.lineCap!="square"){
					Sburb.stage.lineCap = "square";
				}
				Sburb.stage.beginPath();
				Sburb.stage.moveTo(startX,startY+this.lineHeight-3);
				Sburb.stage.lineTo(startX+numChars*this.charWidth,startY+this.lineHeight-3);
				Sburb.stage.closePath();
				Sburb.stage.stroke();
			}
		}
		if(linePos==-1){
			lenCount+=this.lines[i].length + 1;
			linePos = 0;
			offsetX = 0;
			i++;
		}
		Sburb.stage.restore();
	}
	
}

//is the contents of the current "box" fully displayed
Sburb.FontEngine.prototype.isShowingAll = function(){
	return this.end>=this.batchLength();
}

//get the length of the current "box"
Sburb.FontEngine.prototype.batchLength = function(){
	var len = 0;
	var i;
	for(i=0;i<Math.floor(this.height/this.lineHeight) && i<this.lines.length;i++){
		len+=this.lines[i].length;
	}
	return len;
}

//show the contents of the current "box"
Sburb.FontEngine.prototype.showAll = function(){
	this.end = this.batchLength()+1;
}






////////////////////////////////////
//FormatRange class
////////////////////////////////////

Sburb.FormatRange = function(minIndex,maxIndex,type,extra){
	this.minIndex = minIndex;
	this.maxIndex = maxIndex;
	this.type = type;
	this.extra = typeof extra == "string"?extra:"";
}





return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




///////////////////////////////////////////////
//Action Class
///////////////////////////////////////////////

//Constructor
Sburb.Action = function(command,info,name,sprite,followUp,noWait,noDelay,times,soft,silent){
	this.sprite = sprite?sprite:null;
	this.name = name?name:null;
	this.command = command
	this._info = info;
	this.followUp = followUp?followUp:null;
	this.noWait = noWait?noWait:false;
	this.noDelay = noDelay?noDelay:false;
	this.soft = soft?soft:false;
	if(silent=="true") {
		this.silent = true;
	} else {
		this.silent = silent?silent:false;
	}
	this.times = times?times:1;
}

Sburb.Action.prototype.info = function(){
	if (this._info) {
		if (typeof(this._info) == "string") {
			return this._info;
		} else if (this._info.text) {
			return this._info.text;
		}
	}
	return "";
}

//Make an exact copy
Sburb.Action.prototype.clone = function(){
	return new Sburb.Action(this.command, this._info, this.name, this.sprite, this.followUp, this.noWait, this.noDelay, this.times, this.soft, this.silent);
}

//Serialize to XML (see serialization.js)
Sburb.Action.prototype.serialize = function(output){
	output = output.concat("\n<action "+
		"command='"+this.command+
		(this.sprite?"' sprite='"+this.sprite:"")+
		(this.name?"' name='"+escape(this.name):"")+
		(this.noWait?"' noWait='"+this.noWait:"")+
		(this.noDelay?"' noDelay='"+this.noDelay:"")+
		(this.soft?"' soft='"+this.soft:"")+
		(this.silent?"' silent='"+this.silent:"")+
		(this.times!=1?"' times='"+this.times:"")+
		"'>");
	if(typeof(this._info) == "string") {
		output = output.concat('<args>' + escape(this._info.trim()) + '</args>' );
	} else if(this._info.name) {
		output = output.concat('<args body="'+this._info.name+'" />' );
        }
	if(this.followUp){
		output = this.followUp.serialize(output);
	}
	output = output.concat("</action>");
	return output;
}





//////////////////////////////////////////////////
//Related utility functions
//////////////////////////////////////////////////

//Parse a serialized Action from an XML DOM node
Sburb.parseAction = function(node) {
	var targSprite = null;
	var firstAction = null;
	var oldAction = null;
	do{
	  	var attributes = node.attributes;
		
		if(attributes.getNamedItem("sprite") && attributes.getNamedItem("sprite").value!="null"){
			targSprite = attributes.getNamedItem("sprite").value;
		}
		var times = attributes.getNamedItem("times") || attributes.getNamedItem("loops") || attributes.getNamedItem("for");

		var info = node.firstChild?getNodeText(node):""
		if(typeof(info) == "string") {
			info = unescape(info).trim();
		}

		var newAction = new Sburb.Action(
					 attributes.getNamedItem("command").value,
					 info,
					 attributes.getNamedItem("name")?unescape(attributes.getNamedItem("name").value):null,
					 targSprite,
					 null,
					 attributes.getNamedItem("noWait")?attributes.getNamedItem("noWait").value=="true":false,
					 attributes.getNamedItem("noDelay")?attributes.getNamedItem("noDelay").value=="true":false,
					 times?parseInt(times.value):1,
					 attributes.getNamedItem("soft")?attributes.getNamedItem("soft").value=="true":false,
					 attributes.getNamedItem("silent")?attributes.getNamedItem("silent").value:false);

		if(oldAction){
			oldAction.followUp = newAction;
		}
		if(!firstAction){
			firstAction = newAction;
		}
		oldAction = newAction;
		var oldNode = node;
		node = null;
		for(var i=0;i<oldNode.childNodes.length;i++){
			var child = oldNode.childNodes[i];
			if(child.nodeName=="action"){
				node = child;
				break;
			}
		}
		if(!node){
			break;
		}
	}while(node);
	
	return firstAction;
}

function getNodeText(xmlNode){
  if(!xmlNode) return '';
  for(var i=0;i<xmlNode.childNodes.length;i++){
  	var child = xmlNode.childNodes[i];
  	if(child.tagName=="args"){
			if (child.attributes) {
				var asset = child.attributes.getNamedItem("body");
				if (asset && asset.value && Sburb.assetManager.isLoaded(asset.value)) {
					return Sburb.assets[asset.value];
				}
			}
  		for(var k=0;k<child.childNodes.length;k++){
				if(child.childNodes[k].firstChild){
					serializer = new XMLSerializer();
					var output = "";
					for(var j=0; j<child.childNodes.length; j++){
						output += serializer.serializeToString(child.childNodes[j]);
					}
					return output;
				}
			}
			if(typeof(child.textContent) != "undefined"){
				return child.textContent;
			}
			return child.firstChild.nodeValue;
		}
	}
	if(typeof(xmlNode.textContent) != "undefined"){
		return xmlNode.textContent;
	}
	return xmlNode.firstChild.nodeValue;
}



return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){

function parseParams(info){
	var params = info.split(",");
	params.map(function(param) { return param.trim(); });
	return params;
}

var events = {};

// Please list all 9f y9ur triggers here so I can handle them c9rrectly.
//...I can't tell if you're trying to use some troll thing or broke your "o" key

// Trigger functions are called with "new"; functions should set
// this.reset (for when the trigger is initialized/reset) and
// this.checkCompletion (which should return true or false based
// on whether the trigger has been completed).

//Check if the given sprite's property satisfies some condition
//syntax: spriteName, query (e.g. x=3)
events.spriteProperty = function(info) {
	var params = parseParams(info);
	var token;
	var query = params[2];
	if((query.indexOf(">")>-1 && (token=">")) ||
	   (query.indexOf("GREATER") > -1 && (token="GREATER"))){
		this.trigger = function(entity,property,target){
			return entity[property]>target;
		};	
	}else if((query.indexOf("<")>-1 && (token="<")) ||
	         (query.indexOf("LESS") > -1 && (token="LESS"))){
		this.trigger = function(entity,property,target){
			return entity[property]<target;
		};
	}else if(query.indexOf("!=")>-1){
		token = "!=";
		this.trigger = function(entity,property,target){
			return entity[property]!=target;
		};				
	}else if(query.indexOf("=")>-1){
		token = "=";
		this.trigger = function(entity,property,target){
			return entity[property]==target;
		};		
	}
	var queryParts = query.split(token);
	var property = queryParts[0].trim();
	var target = queryParts[1].trim();

	this.reset = function() {
		if(params[1]=="char"){
			this.entity = params[1];
		} else{
			this.entity = Sburb.sprites[params[1]];
		}
	}	
	this.checkCompletion = function(){
		var entity = this.entity;
		if(this.entity=="char"){
			entity = Sburb.char;
		}
		return this.trigger(entity,property,target);
	}
};

//Check if the given sprite is inside a box
//syntax: spriteName, x, y, width, height
events.inBox = function(info) {
	var params = parseParams(info);
	var x = parseInt(params[2]);
	var y = parseInt(params[3]);
	var width = parseInt(params[4]);
	var height = parseInt(params[5]);
	this.reset = function() {
		if(params[1]=="char"){
			this.entity = params[1];
		}else{
			this.entity = Sburb.sprites[params[1]];
		}
	}
	this.checkCompletion = function(){
		var entity = this.entity;
		if(this.entity=="char"){
			entity = Sburb.char;
		}
		return entity.x >= x && entity.y >= y && entity.x <= x+width && entity.y <= y+height;
	}
};

events.inBox2 = function(info){
	var params = parseParams(info);
	var x1 = parseInt(params[2]);
	var y1 = parseInt(params[3]);
	var x2 = parseInt(params[4]);
	var y2 = parseInt(params[5]);
	var x = Math.min(x1,x2);
	var y = Math.min(y1,y2);
	var width = Math.abs(x1-x2);
	var height = Math.abs(y1-y2);
	return new events.inBox("inBox,"+params[1]+","+x+","+y+","+width+","+height);
}

//Check if a certain interval of time has elapsed
//syntax: time
events.time = function(info) {
	var params = parseParams(info);
	this.reset = function() {
		this.time = parseInt(params[1]);
	}
	this.checkCompletion = function(){
		this.time--;
		return this.time<=0;
	};
	this.serialize = function(){
		return "time,"+this.time;
	}
};

//Check if the sprite's animation has played
//sytax: spriteName
events.played = function(info) {
	var params = parseParams(info);
	this.reset = function() {
		this.entity = Sburb.sprites[params[1]];
	}
	this.checkCompletion = function(){
		var entity = this.entity;
		if(this.entity=="char"){
			entity = Sburb.char;
		}
		return entity.animation.hasPlayed();
	};
};

//check if the movie has finished playing (iternal utility event)
//syntax: movieName
events.movie = function(info) {
	var params = parseParams(info);
	var threshold = parseInt(params[2]);
	this.reset = function() {
		this.movie = window.document.getElementById("movie"+params[1]);
	}
	this.checkCompletion = function(){
		if(this.movie && (!this.movie.TotalFrames || 
				  (this.movie.TotalFrames()>0 && this.movie.TotalFrames()-1-this.movie.CurrentFrame()<=threshold))){
			Sburb.commands.removeMovie(params[1]);
			return true;
		}
		return false;
	}
};

//check if the game state meets a certain condition
//syntax: condition (e.g. doorOpened=true)
events.gameState = function(info) {
	var params = parseParams(info);
	var token;
	var query = params[1];
	if((query.indexOf(">")>-1 && (token=">")) ||
	   (query.indexOf("GREATER") > -1 && (token="GREATER"))){
		this.trigger = function(property,target){
			return Sburb.gameState[property]>target;
		};
	}else if((query.indexOf("<")>-1 && (token="<")) ||
	         (query.indexOf("LESS") > -1 && (token="LESS"))){
		this.trigger = function(property,target){
			return Sburb.gameState[property]<target;
		};
	}else if(query.indexOf("!=")>-1){
		token = "!=";
		this.trigger = function(property,target){
			return Sburb.gameState[property]!=target;
		};
	}else if(query.indexOf("=")>-1){
 		token = "=";
		this.trigger = function(property,target){
			return Sburb.gameState[property]==target;
		};		
	}
	var queryParts = query.split(token);
	var property = queryParts[0].trim();
	var target = queryParts[1].trim();
	this.reset = function() {
		// pass
	}	
	this.checkCompletion = function(){
		return this.trigger(property,target);
	}
};	

//check if the player is nudging the game forward (space or mouse)
//syntax: none
events.nudge = function(info){
	this.reset = function(){ } //do nothing
	this.checkCompletion = function(){
		return Sburb.Keys.space || Sburb.Mouse.down;
	}
}

//check that there are no pending or active actions on the queue
//syntax: none
events.noActions = function(info){
	var params = parseParams(info);
	this.reset = function(){ } //do nothing
	this.checkCompletion = function(){
		var queue = params.length>0 ? Sburb.getActionQueueById(params[1]) : Sburb;
		return !queue || !queue.curAction;
	}
}

//check if two sprites are near each other
//syntax spriteName1, spriteName2, distance (px)
events.withinRange = function(info){
	var params = parseParams(info);
	var spriteName1 = params[1];
	var spriteName2 = params[2];
	var dist = parseFloat(params[3]);

	this.reset = function(){ } //do nothing
	this.checkCompletion = function(){
			var sprite1 = Sburb.parseCharacterString(spriteName1);
			var sprite2 = Sburb.parseCharacterString(spriteName2);
			var xDist = sprite1.x-sprite2.x;
			var yDist = sprite1.y-sprite2.y;
			return Math.sqrt(xDist*xDist + yDist*yDist) <= dist;
	}
}

Sburb.events = events;
return Sburb;

})(Sburb || {});var Sburb = (function(Sburb){






/////////////////////////////////////////
//Trigger Class
/////////////////////////////////////////

//constructor
Sburb.Trigger = function(info,action,followUp,restart,detonate,operator){
	//console.log("Trigger constructor with: "+info, info);
	if(typeof info == "string"){
		info = [info];
	}
	
	this.info = info;
	this.followUp = followUp?followUp:null;
	this.action = action?action:null;
	this.restart = restart?restart:false;
	this.detonate = detonate?detonate:false;
	this.operator = operator?operator.toUpperCase():"AND";
	this.waitFor = null;
	
	this.events = [];
	for(var i=0;i<info.length;i++){
		var inf = this.info[i].trim();
		var params = inf.split(",");
		var type = params[0];
		//console.log("parsed trigger args: "+type+"("+inf+")");
		this.events[i] = new Sburb.events[type](inf);
	}
	this.reset();
}

//parse the trigger info into an actual event to watch
Sburb.Trigger.prototype.reset = function(){
	for(var i=0; i<this.events.length; i++){
		this.events[i].reset();
	}
}

Sburb.Trigger.prototype.checkCompletion = function() {
	return this["operator"+this.operator]();
}

//check if the trigger has been satisfied
Sburb.Trigger.prototype.tryToTrigger = function(){
	if(this.waitFor){
		if(this.waitFor.checkCompletion()){
			this.waitFor=null;
		}else{
			return;
		}
	}
	if(this.checkCompletion()){
		if(this.action){
			var result = Sburb.performAction(this.action);
			if(result){
				this.waitFor = new Sburb.Trigger("noActions,"+result.id);
			}else{
				this.waitFor = new Sburb.Trigger("noActions");
			}
		}
		if(this.followUp){
			if(this.followUp.tryToTrigger()){
				this.followUp = null;
			}
		}
		if(this.restart){
			reset();
		}
		return this.detonate;
	}
}

//Serialize the Trigger to XML
Sburb.Trigger.prototype.serialize = function(output){
	output = output.concat("\n<trigger"+
		(this.restart?" restart='true'":"")+
		(this.detonate?" detonate='true'":"")+
		(this.operator?" operator='"+this.operator+"'":"")+
		">");
		for(var i=0;i<this.info.length;i++){
			if(this.events[i].serialize) {
				output = output.concat("<args>"+escape(this.events[i].serialize())+"</args>");
			} else {
				output = output.concat("<args>"+escape(this.info[i])+"</args>");
			}
		}
	if(this.action){
		output = this.action.serialize(output);
	}
	if(this.followUp){
		output = this.followUp.serialize(output);
	}
	output = output.concat("\n</trigger>");
	return output;
}

Sburb.Trigger.prototype.operatorAND = function(){
	var result = true;
	for(var i=0;i<this.events.length;i++){
		result = result && this.events[i].checkCompletion();
	}
	return result;
}

Sburb.Trigger.prototype.operatorOR = function(){
	var result = false;
	for(var i=0;i<this.events.length;i++){
		result = result || this.events[i].checkCompletion();
	}
	return result;
}

Sburb.Trigger.prototype.operatorXOR = function(){
	var result = false;
	for(var i=0;i<this.events.length;i++){
		if(this.events[i].checkCompletion()){
			if(result){
				return false; //*EXCLUSIVE* OR!
			}else{
				result = true;
			}
		}
	}
	return result;
}

Sburb.Trigger.prototype.operatorNAND = Sburb.Trigger.prototype.operatorNOT = function(){
	return !this.operatorAND();
}

Sburb.Trigger.prototype.operatorNOR = function(){
	return !this.operatorOR();
}


////////////////////////////////////////on
//Related Utility Functions
////////////////////////////////////////

//Parse a Trigger from XML
Sburb.parseTrigger = function(triggerNode){
	var firstTrigger = null;
	var oldTrigger = null;
	do{
		var attributes = triggerNode.attributes;
		var info = getNodeText(triggerNode);
		for(var i=0;i<info.length;i++){
			info[i] = unescape(info[i]);
		}
		var actions = triggerNode.getElementsByTagName("action");
		
		var action = null;
		var restart = false;
		var detonate = false;
		var operator = null;
		if(actions.length>0 && actions[0].parentNode==triggerNode){
			action = Sburb.parseAction(actions[0]);
		}
		restart = attributes.getNamedItem("restart")?attributes.getNamedItem("restart").value=="true":restart;
		detonate = attributes.getNamedItem("detonate")?attributes.getNamedItem("detonate").value=="true":detonate;
		operator = attributes.getNamedItem("operator")?attributes.getNamedItem("operator").value:operator;
		
		var trigger = new Sburb.Trigger(info,action,null,restart,detonate,operator);
		
		if(!firstTrigger){
			firstTrigger = trigger;
		}
		if(oldTrigger){
			oldTrigger.followUp = trigger;
		}
		oldTrigger = trigger;
		var found=false;
		for(var i=0;i<triggerNode.childNodes.length;i++){
			var child = triggerNode.childNodes[i];
			if(child.nodeName=="trigger"){
				triggerNode = child;
				found = true;
				break;
			}
		}
		if(!found){
			break;
		}
	}while(triggerNode)
	return firstTrigger;
}



function getNodeText(xmlNode){
  if(!xmlNode) return [];
  var outputs = [];
  for(var i=0;i<xmlNode.childNodes.length;i++){
  	var child = xmlNode.childNodes[i];
  	if(child.tagName=="args"){
  		for(var k=0;k<child.childNodes.length;k++){
				if(child.childNodes[k].firstChild){
					serializer = new XMLSerializer();
					var output = "";
					for(var j=0; j<child.childNodes.length; j++){
						output += serializer.serializeToString(child.childNodes[j]);
					}
					outputs.push(output);
				}
			}
			if(typeof(child.textContent) != "undefined"){
				outputs.push(child.textContent);
			}else{
				outputs.push(child.firstChild.nodeValue);
			}
		}
	}
	if(outputs.length==0){
		outputs.push(xmlNode.firstChild.nodeValue);
	}
	return outputs;
}


return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){

function parseParams(info){
	var params = info.split(",");
	for(var i=0; i<params.length; i++){
		params[i] = params[i].trim();
	}
	return params;
}

var commands = {};


//Create a Dialog
//syntax: dialog syntax
commands.talk = function(info){
	Sburb.dialoger.startDialog(info);
}

//Pick a random line of dialog
//syntax: dialog syntax
commands.randomTalk = function(info){
	Sburb.dialoger.startDialog(info);
	var randomNum = Math.floor(Math.random()*(Sburb.dialoger.queue.length+1));
	if(randomNum){
		Sburb.dialoger.queue = [Sburb.dialoger.queue[randomNum-1]];
		Sburb.dialoger.nextDialog();
	}else{
		Sburb.dialoger.queue = [];
	}
}

//Change the room and move the character to a new location in that room
//syntax: roomName, newCharacterX, newCharacterY
commands.changeRoom = function(info){
	var params = parseParams(info);
	Sburb.changeRoom(Sburb.rooms[params[0]],parseInt(params[1]),parseInt(params[2]));
    Sburb.loadingRoom = false; // We did it!
}

//Change the focus of the camera
//syntax: spriteName
commands.changeFocus = function(info){
	var params = parseParams(info);
	if(params[0]=="null"){
		Sburb.focus = Sburb.destFocus = null;
	}else{
		var sprite = parseCharacterString(params[0]);
		Sburb.destFocus = sprite;
	}
}

//Perform changeRoom, and also add teleport effects
//syntax: see changeRoom
commands.teleport = function(info){
	commands.changeRoom(info);
	Sburb.playEffect(Sburb.effects["teleportEffect"],Sburb.char.x,Sburb.char.y);
	var params = parseParams(info);
	Sburb.curAction.followUp = new Sburb.Action("playEffect","teleportEffect,"+params[1]+","+params[2],null,null,Sburb.curAction.followUp);
	//playSound(new BGM(assets["teleportSound"],0));
}

//Set a different Character as the player
//syntax: newPlayerName
commands.changeChar = function(info){
	Sburb.char.becomeNPC();
	Sburb.char.moveNone();
	Sburb.char.walk();
	Sburb.destFocus = Sburb.char = Sburb.sprites[info];
	Sburb.char.becomePlayer();
	Sburb.setCurRoomOf(Sburb.char);
}

//Set the given song as the new background music
//syntax: songName, loopingStartPoint (seconds)
commands.playSong = function(info){
	var params = parseParams(info);
	
	Sburb.changeBGM(new Sburb.BGM(Sburb.assets[params[0]],parseFloat(params[1])));
}

commands.becomeNPC = function(info){
	Sburb.char.becomeNPC();
}

commands.becomePlayer = function(info){
	Sburb.char.becomePlayer();
}

//Play the given sound
//syntax: soundName
commands.playSound = function(info){
	Sburb.playSound(new Sburb.Sound(Sburb.assets[info.trim()]));
}

//Play the given effect and the given location
//syntax: effectName, x, y
commands.playEffect = function(info){
	var params = parseParams(info);
	Sburb.playEffect(Sburb.effects[params[0]],parseInt(params[1]),parseInt(params[2]));
}

//Have the specified sprite play the specified animation
//syntax: spriteName, animationName
commands.playAnimation = commands.startAnimation = function(info){
	var params = parseParams(info);
	var sprite = parseCharacterString(params[0]);
	
	sprite.startAnimation(params[1]);
}

//Add actions to a sprite
//Syntax: spriteName, SBURBML action tags
commands.addAction = commands.addActions = function(info){
	var params = parseParams(info);
	var firstComma = info.indexOf(",");
	var sprite = parseCharacterString(params[0]);
	var actionString = info.substring(firstComma+1,info.length);

	var actions = parseActionString(actionString);

	for(var i=0;i<actions.length;i++){
		var action = actions[i];
		sprite.addAction(action);
	}
}

//Remove an action from a sprite
//Syntax: spriteName, actionName
commands.removeAction = commands.removeActions = function(info){
	var params = parseParams(info);
	var sprite = parseCharacterString(params[0]);
	for(var i=1;i<params.length;i++){
		sprite.removeAction(params[i]);
	}
}

//Present player with following actions to choose from
//Sytax: SBURBML action tags
commands.presentAction = commands.presentActions = function(info){
	var actions = parseActionString(info);
	Sburb.chooser.choices = actions;
	Sburb.chooser.beginChoosing(Sburb.Stage.x+20,Sburb.Stage.y+50);
	//Sburb.Stage is the true position of the view. Sburb.cam is simply the desired position
}


//Open the specified chest, revealing the specified item, and with the specified text
//Syntax: chestName, itemName, message
commands.openChest = function(info){
	var params = info.split(",",2);
	var chest = Sburb.sprites[params[0].trim()];
	var item = Sburb.sprites[params[1].trim()];
	if(chest.animations["open"]){
		chest.startAnimation("open");
		if(Sburb.assets["openSound"]){
			commands.playSound("openSound");
		}
	}
	
	// chest.removeAction(Sburb.curAction.name);
	var offset = params[0].length+params[1].length+2;
	var speech = info.substring(offset,info.length).trim();
	speech = speech.charAt(0)=="@" ? speech : "@! "+speech;
	var lastAction;
	var newAction = lastAction = new Sburb.Action("waitFor","played,"+chest.name,null,null);
	lastAction = lastAction.followUp = new Sburb.Action("waitFor","time,13");
	lastAction = lastAction.followUp = new Sburb.Action("addSprite",item.name+","+Sburb.curRoom.name,null,null,null,true);
	lastAction = lastAction.followUp = new Sburb.Action("moveSprite",item.name+","+chest.x+","+(chest.y-60),null,null,null,true,true);
	lastAction = lastAction.followUp = new Sburb.Action("deltaSprite",item.name+",0,-3",null,null,null,true,null,10);
	if(Sburb.assets["itemGetSound"]){
		lastAction = lastAction.followUp = new Sburb.Action("playSound","itemGetSound",null,null,null,true,null);
	}
	lastAction = lastAction.followUp = new Sburb.Action("waitFor","time,30");
	lastAction = lastAction.followUp = new Sburb.Action("talk",speech);
	
	lastAction = lastAction.followUp = new Sburb.Action("removeSprite",item.name+","+Sburb.curRoom.name);
	lastAction.followUp = Sburb.curAction.followUp;
	Sburb.performAction(newAction);
}

//Move the specified sprite by the specified amount
//syntax: spriteName, dx, dy
commands.deltaSprite = function(info){
	var params = parseParams(info);
	var sprite = null;
	if(params[0]=="char"){
		sprite = Sburb.char;
	}else{
		sprite = Sburb.sprites[params[0]];
	}
	var dx = parseInt(params[1]);
	var dy = parseInt(params[2]);
	sprite.x+=dx;
	sprite.y+=dy;
}

//Move the specified sprite to the specified location
//syntax: spriteName, x, y
commands.moveSprite = function(info){
	var params = parseParams(info);
	var sprite = parseCharacterString(params[0]);
	var newX = parseInt(params[1]);
	var newY = parseInt(params[2]);
	sprite.x = newX;
	sprite.y = newY;
}

//Move the specified sprite to the specified depth
//syntax: spriteName, depth
commands.depthSprite = function(info){
	var params = parseParams(info);
	var sprite = parseCharacterString(params[0]);
	var depth = parseInt(params[1]);
	sprite.depthing = depth;
}


//Play the specified flash movie
//syntax: movieName
commands.playMovie = function(info){
	var params = parseParams(info);
	Sburb.playMovie(Sburb.assets[params[0]]);
	if(params.length>0){
		var interval = setInterval(function(){
			var movie = window.document.getElementById("movie"+params[0]);
			if(movie && (!movie.CurrentFrame || movie.CurrentFrame()>=4)){
				clearInterval(interval);
				commands.playSong(info.substring(info.indexOf(",")+1,info.length));
			}
		},10);
	}
}

//Remove the specified flash movie
//syntax: movieName
commands.removeMovie = function(info){
	Sburb.playingMovie = false;
	Sburb.draw();
	document.getElementById(info).style.display = "none";
	//document.getElementById("gameDiv").style.display = "block";
	
}

//Prevents user from providing input to the character
//syntax: none
commands.disableControl = function(info){
	Sburb.inputDisabled = info.trim().length>0 ? new Sburb.Trigger(info) : true;
}

//Undoes disableControl
//syntax: none
commands.enableControl = function(info){
	Sburb.inputDisabled = false;
}

//DEPRECATED; DO NOT USE
//Block user input and main-queue progression until the specified Event
//syntax: Event syntax
commands.waitFor = function(info){
	commands.disableControl(info);
	return commands.sleep(info);
}

//Execute an action and wait for all followUps to finish
//syntax: SBURBML action tag
commands.macro = function(info){
	var actions = parseActionString(info);
	var action = actions[0];
	if(!action.silent) {
		action.silent = true;
	}
	var newQueue = Sburb.performAction(action);
	if(newQueue) {
		return new Sburb.Trigger("noActions,"+newQueue.id);
	}
}

//Wait for the specified event before continuing the current queue
//syntax: Event syntax
commands.sleep = function(info){
	return new Sburb.Trigger(info);
}

//Pauses an actionQueue, it can be resumed with resumeActionQueue
//syntax: Id of actionQueue or list of Ids
commands.pauseActionQueue = commands.pauseActionQueues = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		var queue=Sburb.getActionQueueById(params[i]);
		if(queue) {
			queue.paused = true;
		}
	}
}

//Resumes an previously paused actionQueue
//syntax: Id of actionQueue or list of Ids
commands.resumeActionQueue = commands.resumeActionQueues = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		var queue=Sburb.getActionQueueById(params[i]);
		if(queue) {
			queue.paused = false;
		}
	}
}

//Cancels an actionQueue
//syntax: Id of actionQueue or list of Ids
commands.cancelActionQueue = commands.cancelActionQueues = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		Sburb.removeActionQueueById(params[i]);
	}
}

//Pauses a group of actionQueues, they can be resumed with resumeActionQueueGroup
//syntax: group name or list of group names
commands.pauseActionQueueGroup = commands.pauseActionQueueGroups = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		Sburb.forEachActionQueueInGroup(params[i], function(queue) {
			queue.paused = true;
		});
	}
}

//Resumes a previously paused group of actionQueues
//syntax: group name or list of group names
commands.resumeActionQueueGroup = commands.resumeActionQueueGroups = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		Sburb.forEachActionQueueInGroup(params[i], function(queue) {
			queue.paused = false;
		});
	}
}

//Cancels a group of actionQueues
//syntax: group name or list of group names
commands.cancelActionQueueGroup = commands.cancelActionQueueGroups = function(info){
	var params = parseParams(info);
	for(var i=0;i<params.length;i++) {
		Sburb.removeActionQueuesByGroup(params[i]);
	}
}

//Add the specified sprite to the specified room
//syntax: spriteName, roomName
commands.addSprite = function(info){
	var params = parseParams(info);
	var sprite = Sburb.sprites[params[0]];
	var room = Sburb.rooms[params[1]];
	
	room.addSprite(sprite);
}

//Remove the specified sprite from the specified room
//syntax: spriteName, roomName
commands.removeSprite = function(info){
	var params = parseParams(info);
	var sprite = Sburb.sprites[params[0]];
	var room = Sburb.rooms[params[1]];
	room.removeSprite(sprite);
}

//Clone the specified sprite with a new name
//syntax: spriteName, newName
commands.cloneSprite = function(info){
	var params = parseParams(info);
	var sprite = parseCharacterString(params[0]);
	var newName = params[1];
	sprite.clone(newName);
}

//Add the specified path as a walkable to the specified room
//syntax: pathName, roomName
commands.addWalkable = function(info){
	var params = parseParams(info);
	var path = Sburb.assets[params[0]];
	var room = Sburb.rooms[params[1]];
	room.addWalkable(path);
}

//Add the specified path as an unwalkable to the specified room
//syntax: pathName, roomName
commands.addUnwalkable = function(info){
	var params = parseParams(info);
	var path = Sburb.assets[params[0]];
	var room = Sburb.rooms[params[1]];
	room.addUnwalkable(path);
}

//Add the specified path as a motionpath to the specified room
//syntax: pathName, xtox, xtoy, ytox, ytoy, dx, dy, roomName
commands.addMotionPath = function(info){
	var params = parseParams(info);
	var path = Sburb.assets[params[0]];
	var room = Sburb.rooms[params[7]];
	room.addMotionPath(path,
		parseFloat(params[1]),parseFloat(params[2]),
		parseFloat(params[3]),parseFloat(params[4]),
		parseFloat(params[5]),parseFloat(params[6]));
}

//Remove the specified walkable from the specified room
//syntax: pathName, roomName
commands.removeWalkable = function(info){
	var params = parseParams(info);
	var path = Sburb.assets[params[0]];
	var room = Sburb.rooms[params[1]];
	room.removeWalkable(path);
}

//Remove the specified unwalkable from the specified room
//syntax: pathName, roomName
commands.removeUnwalkable = function(info){
	var params = parseParams(info);
	var path = Sburb.assets[params[0]];
	var room = Sburb.rooms[params[1]];
	room.removeUnwalkable(path);
}


//Toggle the volume
//syntax: none
commands.toggleVolume = function(){
	if(Sburb.globalVolume>=1){
		Sburb.globalVolume=0;
	}else if(Sburb.globalVolume>=0.6){
		Sburb.globalVolume = 1;
	}else if(Sburb.globalVolume>=0.3){
		Sburb.globalVolume = 0.66;
	}else {
		Sburb.globalVolume = 0.33;
	}
	if(Sburb.bgm){
		Sburb.bgm.fixVolume();
	}
}

//change the engine mode
//syntax: modeName
commands.changeMode = function(info){
	Sburb.engineMode = info.trim();
}

//load in an additional SBURBML file
//syntax: path, keepOld
commands.loadStateFile = function(info){
	var params = parseParams(info);
	var path = params[0];
	var keepOld = params[1]=="true";
	Sburb.loadSerialFromXML(path,keepOld);
}

//fade out to black
//syntax: none
commands.fadeOut = function(info){
	Sburb.fading = true;
}

//go to a room that may not have been loaded yet
//syntax: filepath, roomName, newCharacterX, newCharacterY
commands.changeRoomRemote = function(info){
    if(Sburb.loadingRoom) return; Sburb.loadingRoom = true; //Only load one room at a time
	var params = parseParams(info);
	var lastAction;
	var newAction = lastAction = new Sburb.Action("fadeOut");
	lastAction = lastAction.followUp = new Sburb.Action("loadStateFile",params[0]+","+true);
	lastAction = lastAction.followUp = new Sburb.Action("changeRoom",params[1]+","+params[2]+","+params[3]);
	lastAction.followUp = Sburb.curAction.followUp;
	Sburb.performAction(newAction);
}

//Teleport to a room which may not have been loaded yet
//syntax: filepath, roomName, newCharacterX, newCharacterY
commands.teleportRemote = function(info){
    if(Sburb.loadingRoom) return; Sburb.loadingRoom = true; //Only load one room at a time
	commands.changeRoomRemote(info);
	
	Sburb.playEffect(Sburb.effects["teleportEffect"],Sburb.char.x,Sburb.char.y);
	
	var params = parseParams(info);
	Sburb.curAction.followUp.followUp.followUp = new Sburb.Action("playEffect","teleportEffect,"+params[2]+","+params[3],null,null,Sburb.curAction.followUp.followUp.followUp);
}


//Change the state of the specified button
//syntax: buttonName, state
commands.setButtonState = function(info){
	var params = parseParams(info);
	Sburb.buttons[params[0]].setState(params[1]);
}

//Skip the current conversation
//syntax: none
commands.skipDialog = function(info){
	Sburb.dialoger.skipAll();
}

//Set a character to follow another sprite
//syntax: followerName, leaderName
commands.follow = function(info){
	var params = parseParams(info);
	var follower = parseCharacterString(params[0]);
	var leader = parseCharacterString(params[1]);
	follower.follow(leader);
}

//Set a character to stop following another sprite
//syntax: followerName
commands.unfollow = function(info){
	var params = parseParams(info);
	var follower = parseCharacterString(params[0]);
	follower.unfollow();
}

//Overlay a sprite over the game area (below the HUD)
//syntax: spriteName
commands.addOverlay = function(info){
	var params = parseParams(info);
	var sprite = Sburb.sprites[params[0]];
	sprite.x = Sburb.Stage.x;
	sprite.y = Sburb.Stage.y;
	Sburb.curRoom.addSprite(sprite);
}

//Remove an overlay
//syntax: spriteName
commands.removeOverlay = function(info){
	var params = parseParams(info);
	var sprite = Sburb.sprites[params[0]];
	Sburb.curRoom.removeSprite(sprite);
}

//Save state to client storage
//syntax: isAuto, useLocal
commands.save = function(info){
	var params = parseParams(info);
	var auto = params.length>0 && params[0]=="true";
	var local = params.length>1 && params[1]=="true";
	Sburb.saveStateToStorage(Sburb.char.name+", "+Sburb.curRoom.name,auto,local);
}

//Load state from client storage
//syntax: isAuto, useLocal
commands.load = function(info){
	var params = parseParams(info);
	var auto = params.length>0 && params[0]=="true";
	var local = params.length>1 && params[1]=="true";
	Sburb.loadStateFromStorage(auto, local);
//	Sburb.saveStateToStorage(Sburb.char.name+", "+Sburb.curRoom.name,auto,local);
}

//Display save/load options
//syntax: useLocal
commands.saveOrLoad = function(info){
	var params = parseParams(info);
	var local = params.length>0 && params[0]=="true";
	var actions = [];
	if(Sburb.isStateInStorage(false,local)){
		actions.push(new Sburb.Action("load","false, "+local,"Load "+Sburb.getStateDescription(false)));
	}
	if(Sburb.isStateInStorage(true,local)){
		actions.push(new Sburb.Action("load","true, "+local,"Load "+Sburb.getStateDescription(true)));
	}
	if(Sburb.tests.storage) {
	    actions.push(new Sburb.Action("save","false,"+local,"Save"));
    }
	actions.push(new Sburb.Action("cancel",null,"Cancel"));
	Sburb.chooser.choices = actions;
	Sburb.chooser.beginChoosing(Sburb.Stage.x+20,Sburb.Stage.y+50);
}

//Change global game state
//syntax: gameState, value
commands.setGameState = function(info) {
	var params = parseParams(info);
	// TODO: there should be a check to make sure the gameState key
	// doesn't contain &, <, or >
	Sburb.gameState[params[0]] = params[1];
}

//Move the character backwards
//syntax: charName
commands.goBack = function(info){
	var params = parseParams(info);
	var character = parseCharacterString(params[0]);
	character.x = character.oldX;
	character.y = character.oldY;
}
//tryToTrigger the given triggers in order, if one succeeds, don't do the rest (they are like an else-if chain)
//syntax: Sburbml trigger syntax
commands.try = function(info){
	var triggers = parseTriggerString(info);
	for(var i=0; i<triggers.length; i++){
		var trigger = triggers[i];
		trigger.detonate = true;
		if(trigger.tryToTrigger()){
			return;
		}
	}
}


//make the character walk in the specified direction (Up, Down, Left, Right, None)
//syntax: charName, direction
commands.walk = function(info){
	var params = parseParams(info);
	var character = parseCharacterString(params[0]);
	var dir = params[1];
	if(typeof character["move"+dir] == "function"){
		character["move"+dir]();
	}
}

//blank utlity function
//syntax: none
commands.cancel = function(){
	//do nothing
}




var parseCharacterString = Sburb.parseCharacterString = function(string){
	if(string=="char"){
		return Sburb.char;
	}else{
		return Sburb.sprites[string];
	}
}


function parseActionString(string){
	var actions = [];
	string = "<sburb>"+string+"</sburb>";
    
	var input = Sburb.parseXML(string);
	for(var i=0; i<input.childNodes.length; i++) {
		var tmp = input.childNodes[i];
		if(tmp.tagName=="action") {
			actions.push(Sburb.parseAction(tmp));
		}
	}
	return actions;
}

function parseTriggerString(string){
	var triggers = [];
	string = "<triggers>"+string+"</triggers>";
	
	var input = Sburb.parseXML(string);
	for(var i=0; i<input.childNodes.length; i++) {
		var tmp = input.childNodes[i];
		if(tmp.tagName=="trigger") {
			triggers.push(Sburb.parseTrigger(tmp));
		}
	}
	return triggers;
}


Sburb.commands = commands;
return Sburb;

})(Sburb || {});
var Sburb = (function(Sburb){

Sburb.loadedFiles = {};

var templateClasses = {};
var loadingDepth = 0;
var loadQueue = [];
var updateLoop = null;
var jsonUpdateLoop = null;

//Save the current state to xml
Sburb.serialize = function(sburbInst) { 
	var assets = sburbInst.assets;
	var effects = sburbInst.effects;
	var rooms = sburbInst.rooms;
	var sprites = sburbInst.sprites;
	var hud = sburbInst.hud;
	var dialoger = sburbInst.dialoger;
	var curRoom = sburbInst.curRoom;
	var gameState = sburbInst.gameState;
	var actionQueues = sburbInst.actionQueues;
	var char = sburbInst.char;

	var loadedFiles = "";
	var loadedFilesExist = false;

	for(var key in Sburb.loadedFiles) // Not sburbInst.loadedFiles ?
	{
	    if(!Sburb.loadedFiles.hasOwnProperty(key)) continue;
	    loadedFiles = loadedFiles + (loadedFilesExist?",":"") + key;
	    loadedFilesExist = true;
	}


	var out = document.getElementById("serialText");
	var output = "<sburb"+
		" char='"+char.name+
		(Sburb.bgm?"' bgm='"+Sburb.bgm.asset.name+(Sburb.bgm.startLoop?","+Sburb.bgm.startLoop:""):"")+
		(Sburb.Stage.scaleX!=1?"' scale='"+Sburb.Stage.scaleX:"")+
		(Sburb.nextQueueId>0?"' nextQueueId='"+Sburb.nextQueueId:"")+
		(Sburb.assetManager.resourcePath?("' resourcePath='"+Sburb.assetManager.resourcePath):"")+
		(Sburb.assetManager.levelPath?("' levelPath='"+Sburb.assetManager.levelPath):"")+
		(loadedFilesExist?("' loadedFiles='"+loadedFiles):"")+
		"'>\n";
	output = serializeAssets(output,assets,effects);
	output = serializeTemplates(output,templateClasses);
	output = serializeHud(output,hud,dialoger);
	output = serializeLooseObjects(output,rooms,sprites);
	output = serializeRooms(output,rooms);
	output = serializeGameState(output,gameState);
	output = serializeActionQueues(output,actionQueues);

	output = output.concat("\n</sburb>");
	if(out){
		out.value = output;
	}
	return output;
}

///
// Saves state to session or local storage if supported by browser
// Paramters:
//   description (String) A descriptive name for the save, i.e. 'Kankri, Second Room'
//   auto (Boolean) If true this save is an auto save, false it is not
//   local (Boolean) If true, use localStorage, if false, use sessionStorage
// Returns:
//   (Boolean) False if storage is not supported by browser, true otherwise 
///
Sburb.saveStateToStorage = function(description, auto, local)
{
	description = typeof description !== 'undefined' ? description : "SaveFile";
	auto = typeof auto !== 'undefined' ? auto : false;
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return false;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return false;
    }

	var serialized = Sburb.serialize(Sburb);
	compressed = Iuppiter.Base64.encode(Iuppiter.compress(serialized),true);
	var saveStateName = description + (auto? " (auto)":"") + '_savedState_' + Sburb.name + ":" + Sburb.version;


	Sburb.deleteStateFromStorage(auto);
	storage.setItem(saveStateName, compressed);

	return true;
}

///
// Loads state from session or local storage if supported by browser
// Paramters:
//   auto (Boolean) If true loads the auto save, else it loads the manual save
//   local (Boolean) If true, use localStorage, if false, use sessionStorage
// Returns:
//   (Boolean) False if storage is not supported by browser or save does not exist, true otherwise 
///
Sburb.loadStateFromStorage = function(auto, local)
{
	description = typeof description !== 'undefined' ? description : "SaveFile";
	auto = typeof auto !== 'undefined' ? auto : false;
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return false;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return false;
    }

	var saveStateName = "";

	for(var key in storage)
	{
	    if(!storage.hasOwnProperty(key)) continue;
		var savedIndex = key.indexOf('_savedState_');
		if(savedIndex >= 0) // this key is a saved state
		{
			if(auto && key.indexOf("(auto)") >= 0 && key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
			{
				saveStateName = key;
				break;
			}
			else if(!auto && key.indexOf("(auto)") < 0 &&  key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
			{
				saveStateName = key;
				break;
			}
		}

	}

	var compressed = storage.getItem(saveStateName);

	if(!compressed)
		return false;
	var decoded = Iuppiter.decompress(Iuppiter.Base64.decode(Iuppiter.toByteArray(compressed),true)).replace(/\0/g,"");
	Sburb.loadSerial(decoded);
	
	return true;
}
///
// Gets the descriptive name of the currently saved state
// Paramters:
//   auto (Boolean) If true returns the description for the auto save, if false the manual save
// Returns:
//   (String) Description of save, returns "" if no description is found or storage is not supported
///
Sburb.getStateDescription = function(auto, local)
{	
	auto = typeof auto !== 'undefined' ? auto : false;
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return null;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return null;
    }

	for(var key in storage)
	{
	    if(!storage.hasOwnProperty(key)) continue;
		var savedIndex = key.indexOf('_savedState_');
		if(savedIndex >= 0) // this key is a saved state
		{
			if(auto && key.indexOf("(auto)") >= 0 && key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				return key.substring(0, savedIndex);
			else if(!auto && key.indexOf("(auto)") < 0 &&  key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				return key.substring(0, savedIndex);
		}

	}

	return null;
}

///
// Deletes state from session or local storage if supported by browser
// Paramters:
//   auto (Boolean) If true, deletes the current auto save, if false deletes the current manual save
//   local (Boolean) If true, use localStorage, if false, use sessionStorage
///
Sburb.deleteStateFromStorage = function(auto, local)
{
	auto = typeof auto !== 'undefined' ? auto : false;
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return;
    }

	Sburb.deleteOldVersionStates(local);
	for(var key in storage)
	{
	    if(!storage.hasOwnProperty(key)) continue;
		var savedIndex = key.indexOf('_savedState_');
		if(savedIndex >= 0) // this key is a saved state
		{
			if(auto && key.indexOf("(auto)") >= 0 && key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				storage.removeItem(key);
			else if(!auto && key.indexOf("(auto)") < 0 &&  key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				storage.removeItem(key);
		}

	}

}
///
// Deletes any old states from previous versions of the game
// Paramters:
//   local (Boolean) If true, use localStorage, if false, use sessionStorage
///
Sburb.deleteOldVersionStates = function(local)
{
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return;
    }

	for(var key in storage)
	{
	    if(!storage.hasOwnProperty(key)) continue;
		var savedIndex = key.indexOf('_savedState_');
		if(savedIndex >= 0) // this key is a saved state
		{
			// This is a key for our game, but not of the right version
			if(key.indexOf(Sburb.name + ":") >= savedIndex && key.indexOf(":" + Sburb.version) < 0)
				storage.removeItem(key);
		}

	}
}

///
// Checks if state is in session of local storage
// Paramters:
//   local (Boolean) If true, use localStorage, if false, use sessionStorage
// Returns:
//   (Boolean) True is state is in storage, false if it is not (or storage is not supported)
///
Sburb.isStateInStorage = function(auto, local)
{
	auto = typeof auto !== 'undefined' ? auto : false;
	local = typeof local !== 'undefined' ? local : false;

    var storage;
    if(!Sburb.tests.storage) {
        return false;
    }
    if(Sburb.tests.storage.local && Sburb.tests.storage.session) {
        storage = local ? localStorage : sessionStorage;
    } else if(Sburb.tests.storage.local) {
        storage = localStorage;
    } else if(Sburb.tests.storage.session) {
        storage = sessionStorage;
    } else {
        return false;
    }

	for(var key in storage)
	{
	    if(!storage.hasOwnProperty(key)) continue;
		var savedIndex = key.indexOf('_savedState_');
		if(savedIndex >= 0) // this key is a saved state
		{
			if(auto && key.indexOf("(auto)") >= 0 && key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				return true;
			else if(!auto && key.indexOf("(auto)") < 0 &&  key.indexOf(Sburb.name + ":" + Sburb.version) >= savedIndex)
				return true;
		}

	}

	return false;
}

function encodeXML(s) {
	return s.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;');
};

//Serialize things that aren't actually in any room
function serializeLooseObjects(output,rooms,sprites){

	for(var sprite in sprites){
	    if(!sprites.hasOwnProperty(sprite)) continue;
		var theSprite = sprites[sprite];
		var contained = false;
		for(var room in rooms){
	        if(!rooms.hasOwnProperty(room)) continue;
			if(rooms[room].contains(theSprite)){
				contained = true;
				break;
			}
		}
		if(!contained){
			output = theSprite.serialize(output);
		}
	}
	for(var button in Sburb.buttons){
	    if(!Sburb.buttons.hasOwnProperty(button)) continue;
		var theButton = Sburb.buttons[button];
		if(!Sburb.hud[theButton.name]){
			output = theButton.serialize(output);
		}
	}

	return output;
}

//Serializes Rooms
function serializeRooms(output, rooms)
{
	output = output.concat("\n<rooms>\n");
	for(var room in rooms){
	    if(!rooms.hasOwnProperty(room)) continue;
		output = rooms[room].serialize(output);
	}
	output = output.concat("\n</rooms>\n");

	return output;
}
function serializeGameState(output, gameState) 
{
	output = output.concat("\n<gameState>\n");
	for(var key in gameState) {
	    if(!gameState.hasOwnProperty(key)) continue;
		output = output.concat("  <"+key+">"+encodeXML(gameState[key])+"</"+key+">");
	}
	output = output.concat("\n</gameState>\n");

	return output;
}

function serializeActionQueues(output, actionQueues) 
{
	output = output.concat("<actionQueues>");
	for(var i=0;i<actionQueues.length;i++) {
		if(actionQueues[i].curAction) {
			output = actionQueues[i].serialize(output);
		}
	}
	output = output.concat("\n</actionQueues>\n");

	return output;
}

//Serialize assets
function serializeAssets(output,assets,effects){
	output = output.concat("\n<assets>");
	for(var asset in assets){
	    if(!assets.hasOwnProperty(asset)) continue;
		var curAsset = assets[asset];
		var innerHTML = "";

		if(curAsset.type=="graphic"){

			innerHTML += curAsset.originalVals;
		}else if(curAsset.type=="audio"){

			var firstSrc = false;
			for(var i = 0; i < curAsset.originalVals.length; i++)
			{
				var srcVal = curAsset.originalVals[i];
				innerHTML += (firstSrc?";":"")+srcVal;

				firstSrc = true;
			}

		}else if(curAsset.type=="path"){
			for(var i=0;i<curAsset.points.length;i++){
				innerHTML = innerHTML.concat(curAsset.points[i].x+","+curAsset.points[i].y);
				if(i!=curAsset.points.length-1){
					innerHTML = innerHTML.concat(";");
				}
			}
		}else if(curAsset.type=="movie"){
			innerHTML += curAsset.originalVals;
		}else if(curAsset.type=="font"){
			innerHTML += curAsset.originalVals;
		}else if(curAsset.type=="text"){
			innerHTML += escape(curAsset.text.trim());
		}

		output = output.concat("\n<asset name='"+curAsset.name+"' type='"+curAsset.type+"' ");

		output = output.concat(" >");
		output = output.concat(innerHTML);
		output = output.concat("</asset>");
	}
	output = output.concat("\n</assets>\n");
	output = output.concat("\n<effects>");
	for(var effect in effects){
	    if(!effects.hasOwnProperty(effect)) continue;
		var curEffect = effects[effect];
		output = curEffect.serialize(output);
	}
	output = output.concat("\n</effects>\n");
	return output;
}

//Serialize template classes
function serializeTemplates(output,templates){
	output = output.concat("\n<classes>");
	var serialized;
	try {
		// XMLSerializer exists in current Mozilla browsers
		serializer = new XMLSerializer();
		for(var template in templates){
	        if(!templates.hasOwnProperty(template)) continue;
			output = output.concat(serializer.serializeToString(templates[template]));
		}
	}catch (e) {
		// Internet Explorer has a different approach to serializing XML
		for(var template in templates){
	        if(!templates.hasOwnProperty(template)) continue;
			output = output.concat(templates[template].xml);
		}
	}
	output = output.concat("\n</classes>\n");
	return output;
}

//Serialize Hud
function serializeHud(output,hud,dialoger){
	output = output.concat("\n<hud>");
	for(var content in hud){
        if(!hud.hasOwnProperty(content)) continue;
		output = hud[content].serialize(output);
	}
	output = Sburb.dialoger.serialize(output);
	var animations = dialoger.dialogSpriteLeft.animations;
	output = output.concat("\n<dialogsprites>");
	for(var animation in animations){
        if(!animations.hasOwnProperty(animation)) continue;
		output = animations[animation].serialize(output);
	}
	output = output.concat("\n</dialogsprites>");
	output = output.concat("\n</hud>\n");
	return output;
}

//Purge all assets
function purgeAssets() {
    Sburb.assetManager.purge();
    Sburb.assets = Sburb.assetManager.assets;
}

//Purge the game state
function purgeState(){
	if(Sburb.rooms){
		delete Sburb.rooms;
	}
	if(Sburb.sprites){
		delete Sburb.sprites;
	}
	Sburb.rooms = {};
	if(Sburb.bgm){
		Sburb.bgm.stop();
		Sburb.bgm = null;
	}
    for(var bin in Sburb.Bins) {
        if(!Sburb.Bins.hasOwnProperty(bin)) continue;
        Sburb.Bins[bin].innerHTML = "";
    }
	Sburb.gameState = {};
	Sburb.globalVolume = 1;
	Sburb.hud = {};
	Sburb.sprites = {};
	Sburb.buttons = {};
	Sburb.effects = {};
	Sburb.curAction = null;
	Sburb.actionQueues = [];
	Sburb.nextQueueId = 0;
	Sburb.pressed = {};
	Sburb.pressedOrder = [];
	Sburb.chooser = new Sburb.Chooser();
	Sburb.dialoger = null;
	Sburb.curRoom = null;
	Sburb.char = null;
	Sburb.assetManager.resourcePath = "";
	Sburb.assetManager.levelPath = "";
	Sburb.loadedFiles = {};
}

//Load state/assets from file
Sburb.loadSerialFromXML = function(file,keepOld) {
	Sburb.haltUpdateProcess();
	file = Sburb.assetManager.levelPath+file;
	
	if(keepOld && Sburb.loadedFiles[file]){
		Sburb.startUpdateProcess();
		return;
	}else{
		Sburb.loadedFiles[file] = true;
	}
	
	
	var request = new XMLHttpRequest();
    request.open('GET', file, false);
    try {
		request.send(null);
    } catch(err) {
		console.log("Could not load level descriptors.");
		fi = document.getElementById("levelFile");
		return;
    }
    if (request.status === 200 || request.status == 0) { 
        try {
            loadSerial(request.responseText, keepOld);
        } catch(err) {
            if (err instanceof XMLParsingError) {
                if (err.file) {
                    console.error("Loaded from '"+file+"'")
                } else {
                    err.file = file
                    console.error("Error in '"+file+"'")
                }
            }
            throw err;
        }
    }
}

//main serial loading
function loadSerial(serialText, keepOld) {
	Sburb.haltUpdateProcess();

    var inText = serialText; //document.getElementById("serialText");
    var input = Sburb.parseXML(inText);
	
	if(!keepOld) {
    	purgeAssets(); 
    	purgeState();
    }

    var rootAttr = input.attributes;

	var levelPath = rootAttr.getNamedItem("levelPath");

    if(levelPath){
    	Sburb.assetManager.levelPath = levelPath.value.charAt(levelPath.value.length-1)=="/" ?
    		levelPath.value : levelPath.value+"/";
    }
    
    var resourcePath = rootAttr.getNamedItem("resourcePath");
    if(resourcePath){
    	Sburb.assetManager.resourcePath = resourcePath.value;
    }

    var name = rootAttr.getNamedItem("name");
    if(name) {
    	Sburb.name = name.value;
    }

    var version = rootAttr.getNamedItem("version");
    if(version) {
    	Sburb.version = version.value;
    }

    var width = rootAttr.getNamedItem("width");
    if(width) {
    	Sburb.setDimensions(width.value, null);
    }

    var height = rootAttr.getNamedItem("height");
    if(height) {
    	Sburb.setDimensions(null, height.value);
    }

    var loadedFiles = rootAttr.getNamedItem("loadedFiles");
    if(loadedFiles) {
    	var fileNames = loadedFiles.value.split(",");
    	for(var i = 0; i< fileNames.length; i++)
    	{
    		Sburb.loadedFiles[fileNames[i]] = true;
    	}
    }

    loadingDepth++;
    loadDependencies(input);
    loadingDepth--;
    loadSerialAssets(input);
	loadQueue.push(input);
	loadSerialState(input); 
}

Sburb.parseXML = function(inText) {
    var parser=new DOMParser();
    var parsed=parser.parseFromString(inText,"text/xml");
    
    if (parsed.getElementsByTagName("parsererror").length>0) {
        var error = parsed.getElementsByTagName("parsererror")[0];
        throw new XMLParsingError(error, inText);
    }
    
    return parsed.documentElement;
}

function XMLParsingError(error, input) {
    this.name = "XMLParsingError";
    this.message = parseXMLError(error);
    this.input = (input || "");
}
XMLParsingError.prototype = new Error();

function parseXMLError(n) {
    if(n.nodeType == 3) {
        return n.nodeValue;
    }
    if(n.nodeName == "h3") {
        return "";
    }
    var error = ""
    for(var i=0; i<n.childNodes.length; i++) {
        error = error + parseXMLError(n.childNodes[i]);
    }
    return error;
}

function loadDependencies(input){
    
	var dependenciesNode = input.getElementsByTagName("dependencies")[0];
	if(dependenciesNode){
		var dependencies = dependenciesNode.getElementsByTagName("dependency");
		for(var i=0; i<dependencies.length;i++){
			var dependency = dependencies[i].firstChild.nodeValue.trim();
			Sburb.loadSerialFromXML(dependency,true);
		}
	}
}

function loadSerialAssets(input){
	var rootAttr = input.attributes;
    
  var description = rootAttr.getNamedItem("description");
  if(description){
  	Sburb.assetManager.description = description.value;
  }else{
  	Sburb.assetManager.description = "assets"
  }
  
  var newAssets = input.getElementsByTagName("asset");
  for(var i=0;i<newAssets.length;i++){
		var curAsset = newAssets[i];
			var attributes = curAsset.attributes;
		var name = attributes.getNamedItem("name").value;
		if (!Sburb.assetManager.isLoaded(name)) {
			loadSerialAsset(curAsset);
		}
  }
}

function loadSerialAsset(curAsset){
    var newAsset = parseSerialAsset(curAsset);
    Sburb.assetManager.loadAsset(newAsset);
}
function parseSerialAsset(curAsset) {
	var attributes = curAsset.attributes;
	var name = attributes.getNamedItem("name").value;
	var type = attributes.getNamedItem("type").value;
	var value = curAsset.firstChild.nodeValue.trim();

	var blobUrlsAttr = attributes.getNamedItem("blob-urls");
	var blobUrls = [];

	if(blobUrlsAttr)
		blobUrls = blobUrlsAttr.value.split(";");

	if(blobUrls.length === 0) blobUrls = null;

	var newAsset;
	if(type=="graphic"){
		newAsset = Sburb.createGraphicAsset(name, value, blobUrls);
	} else if(type=="audio"){
		var sources = value.split(";");
		newAsset = Sburb.createAudioAsset(name, sources,blobUrls);
	} else if(type=="path"){
		var pts = value.split(";");
		var path = new Sburb.Path();
		for(var j=0;j<pts.length;j++){
			 var point = pts[j].split(",");
			 path.push({x:parseInt(point[0]),y:parseInt(point[1])});
		}
		newAsset = Sburb.createPathAsset(name,path);
	}else if(type=="movie"){
		newAsset = Sburb.createMovieAsset(name, value,blobUrls);
	}else if(type=="font"){
		//var sources = value.split(";");
		newAsset = Sburb.createFontAsset(name,value);
	}else if(type=="text"){
		newAsset = Sburb.createTextAsset(name,value);
	}
    newAsset._raw_xml = curAsset;
	return newAsset;
}



function loadSerialState() {
  // don't load state until assets are all loaded
  if(updateLoop){
  	clearTimeout(updateLoop);
  	updateLoop = null;
  }
  if(!Sburb.assetManager.finishedLoading()) {
		updateLoop=setTimeout(function() { loadSerialState(); } ,500);
		return;
  }
  
  while(loadQueue.length>0){
		var input = loadQueue[0];
		loadQueue.splice(0,1);
		//These two have to be first
	 	parseTemplateClasses(input);
		applyTemplateClasses(input);
		parseButtons(input);
		parseSprites(input);
		parseCharacters(input);
		parseFighters(input);
		parseRooms(input);
		parseGameState(input);	
	
		parseHud(input);
		parseEffects(input);
	
		//should be last
		parseState(input);
		//Relies on Sburb.nextQueueId being set when no Id is provided
		parseActionQueues(input);
  }
  
  if(loadQueue.length==0 && loadingDepth==0){
		Sburb.startUpdateProcess();
	}
}

function parseDialogSprites(input){
	var hud = input.getElementsByTagName("hud");

	if(hud.length>0){
		var dialogSprites = hud[0].getElementsByTagName("dialogsprites");

		if(dialogSprites.length>0){
			serialLoadDialogSprites(dialogSprites[0],Sburb.assets);
		}
	}
}

function parseEffects(input){
	var effects = input.getElementsByTagName("effects");

	if(effects.length>0){
		serialLoadEffects(effects[0],Sburb.assets,Sburb.effects);
	}
}

function parseTemplateClasses(input){
	var classes = input.getElementsByTagName("classes");

	if(classes.length>0){
		var templates = classes[0].childNodes;
		for(var i=0;i<templates.length;i++){
			var templateNode = templates[i];
			
			if(templateNode.nodeName!="#text" && templateNode.nodeName!="#comment"){
				applyTemplateClasses(templateNode);
			 	var tempAttributes = templateNode.attributes;
			 	templateClasses[tempAttributes.getNamedItem("class").value] =
			 		templateNode.cloneNode(true);
			}
		}
		input.removeChild(input.getElementsByTagName("classes")[0]);
	}
}

function applyTemplateClasses(input){
	for(var className in templateClasses){
        if(!templateClasses.hasOwnProperty(className)) continue;
		var templateNode = templateClasses[className];
	 	var candidates = input.getElementsByTagName(templateNode.nodeName);
	 	for(var j=0;j<candidates.length;j++){
	 		var candidate = candidates[j];
	 		tryToApplyTemplate(templateNode,candidate);
	 	}
	}
}

function tryToApplyTemplate(templateNode,candidate){
	var templateClass = templateNode.attributes.getNamedItem("class").value;
	var candClass = candidate.attributes.getNamedItem("class");
	if(candClass && candClass.value==templateClass){
		applyTemplate(templateNode,candidate);
	}
}

function applyTemplate(templateNode,candidate){
	var tempAttributes = templateNode.attributes;
	var tempChildren = templateNode.childNodes;
	var candAttributes = candidate.attributes;
	var candChildren = candidate.childNodes;
	for(var k=0;k<tempAttributes.length;k++){
		var tempAttribute = tempAttributes[k];
		if(!candAttributes.getNamedItem(tempAttribute.name)){
			candidate.setAttribute(tempAttribute.name, tempAttribute.value);
		}
	}
	for(var k=0;k<tempChildren.length;k++){
		candidate.appendChild(tempChildren[k].cloneNode(true));
	}
}

function parseButtons(input){
	var newButtons = input.getElementsByTagName("spritebutton");
	for(var i=0;i<newButtons.length;i++){
		var curButton = newButtons[i];
		var newButton = Sburb.parseSpriteButton(curButton);
  		Sburb.buttons[newButton.name] = newButton;
	}
}

function parseSprites(input){
	
	var newSprites = input.getElementsByTagName("sprite");
	for(var i=0;i<newSprites.length;i++){
		var curSprite = newSprites[i];
		var newSprite = Sburb.parseSprite(curSprite, Sburb.assets);
		Sburb.sprites[newSprite.name] = newSprite;
		parseActions(curSprite,newSprite);
	}
}

function parseActions(spriteNode,sprite){
	var newActions = spriteNode.childNodes;
	for(var k=0;k<newActions.length;k++){
		if(newActions[k].nodeName == "#text") {
			continue;
		}
		if(newActions[k].nodeName == "action"){
			var newAction = Sburb.parseAction(newActions[k]);
			sprite.addAction(newAction);
		}
	}
}

function parseCharacters(input){
	var newChars = input.getElementsByTagName("character");
  	for(var i=0;i<newChars.length;i++){
  		var curChar = newChars[i];
			var newChar = Sburb.parseCharacter(curChar, Sburb.assets);
  		Sburb.sprites[newChar.name] = newChar;
  		parseActions(curChar,newChar);
  	}
}

function parseFighters(input){
	var newFighters = input.getElementsByTagName("fighter");
  	for(var i=0;i<newFighters.length;i++){
  		var curFighter = newFighters[i];
			var newFighter = Sburb.parseFighter(curFighter, Sburb.assets);
  		Sburb.sprites[newFighter.name] = newFighter;
  		parseActions(curFighter,newFighter);
  	}
}

function parseRooms(input){
	var newRooms = input.getElementsByTagName("room");
  	for(var i=0;i<newRooms.length;i++){
  		var currRoom = newRooms[i];
			var newRoom = Sburb.parseRoom(currRoom, Sburb.assets, Sburb.sprites);
  		Sburb.rooms[newRoom.name] = newRoom;
  	}
}

function parseGameState(input) {
	var gameStates = input.getElementsByTagName("gameState");
	for(var i=0; i<gameStates.length; i++) {
		var gameState = gameStates[i];
		var children = gameState.childNodes;
		for(var j=0; j<children.length; j++) {
			var node = children[j];

			if(node.nodeType === 3) //Text node, formatting node
				continue;

			var key = node.tagName;
			var value = node.firstChild.nodeValue;
			Sburb.gameState[key] = value;
		}
	}
}

function parseActionQueues(input){
	var element=input.getElementsByTagName("actionQueues");
	if(element.length==0) {
		return;
	}
	var actionQueues = element[0].childNodes;
	for(var i=0;i<actionQueues.length;i++) {
		if(actionQueues[i].nodeName == "#text") {
			continue;
		}
		var actionQueue = Sburb.parseActionQueue(actionQueues[i]);
		Sburb.actionQueues.push(actionQueue);
	}
}

function parseState(input){
	var rootInfo = input.attributes;
  	
  	var char = rootInfo.getNamedItem("char");
  	if(char){
	  	Sburb.focus = Sburb.char = Sburb.sprites[char.value];
	  	Sburb.char.becomePlayer();
	}
  	
  	var mode = rootInfo.getNamedItem("mode");
  	if(mode){
  		Sburb.engineMode = mode.value;
  	}
  	
  	var scale = rootInfo.getNamedItem("scale");
  	if(scale){
  		Sburb.Stage.scaleX = Sburb.Stage.scaleY = parseInt(scale.value);
  	}
  	
  	var nextQueueId = rootInfo.getNamedItem("nextQueueId");
  	if(nextQueueId){
  		Sburb.nextQueueId = parseInt(nextQueueId.value);
  	}
  	
  	var curRoom = rootInfo.getNamedItem("curRoom");
  	if(curRoom){
  		Sburb.curRoom = Sburb.rooms[curRoom.value];
  		Sburb.curRoom.enter();
  	}else if(Sburb.curRoom==null && Sburb.char!=null){
  		for(var roomName in Sburb.rooms){
            if(!Sburb.rooms.hasOwnProperty(roomName)) continue;
  			var room = Sburb.rooms[roomName];
  			if(room.contains(Sburb.char)){
  				Sburb.curRoom = room;
  				Sburb.curRoom.enter();
  				break;
  			}
  		}
  	}
  	var bgm = rootInfo.getNamedItem("bgm");
  	if(bgm){
  		var params = bgm.value.split(",");
  		Sburb.changeBGM(new Sburb.BGM(Sburb.assets[params[0]],parseFloat(params.length>1?params[1]:"0")));
  	}
  	
  	var initAction;
    var initActionName;
    if(rootInfo.getNamedItem("startAction")){
    	initActionName = rootInfo.getNamedItem("startAction").value;
		for(var i=0; i<input.childNodes.length; i++) {
			var tmp = input.childNodes[i];
			if(tmp.tagName=="action" && tmp.attributes.getNamedItem("name").value == initActionName) {
				initAction = Sburb.parseAction(tmp);
				continue;
			}
		}
		if(initAction) {
			Sburb.performAction(initAction);
		}
    }
}

function parseHud(input){
	var hud = input.getElementsByTagName("hud");
	if(hud.length>0){
		var children = hud[0].childNodes;
		for(var i=0;i<children.length;i++){
			var child = children[i];

			if(child.nodeName == "spritebutton"){
				var name = child.attributes.getNamedItem("name").value;
  				Sburb.hud[name] = Sburb.buttons[name];
			}
		}
	}
	parseDialoger(input);
	parseDialogSprites(input);
}

function parseDialoger(input){
	var dialoger = input.getElementsByTagName("dialoger");
	if(dialoger.length>0){
		var dialogSpriteLeft = null;
		var dialogSpriteRight = null;
		if(Sburb.dialoger){
			dialogSpriteLeft = Sburb.dialoger.dialogSpriteLeft;
			dialogSpriteRight = Sburb.dialoger.dialogSpriteRight;
		}
		Sburb.dialoger = Sburb.parseDialoger(dialoger[0]);
		Sburb.dialoger.dialogSpriteLeft = dialogSpriteLeft;
		Sburb.dialoger.dialogSpriteRight = dialogSpriteRight;
	}
}

function serialLoadDialogSprites(dialogSprites,assetFolder){
	if(!Sburb.dialoger){
		Sburb.dialoger = {};
	}
	if(!Sburb.dialoger.dialogSpriteLeft){
		Sburb.dialoger.dialogSpriteLeft = new Sburb.Sprite("dialogSprite",-1000,Sburb.Stage.height,0,0);
		Sburb.dialoger.dialogSpriteRight = new Sburb.Sprite("dialogSprite",Sburb.Stage.width+1000,Sburb.Stage.height,0,0);
	}
	var animations = dialogSprites.getElementsByTagName("animation");
	for(var i=0;i<animations.length;i++){
		Sburb.dialoger.dialogSpriteLeft.addAnimation(Sburb.parseAnimation(animations[i],assetFolder));
		Sburb.dialoger.dialogSpriteRight.addAnimation(Sburb.parseAnimation(animations[i],assetFolder));
	}

}

function serialLoadEffects(effects,assetFolder,effectsFolder){
	var animations = effects.getElementsByTagName("animation");
	for(var i=0;i<animations.length;i++){
		var newEffect = Sburb.parseAnimation(animations[i],assetFolder);
		effectsFolder[newEffect.name] = newEffect;
	}
}

function serialLoadRoomSprites(newRoom, roomSprites, spriteFolder){
	for(var j=0;j<roomSprites.length;j++){
		var curSprite = roomSprites[j];
		var actualSprite = spriteFolder[curSprite.attributes.getNamedItem("name").value];
		newRoom.addSprite(actualSprite);
	  
	}
}

function serialLoadRoomPaths(newRoom, paths, assetFolder) {
	var walkables = paths[0].getElementsByTagName("walkable");
	for(var j=0;j<walkables.length;j++){
		var node = walkables[j];
		var attributes = node.attributes;
		newRoom.addWalkable(assetFolder[attributes.getNamedItem("path").value]);
	}
	
	var unwalkables = paths[0].getElementsByTagName("unwalkable");
	for(var j=0;j<unwalkables.length;j++){
		var node = unwalkables[j];
		var attributes = node.attributes;
		newRoom.addUnwalkable(assetFolder[attributes.getNamedItem("path").value]);
	}
	
	var motionPaths = paths[0].getElementsByTagName("motionpath");
	for(var j=0;j<motionPaths.length;j++) {
		var node = motionPaths[j];
		var attributes = node.attributes;
		newRoom.addMotionPath(assetFolder[attributes.getNamedItem("path").value], 
				      attributes.getNamedItem("xtox")?parseFloat(attributes.getNamedItem("xtox").value):1, 
				      attributes.getNamedItem("xtoy")?parseFloat(attributes.getNamedItem("xtoy").value):0, 
				      attributes.getNamedItem("ytox")?parseFloat(attributes.getNamedItem("ytox").value):0, 
				      attributes.getNamedItem("ytoy")?parseFloat(attributes.getNamedItem("ytoy").value):1, 
				      attributes.getNamedItem("dx")?parseFloat(attributes.getNamedItem("dx").value):0, 
				      attributes.getNamedItem("dy")?parseFloat(attributes.getNamedItem("dy").value):0);
	}
}

function serialLoadRoomTriggers(newRoom, triggers){
 	var candidates = triggers[0].childNodes;
	for(var i=0;i<candidates.length;i++){
		if(candidates[i].nodeName=="trigger"){
			newRoom.addTrigger(Sburb.parseTrigger(candidates[i]));
		}
	}
}

Sburb.serializeAttribute = function(base,val){
	var sub;
	return base[val]?" "+val+"='"+base[val]+"' ":"";
}

Sburb.serializeAttributes = function(base){
	str = "";
	for(var i=1;i<arguments.length;i++){
		str = str.concat(Sburb.serializeAttribute(base,arguments[i]));
	}
	return str;
}

Sburb.serialLoadRoomSprites = serialLoadRoomSprites;
Sburb.serialLoadRoomPaths = serialLoadRoomPaths;
Sburb.serialLoadRoomTriggers = serialLoadRoomTriggers;
Sburb.loadSerial = loadSerial;

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){





///////////////////////////////////
//Dialoger Class
///////////////////////////////////

//Constructor
Sburb.Dialoger = function(hiddenPos, alertPos, talkPosLeft, talkPosRight,
	spriteStartRight, spriteEndRight, spriteStartLeft, spriteEndLeft,
	alertTextDimensions, leftTextDimensions, rightTextDimensions, type){
	
	this.name="default";
	this.currentDialog = null;
	
	this.talking = false;
	this.queue = [];
	this.extraArgs = null;
	this.dialog = new Sburb.FontEngine();
	
	this.hiddenPos = hiddenPos;
	this.alertPos = alertPos;
	this.talkPosLeft = talkPosLeft;
	this.talkPosRight = talkPosRight;
	
	this.spriteStartRight = spriteStartRight;
	this.spriteEndRight = spriteEndRight;
	
	this.spriteStartLeft = spriteStartLeft;
	this.spriteEndLeft = spriteEndLeft;
	
	this.alertTextDimensions = alertTextDimensions;
	this.leftTextDimensions = leftTextDimensions;
	this.rightTextDimensions = rightTextDimensions;
	
	this.pos = {x:hiddenPos.x,y:hiddenPos.y}
	
	this.actor = null;
	this.dialogSide = "Left";
	this.graphic = null;
	this.box = null;
	this.defaultBox = null;
	
	this.type = type;
	this.handleType();
	this.inPosition = false;
}

Sburb.Dialoger.prototype.dialogSpriteLeft = null;
Sburb.Dialoger.prototype.dialogSpriteRight = null;

//handle the dialoger type
Sburb.Dialoger.prototype.handleType = function(){
	if(this.type == "social"){
		this.hashes = new Sburb.FontEngine();
		this.hashes.setFormatted(false);
		
		this.choices = {};
	}
}

//nudge the dialoger forward
Sburb.Dialoger.prototype.nudge = function(){
	if(this.inPosition){
		if(this.dialog.isShowingAll()){
			if(this.dialog.nextBatch()){
				this.dialog.showSubText(0,1);
			}else{
				if(this.queue.length>0){
					this.nextDialog();
				}else{
					this.talking = false;
				}
			}
		}else{
			this.dialog.showAll();
		}
	}
}

Sburb.Dialoger.prototype.skipAll = function(){
	this.talking = false; 
}

//start the provided dialog
Sburb.Dialoger.prototype.startDialog = function(info){
	this.inPosition = false;
	this.actor = null;
	this.currentDialog = info;
	this.queue = info.split("@");
	for(var i=this.queue.length-2;i>=0;i--){
		var line = this.queue[i];
		var escapeCount = 0;
		var index = line.length-1;
		while(index>=0 && line.charAt(index)=="/"){
			escapeCount++;
			index--;
		}
		if(escapeCount%2==1){
			this.queue[i] += "@"+this.queue[i+1];
			this.queue.splice(i+1,1);
		}
	}
	
	if(this.type=="social"){
		this.hashes.setText("");
	}
	
	this.queue.reverse();
	this.queue.pop();
	this.nextDialog();
	
	if(this.type=="social"){
		Sburb.buttons.spadeButton.startAnimation("state0");
		Sburb.buttons.heartButton.startAnimation("state0");
		if(this.actor && !this.choices[this.currentDialog]){
			this.choices[this.currentDialog] = 0;
		}else{
			if(this.choices[this.currentDialog]==1){
				Sburb.buttons.heartButton.startAnimation("state1");
			}else{
				Sburb.buttons.spadeButton.startAnimation("state1");
			}
		}
	}
	
	this.box.x=-this.box.width;
	this.talking = true;
	
}

//start the next dialog
Sburb.Dialoger.prototype.nextDialog = function(){
	
	var nextDialog = this.queue.pop().trim();
	this.dialog.setText(nextDialog);
	this.dialog.showSubText(0,0);
	var prefix = nextDialog.split(" ",1)[0];
	if(prefix.indexOf("~")>=0){
		var firstIndex = prefix.indexOf("~");
		var lastIndex = prefix.length;
		var ampIndex = prefix.indexOf("%");
		if(ampIndex>firstIndex){
			lastIndex = ampIndex;
		}
		var colIndex = prefix.indexOf(":");
		if(colIndex>=0 && colIndex<lastIndex){
			lastIndex = colIndex;
		}
		var resource = prefix.substring(firstIndex+1,lastIndex);	
		prefix = prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);	
		this.graphic = Sburb.sprites[resource];
		if(!this.graphic){
			var img = Sburb.assets[resource];
			this.graphic = new Sburb.Sprite();
			this.graphic.addAnimation(new Sburb.Animation("image",img,0,0,img.width,img.height,0,1,1));
			this.graphic.startAnimation("image");
		}
	}else{
		this.graphic = null;
	}
	
	if(prefix.indexOf("%")>=0){
		var firstIndex = prefix.indexOf("%");
		var lastIndex = prefix.length;

		var colIndex = prefix.indexOf(":");
		if(colIndex>=0 && colIndex<lastIndex){
			lastIndex = colIndex;
		}
		var resource = prefix.substring(firstIndex+1,lastIndex);	
		prefix = prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);
			
		this.setBox(resource);
	}else{
		this.box = this.defaultBox;
	}
	
	if(prefix.indexOf(":")>=0){
		var firstIndex = prefix.indexOf(":");
		var lastIndex = prefix.length;

		var resource = prefix.substring(firstIndex+1,lastIndex);	
		prefix = prefix.substring(0,firstIndex)+prefix.substring(lastIndex,prefix.length);	
		
		this.extraArgs = resource;
		if(this.type=="social"){
			this.hashes.setText(this.extraArgs.replace(/#/g," #").replace(/-/g," ").trim());
			
		}
	}else{
		this.extraArgs = null;
		if(this.type=="social"){
			this.hashes.setText("");
		}
	}
	
	
	if(prefix=="!"){
		this.actor = null;
		this.dialogSide = "Left";
	}else{
		var newActor;
		if(prefix.indexOf("_")>=0){
			newActor = prefix.substring(0,prefix.indexOf("_"));	
		}else{
			newActor = prefix.substring(0,2);
		}
		if(this.actor==null){
			this.dialogSide = "Left";
			var sprite = this.dialogOnSide(this.dialogSide);
			var desiredPos = this.startOnSide(this.oppositeSide(this.dialogSide));
			sprite.x = desiredPos.x;
			sprite.y = desiredPos.y;
		}else if(this.actor.indexOf(newActor)!=0 && newActor.indexOf(this.actor)!=0){
			this.dialogSide = this.oppositeSide(this.dialogSide);
			var sprite = this.dialogOnSide(this.dialogSide)
			var desiredPos = this.startOnSide(this.dialogSide);
			sprite.x = desiredPos.x;
			sprite.y = desiredPos.y;
			
		}
		this.actor = newActor;
		this.dialogOnSide(this.dialogSide).startAnimation(prefix);
	}
	
}

//get the string suffix for the opposite side to that is currently talking
Sburb.Dialoger.prototype.oppositeSide = function(side){
	if(side=="Left"){
		return "Right";
	}else{
		return "Left";
	}
}

//get the dialogSprite on the specified side
Sburb.Dialoger.prototype.dialogOnSide = function(side){
	return this["dialogSprite"+side];
}

//get the start position of a dialog on the specified side
Sburb.Dialoger.prototype.startOnSide = function(side){
	return this["spriteStart"+side];
}

//get the end position of a dialog on the specified side
Sburb.Dialoger.prototype.endOnSide = function(side){
	return this["spriteEnd"+side];
}

//move the specified sprite towards the specified location at the specified speed
Sburb.Dialoger.prototype.moveToward = function(sprite,pos,speed){
	if(typeof speed != "number"){
		speed = 100;
	} 
	if(Math.abs(sprite.x-pos.x)>speed){
		sprite.x+=speed*Math.abs(pos.x-sprite.x)/(pos.x-sprite.x);
	}else{
		sprite.x = pos.x;
	}
	
	if(Math.abs(sprite.y-pos.y)>speed){
		sprite.y+=speed*Math.abs(pos.y-sprite.y)/(pos.y-sprite.y);
	}else{
		sprite.y = pos.y;
	}
	return sprite.y == pos.y && sprite.x == pos.x;
}

//update the Dialoger one frame
Sburb.Dialoger.prototype.update = function(){
	if(this.type=="social"){
		var closeButton = Sburb.buttons.closeButton;
		var spadeButton = Sburb.buttons.spadeButton;
		var heartButton = Sburb.buttons.heartButton;
		var bubbleButton = Sburb.buttons.bubbleButton;
		var hashTagBar = Sburb.sprites.hashTagBar;
	}
	if(this.talking){
		var desiredPos;
		var ready = true;
		if(this.actor==null){
			desiredPos = this.alertPos;
			this.inPosition = true;
		}else{
			desiredPos = this["talkPos"+this.dialogSide];	
			ready = this.moveToward(this.dialogOnSide(this.dialogSide),this.endOnSide(this.dialogSide));
			this.moveToward(this.dialogOnSide(this.oppositeSide(this.dialogSide)),this.startOnSide(this.oppositeSide(this.dialogSide)));
		}
		var init = false;
		if(this.moveToward(this.pos,desiredPos,110) && ready){
			
			if(this.dialog.start==this.dialog.end){
				this.inPosition = true;
				var dialogDimensions = this.decideDialogDimensions();
				this.dialog.setDimensions(dialogDimensions.x,dialogDimensions.y,dialogDimensions.width,dialogDimensions.height);
				init = true;
			}
			this.dialog.showSubText(null,this.dialog.end+2);
			if(this.actor){
				this.dialogOnSide(this.dialogSide).update();
			}
			if(this.type=="social"){
				
				if(this.queue.length==0){
					if(this.actor!=null){
						spadeButton.update();
						heartButton.update();
						bubbleButton.update();
					}
				}else{
					closeButton.update();
				}
				hashTagBar.update();
			}
		}else{
			this.inPosition = false;
		}
		
		if(this.graphic){
			this.graphic.x = this.pos.x;
			this.graphic.y = this.pos.y;
			this.graphic.update();
		}
		
	}else {
		this.graphic = null;
		this.moveToward(this.pos,this.hiddenPos,120);

		if(this.actor!=null){
			if(this.moveToward(this.dialogOnSide(this.dialogSide),this.startOnSide(this.oppositeSide(this.dialogSide)))){
				var pos1 = this.startOnSide(this.dialogSide);
				var sprite1 = this.dialogOnSide(this.dialogSide);
				sprite1.x = pos1.x;
				sprite1.y = pos1.y;
				var pos2 = this.startOnSide(this.oppositeSide(this.dialogSide));
				var sprite2 = this.dialogOnSide(this.oppositeSide(this.dialogSide));
				sprite2.x = pos2.x;
				sprite2.y = pos2.y;
				this.actor = null;
			}
		}
	}
	this.box.x = this.pos.x;
	this.box.y = this.pos.y;
	if(this.type=="social"){
		hashTagBar.x = this.pos.x;
		hashTagBar.y = this.pos.y+this.box.height;
		if(this.dialogSide=="Right"){
			spadeButton.x = hashTagBar.x+20;
			heartButton.x = hashTagBar.x+60;
			bubbleButton.x = hashTagBar.x+100;
		}else{
			spadeButton.x = hashTagBar.x+hashTagBar.animation.colSize-120;
			heartButton.x = hashTagBar.x+hashTagBar.animation.colSize-80;
			bubbleButton.x = hashTagBar.x+hashTagBar.animation.colSize-40;		
		}
		spadeButton.y = hashTagBar.y+15;
		heartButton.y = hashTagBar.y+15;
		bubbleButton.y = hashTagBar.y+15;
		
			if(this.actor){
				if(Sburb.buttons.spadeButton.animation.name=="state1"){
					this.choices[this.currentDialog] = -1;
				}else if(Sburb.buttons.heartButton.animation.name=="state1"){
					this.choices[this.currentDialog] = 1;
				}else{
					this.choices[this.currentDialog] = 0;
				}
			}
		
		if(init){
			if(this.dialogSide=="Right"){
				this.hashes.setDimensions(this.dialog.x,hashTagBar.y+13, 
					this.dialog.width, hashTagBar.animation.rowSize-10);
			}else{
				this.hashes.setDimensions(this.dialog.x,hashTagBar.y+13, 
					this.dialog.width, hashTagBar.animation.rowSize-10);
			}
		}
		if(this.dialog.isShowingAll() && this.dialog.onLastBatch()){
			this.hashes.showAll();
		}else{
			this.hashes.showSubText(0,0);
		}
	}
	
	this.box.update();
}

//get what the dimensions of the dialog should be
Sburb.Dialoger.prototype.decideDialogDimensions = function(){
	if(this.actor==null){
		return {x:this.pos.x+this.alertTextDimensions.x,
				y:this.pos.y+this.alertTextDimensions.y,
				width:this.alertTextDimensions.width,
				height:this.alertTextDimensions.height};
	}else if(this.dialogSide=="Left"){
		return {x:this.pos.x+this.leftTextDimensions.x,
				y:this.pos.y+this.leftTextDimensions.y,
				width:this.leftTextDimensions.width,
				height:this.leftTextDimensions.height};
	}else{
		return {x:this.pos.x+this.rightTextDimensions.x,
				y:this.pos.y+this.rightTextDimensions.y,
				width:this.rightTextDimensions.width,
				height:this.rightTextDimensions.height};
	}
}

//set the dialog box graphic
Sburb.Dialoger.prototype.setBox = function(box){
	var dialogBox = Sburb.sprites[box];
	if(!dialogBox){
		var boxAsset = Sburb.assets[box];

		dialogBox = new Sburb.Sprite("dialogBox",Sburb.Stage.width+1,1000,boxAsset.width,boxAsset.height, null,null,0);
			dialogBox.addAnimation(new Sburb.Animation("image",boxAsset,0,0,boxAsset.width,boxAsset.height,0,1,1));
		dialogBox.startAnimation("image");
	}
	if(!this.box){
		this.defaultBox = dialogBox;
	}else{
		dialogBox.x = this.box.x;
		dialogBox.y = this.box.y;
	}
	this.box = dialogBox;
}

//draw the dialog box
Sburb.Dialoger.prototype.draw = function(){
	if(this.type=="social"){
		Sburb.sprites.hashTagBar.draw();
		
	}
	this.box.draw();
	if(this.graphic){
		this.graphic.draw();
	}
	if(this.talking){
		this.dialog.draw();
		if(this.type=="social"){
			if(this.queue.length>0){
				Sburb.buttons.closeButton.draw();
			}
			if(this.dialog.start!=this.dialog.end){
				this.hashes.draw();
				if(this.queue.length==0 && this.actor!=null){
					Sburb.buttons.spadeButton.draw();
					Sburb.buttons.heartButton.draw();
					Sburb.buttons.bubbleButton.draw();
				}
			}
		}
	}
	if(this.actor!=null){
		this.dialogSpriteLeft.draw();
		if(this.dialogSpriteRight.animation){
			this.dialogSpriteRight.animation.flipX=true;
		}
		this.dialogSpriteRight.draw();
	}
}

Sburb.parseDialoger = function(dialoger){
	var attributes = dialoger.attributes;
	
	var hiddenPos = parseDimensions(attributes.getNamedItem("hiddenPos").value);
	var alertPos = parseDimensions(attributes.getNamedItem("alertPos").value);
	var talkPosLeft = parseDimensions(attributes.getNamedItem("talkPosLeft").value);
	var talkPosRight = parseDimensions(attributes.getNamedItem("talkPosRight").value);
	var spriteStartRight = parseDimensions(attributes.getNamedItem("spriteStartRight").value);
	var spriteEndRight = parseDimensions(attributes.getNamedItem("spriteEndRight").value);
	var spriteStartLeft = parseDimensions(attributes.getNamedItem("spriteStartLeft").value);
	var spriteEndLeft = parseDimensions(attributes.getNamedItem("spriteEndLeft").value);
	var alertTextDimensions = parseDimensions(attributes.getNamedItem("alertTextDimensions").value);
	var leftTextDimensions = parseDimensions(attributes.getNamedItem("leftTextDimensions").value);
	var rightTextDimensions = parseDimensions(attributes.getNamedItem("rightTextDimensions").value);
	var type = attributes.getNamedItem("type")?attributes.getNamedItem("type").value:"standard";
	
	var newDialoger = new Sburb.Dialoger(hiddenPos, alertPos, talkPosLeft, talkPosRight,
		spriteStartRight, spriteEndRight, spriteStartLeft, spriteEndLeft,
		alertTextDimensions, leftTextDimensions, rightTextDimensions,type);
	
	var box = attributes.getNamedItem("box").value;
  	newDialoger.setBox(box);

  	return newDialoger;
  	
}

Sburb.Dialoger.prototype.serialize = function(input){
	input+="\n<dialoger "+ serializeDimensions(this,"hiddenPos", "alertPos", "talkPosLeft", "talkPosRight",
		"spriteStartRight", "spriteEndRight", "spriteStartLeft", "spriteEndLeft",
		"alertTextDimensions", "leftTextDimensions", "rightTextDimensions");
	input+= Sburb.serializeAttribute(this,"type");
	input+="box='"+this.box.animation.sheet.name+"' ";
	input+=">";
	input+="</dialoger>";
	return input;
}

function serializeDimensions(base){
	str = "";
	for(var i=1;i<arguments.length;i++){
		str = str.concat(serializeDimension(base,arguments[i]));
	}
	return str;
}

function serializeDimension(base,val){	
	var dim = base[val];
	var sub = " "+val+"='";
	sub+=(dim.hasOwnProperty("x"))?dim.x+",":"";
	sub+=(dim.hasOwnProperty("y"))?dim.y+",":"";
	sub+=(dim.hasOwnProperty("width"))?dim.width+",":"";
	sub+=(dim.hasOwnProperty("height"))?dim.height+",":"";
	sub = sub.substring(0,sub.length-1);
	sub += "' ";
	return sub;
}

function parseDimensions(input){
	var values = input.split(",");
	var dimensions = {};
	switch(values.length){
		case 4:
			dimensions.height = parseInt(values[3]);
		case 3:
			dimensions.width = parseInt(values[2]);
		case 2:
			dimensions.y = parseInt(values[1]);
		case 1:
			dimensions.x = parseInt(values[0]);
	}
	return dimensions;
}

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




///////////////////////////////////////
//Chooser Class
///////////////////////////////////////

//constructor
Sburb.Chooser = function(){
	this.choosing = false;
	this.choices = [];
	this.choice = 0;
	this.dialogs = [];
	this.time = 0;
}

Sburb.Chooser.prototype.minWidth = 160;

//go to the next choice
Sburb.Chooser.prototype.nextChoice = function(){
	this.choice = (this.choice+1)%this.choices.length;
}

//go to the previous choice
Sburb.Chooser.prototype.prevChoice = function(){
	this.choice = (this.choice-1+this.choices.length)%this.choices.length;
}

//initialize chooser
Sburb.Chooser.prototype.beginChoosing = function(x,y){
	var width = this.minWidth;
	var height = 0;
	var basis = new Sburb.FontEngine();
	for(i=0;i<this.choices.length;i++){
		width = Math.max(width,(this.choices[i].name.length+3)*basis.charWidth+10);
	}
	height = basis.lineHeight*this.choices.length+10;
	
	if(x<Sburb.Stage.x+10){
		x = Sburb.Stage.x+10;
	}
	if(y<Sburb.Stage.y+10){
		y = Sburb.Stage.y+10;
	}
	if(x+width>Sburb.Stage.x+Sburb.Stage.width-10){
		x = Sburb.Stage.x+Sburb.Stage.width-width-10;
	}
	if(y+height>Sburb.Stage.y+Sburb.Stage.height-10){
		y = Sburb.Stage.y+Sburb.Stage.height-height-10;
	}
	
	
	this.choosing = true;
	this.choice = 0;
	this.dialogs = [];
	for(var i=0;i<this.choices.length;i++){
		var curEngine = new Sburb.FontEngine(" > "+this.choices[i].name);
		curEngine.showSubText(0,1);
		curEngine.setDimensions(x,y+i*curEngine.lineHeight);
		this.dialogs.push(curEngine);
	}
}

//draw the chooser
Sburb.Chooser.prototype.draw = function(){
	if(this.choosing){
		Sburb.stage.save();
		var x,y,width=this.minWidth,height=0,i;
		x = this.dialogs[0].x;
		y = this.dialogs[0].y-1;
		for(i=0;i<this.dialogs.length;i++){
			width = Math.max(width,this.dialogs[i].lines[0].length*this.dialogs[i].charWidth+10);
		}
		height = this.dialogs[0].lineHeight*this.dialogs.length;
		Sburb.stage.fillStyle = "#ff9900";
		Sburb.stage.fillRect(x-6,y-6,width+12,height+13);
		Sburb.stage.fillStyle = "#ffff00";
		Sburb.stage.fillRect(x-2,y-2,width+4,height+5);
		Sburb.stage.fillStyle = "#000000";
		Sburb.stage.fillRect(x,y,width,height);
		for(i=0;i<this.dialogs.length;i++){
			this.dialogs[i].draw();
		}
		Sburb.stage.restore();
	}
}

//update the chooser one frame
Sburb.Chooser.prototype.update = function(){
	if(this.choosing){
		this.time++;
		for(var i=0;i<this.dialogs.length;i++){
			var curDialog = this.dialogs[i];
			curDialog.showSubText(null,curDialog.end+1);
			if(i==this.choice){
				if(this.time%Sburb.Stage.fps<Sburb.Stage.fps/2){
					curDialog.start = 2;
				}else{
					curDialog.start = 0;
				}
				curDialog.color = "#cccccc";	
			}else{
				curDialog.start = 0;
				curDialog.color = "#ffffff";
			}
		}
	}
}



return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){

Sburb.globalVolume = 1;




///////////////////////////////////////
//Sound Class
///////////////////////////////////////

//Constructor
Sburb.Sound = function(asset){
	if (asset) {
		this.asset = asset;
		var that = this;
		window.addEventListener('beforeunload', function() {
			that.pause();
		});
	}
}

//play this sound
Sburb.Sound.prototype.play = function(pos) {
    if(window.chrome) {
	if(this.playedOnce) {
	    // console.log("load again");
            this.asset.load();
	} else {
	    this.playedOnce = true;
	}
        if(pos) {
            // chrome doesnt like us changing the play time
            // unless we're already playing
            var oThis = this;
            this.asset.addEventListener('playing', function() {
                oThis.asset.currentTime = pos;
                oThis.asset.pause();
                oThis.asset.removeEventListener('playing', arguments.callee);
                oThis.asset.play();
            },false);
        }
    } else if(pos) {
        this.asset.currentTime = pos; 
    }
	this.fixVolume();
	this.asset.play();	
}

//pause this sound
Sburb.Sound.prototype.pause = function() {
	this.asset.pause();
	//console.log("pausing the sound...");
}

//stop this sound
Sburb.Sound.prototype.stop = function() {
	this.pause();
	this.asset.currentTime = 0;
	//console.log("stopping the sound...");
}

//has the sound stopped
Sburb.Sound.prototype.ended = function() {
	return this.asset.ended;
}

//ensure the sound is playing at the global volume
Sburb.Sound.prototype.fixVolume = function(){
	this.asset.volume = Sburb.globalVolume;
	//console.log("fixing the volume...");
}





/////////////////////////////////////
//BGM Class (inherits Sound)
/////////////////////////////////////

//constructor
Sburb.BGM = function(asset, startLoop, priority) {
    Sburb.Sound.call(this,asset);
    this.startLoop = 0;
    this.endLoop = 0;
    
    this.setLoopPoints(startLoop?startLoop:0); 
}

Sburb.BGM.prototype = new Sburb.Sound();

//set the points in the sound to loop
Sburb.BGM.prototype.setLoopPoints = function(start, end) {
	tmpAsset = this.asset
	tmpAsset.addEventListener('ended', function() {
	//	console.log("I'm loopin' as hard as I can cap'n! (via event listener)");
		tmpAsset.currentTime = start;
		tmpAsset.play();
	},false);
	this.startLoop = start;
	this.endLoop = end;
	// do we need to have an end point? does that even make sense
}

//loop the sound
Sburb.BGM.prototype.loop = function() {
	//	console.log("looping...");
		this.play(this.startLoop);
}



return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){




////////////////////////////////////////////
//AssetManager Class
////////////////////////////////////////////

//Constructor
Sburb.AssetManager = function() {
    // Loop tracking
    this.loopID = false;
    this.space = false;
    this.refresh = false;
    // Asset tracking
    this.totalAssets = 0; // Used in calculation of "Are we done yet?"
    this.totalLoaded = 0; // Used in calculation of "Are we done yet?"
    this.totalMeta = 0; // Used in calculation of "Are we done yet?"
    this.totalSize = 0;   // Used in progress bar
    this.loadedSize = 0;  // Used in progress bar
    this.assets = {};
    this.loaded = {};
    this.recurrences = {};
    this.error = [];
    this.failed = [];
    this.maxAjax = 10; // How many concurrent ajax calls we can have
    this.ajaxRunning = 0;
    this.ajaxCache = []; // Store those suckers
    // Cache urls
    this.cache = {}
    this.blobs = {}
    // Descriptors
    this.description = "";
    this.resourcePath = "";
    this.levelPath = "";
    this.mimes = {
        "jpg": "image/jpeg",
        "gif": "image/gif",
        "png": "image/png",
        "svg": "image/svg+xml",
        "mp3": "audio/mpeg",
        "oga": "audio/ogg",
        "ogg": "audio/ogg",
        "ttf": "application/x-font-ttf",
        "woff": "application/x-font-woff",
        "swf": "application/x-shockwave-flash",
        "flv": "application/x-shockwave-flash"
    };
}

Sburb.AssetManager.prototype.start = function() {
    this.stop();
    this.loopID = setInterval(function() { Sburb.assetManager.loop(); }, 33);
}

Sburb.AssetManager.prototype.stop = function() {
    if(this.loopID) {
        clearInterval(this.loopID);
        this.loopID = false;
    }
}

Sburb.AssetManager.prototype.loop = function() {
    if(Sburb.pressed[Sburb.Keys.space] && !this.space) {
        this.space = true;
        this.refresh = true;
    } else {
        this.refresh = false;
    }
    if(!Sburb.pressed[Sburb.Keys.space])
        this.space = false;
    
    Sburb.debugger.handleInputs(Sburb.pressed);
    this.draw();
    Sburb.debugger.draw();
}

Sburb.AssetManager.prototype.resolvePath = function(path){
    if(path.indexOf(this.resourcePath)==-1){
        return this.resourcePath+"/"+path+"?"+Sburb.version;
    }else{
        return path+"?"+Sburb.version; // Only cache resources of the same version
    }
}

//get the remaining assets to be loaded
Sburb.AssetManager.prototype.totalAssetsRemaining = function() {
    return this.totalAssets - this.totalLoaded;
}

//have all the assets been loaded
Sburb.AssetManager.prototype.finishedLoading = function() {
    return (this.totalAssets && (this.totalAssets == this.totalLoaded));
}

Sburb.AssetManager.prototype.draw = function(){
    Sburb.stage.fillStyle = "rgb(0,0,0)";
    Sburb.stage.fillRect(-3,-3,Sburb.Stage.width+6,Sburb.Stage.height+6);
    if(this.loaded["preloaderBG"]){
        var preloaderBG = Sburb.assets["preloaderBG"];
        Sburb.stage.drawImage(preloaderBG,0,0,preloaderBG.width,preloaderBG.height,0,0,preloaderBG.width,preloaderBG.height);
    }
    Sburb.stage.fillStyle = "rgb(255,255,255)"
    Sburb.stage.font="10px Verdana";
    Sburb.stage.textAlign = "center";
  //Sburb.stage.fillText("Loading "+this.description,Stage.width/2,Stage.height-80);
  var percent = 0;
  if(this.totalSize && this.totalMeta >= this.totalAssets){
      percent =Math.floor((this.loadedSize/this.totalSize)*100);
  } else {
      percent = Math.floor((this.totalLoaded/this.totalAssets)*100);
  }
  Sburb.stage.fillText(percent+"%",Sburb.Stage.width/2,Sburb.Stage.height-50);
  if(Sburb.tests.loading == 0) {
      // Warn the user that we have no clue what's going on
      Sburb.stage.fillText("Warning: File loading is unreliable. Use a newer browser, like Chrome.",Sburb.Stage.width/2,Sburb.Stage.height-35);
  }
  if(this.error.length) {
      Sburb.stage.textAlign = "left";
      for(var i = 0; i < this.error.length; i++)
          Sburb.stage.fillText("Error: "+this.error[i],10,20+15*i);
      Sburb.stage.textAlign = "center";
      if(this.failed.length) {
          if(this.refresh) {
              this.error = ["Refreshing..."];
              for(var i=0; i<this.failed.length;i++)
                this.assets[this.failed[i]].reload();
              this.failed = [];
          } else {
              Sburb.stage.font="18px Verdana";
              Sburb.stage.fillText("Press SPACE to reload failed assets",Sburb.Stage.width/2,Sburb.Stage.height-70);
          }
      }
  }
}

//check if a specific asset has been loaded
Sburb.AssetManager.prototype.isLoaded = function(name) {
    // turn undefined into false
    return this.loaded[name] ? true : false;
}

//reset the asset manager to have no assets
Sburb.AssetManager.prototype.purge = function() {
    for(var k in this.recurrences) {
        if(this.recurrences.hasOwnProperty(k))
            clearTimeout(this.recurrences[k]);
    }
    this.totalLoaded = 0;
    this.totalAssets = 0;
    this.totalMeta = 0;
    this.totalSize = 0;
    this.loadedSize = 0;
    this.assets = {}
    this.loaded = {}
    this.recurrences = {};
    this.error = [];
    this.failed = [];
}

//load the given asset
Sburb.AssetManager.prototype.loadAsset = function(assetObj) {
    var name = assetObj.name;
    this.assets[name] = assetObj;
    if(assetObj.instant) {
        this.loaded[name] = true;
        return;
    }

    var oThis = this;
    this.assetAdded(name);
    var loadedAsset = this.assets[name].assetOnLoadFunction(function() { oThis.assetLoaded(name); });
    if(!loadedAsset)
        this.assets[name].assetOnFailFunction(function() { oThis.assetFailed(name); });
}

//log that the asset was added
Sburb.AssetManager.prototype.assetAdded = function(name) {
    this.totalAssets++;
    this.loaded[name] = false;
}

//log that the asset was loaded
Sburb.AssetManager.prototype.assetLoaded = function(name){
    if(this.assets[name]){
        if(!this.loaded[name]){
            this.loaded[name] = true
            this.totalLoaded++;
            
            if(this.finishedLoading() && Sburb._hardcode_load){
                // only really here to work for old hard-loading
                Sburb.finishInit();
                initFinished = true;
                
            }
        }
    }
};

Sburb.AssetManager.prototype.assetFailed = function(name) {
    var msg = name + " failed to load"
    console.log(msg);
    this.error.push(msg);
    this.failed.push(name);
};




////////////////////////////////////////////
//Related Utility functions
////////////////////////////////////////////

// Converts an ArrayBuffer directly to base64, without any intermediate 'convert to string then
// use window.btoa' step. According to my tests, this appears to be a faster approach:
// http://jsperf.com/encoding-xhr-image-data/5
Sburb.base64ArrayBuffer = function(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new window[Sburb.prefixed("Uint8Array",window,false)](arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]
    
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
    
    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}

Sburb.loadGenericAsset = function(asset, path, id) {
    var assetPath = Sburb.assetManager.resolvePath(path);
    var ext = path.substring(path.indexOf(".")+1,path.length);
    var type = Sburb.assetManager.mimes[ext];
    
    // We've loaded this before, don't bother loading it again
    if(assetPath in Sburb.assetManager.blobs) {
        var URLCreator = window[Sburb.prefixed("URL",window,false)];
        var blob = Sburb.assetManager.blobs[assetPath];
        var url = false;
        if(Sburb.tests.blobrevoke) {
            url = URLCreator.createObjectURL(blob, {autoRevoke: false});
        } else {
            url = URLCreator.createObjectURL(blob); // I hope this doesn't expire...
        }
        setTimeout(function() { asset.success(url, id); }, 0); // Async call success so things don't blow up
        return;
    }
    if(assetPath in Sburb.assetManager.cache) {
        var url = Sburb.assetManager.cache[assetPath];
        setTimeout(function() { asset.success(url, id); }, 0); // Async call success so things don't blow up
        return;
    }
    
    // Hold on, can't load too many at once
    if(Sburb.assetManager.ajaxRunning >= Sburb.assetManager.maxAjax) {
        Sburb.assetManager.ajaxCache.push([asset, path, id]);
        return;
    } else {
        Sburb.assetManager.ajaxRunning += 1;
    }
    
    var cleanup = function() {
        Sburb.assetManager.ajaxRunning -= 1;
        if(Sburb.assetManager.ajaxCache.length) {
            args = Sburb.assetManager.ajaxCache.shift();
            Sburb.loadGenericAsset(args[0], args[1], args[2]);
        }
    };
    
    // Welcome to fallback hell
    // NOTE: We use array.contains because future fallbacks will just get a higher number
    //       Hence inequalities won't work and multiple == would get messy fast
    if([4,5,6,7,8,9,10,11].contains(Sburb.tests.loading)) {
        // XHR2 supported, we're going to have a good day
        var xhr = new XMLHttpRequest();
        xhr.total = 0;
        xhr.loaded = 0;
        xhr.open('GET', assetPath, true);
        if([8,9,10,11].contains(Sburb.tests.loading)) {
            xhr.responseType = 'blob';
        } else {
            xhr.responseType = 'arraybuffer';
        }
        xhr.onprogress = function(e) {
            if(e.lengthComputable) {
                if(!xhr.total) {
                    Sburb.assetManager.totalMeta++;
                    Sburb.assetManager.totalSize += e.total;
                    xhr.total = e.total;
                }
                var diff = e.loaded - xhr.loaded;
                xhr.loaded = e.loaded;
                Sburb.assetManager.loadedSize += diff;
            } else {
                console.log("ERROR: Length not computable for " + path);
            }
        }
        xhr.onload = function() {
            if((this.status == 200 || this.status == 0) && this.response) {
                // First, let the loader know we're done
                var diff = xhr.total - xhr.loaded;
                xhr.loaded = xhr.total;
                Sburb.assetManager.loadedSize += diff;
                // Now make a URL out of the asset
                var url = false;
                if([5,6,7,9,10,11].contains(Sburb.tests.loading)) {
                    var URLCreator = window[Sburb.prefixed("URL",window,false)];
                    var blob = false;
                    if(Sburb.tests.loading == 11) {
                        blob = new Blob([this.response],{type: type});
                    } else if([5,10].contains(Sburb.tests.loading)) {
                        var builder = new window[Sburb.prefixed("BlobBuilder",window,false)]();
                        builder.append(this.response);
                        blob = builder.getBlob(type);
                    } else if(Sburb.tests.loading == 9) {
                        blob = this.response[Sburb.prefixed("slice",Blob.prototype,false)](0,this.response.size,type);
                    } else if(Sburb.tests.loading == 7) {
                        var dataview = new Uint8Array(this.response);
                        blob = new Blob([dataview],{type: type});
                    } else if(Sburb.tests.loading == 6) {
                        blob = new Blob([this.response],{type: type});
                    } // No else, this covers all the methods in this block
                    if(!blob) {
                        asset.failure(id);
                        cleanup();
                        return; // Uh what happened here?
                    }
                    if(Sburb.tests.blobrevoke) {
                        url = URLCreator.createObjectURL(blob, {autoRevoke: false});
                    } else {
                        url = URLCreator.createObjectURL(blob); // I hope this doesn't expire...
                    }
                    Sburb.assetManager.blobs[assetPath] = blob; // Save for later
                } else if(Sburb.tests.loading == 8) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var url = e.target.result;
                        if(!url) {
                            asset.failure(id);
                            cleanup();
                            return;
                        }
                        // TODO: Replace mime-type with actual type
                        // TODO: Verify this is base64 encoded
                        Sburb.assetManager.cache[assetPath] = url;
                        asset.success(url,id);
                        cleanup();
                    }
                    reader.onabort = function() { asset.failure(id); };
                    reader.onerror = function() { asset.failure(id); };
                    reader.readAsDataURL(this.response);
                    return; // Async inception
                } else if(Sburb.tests.loading == 4) {
                    var b64 = Sburb.base64ArrayBuffer(this.response);
                    url = "data:"+type+";base64,"+b64;
                } // No else, this covers all the methods in this block
                if(!url) {
                    asset.failure(id);
                    cleanup();
                    return; // Uh what happened here?
                }
                Sburb.assetManager.cache[assetPath] = url; // Save for later
                asset.success(url,id);
                cleanup();
            } else {
                asset.failure(id);
                cleanup();
            }
        }
        xhr.onabort = function() { asset.failure(id); cleanup(); };
        xhr.onerror = function() { asset.failure(id); cleanup(); };
        xhr.send();
    } else if([1,2,3].contains(Sburb.tests.loading)) {
        // XHR 1, not bad
        var xhr = new XMLHttpRequest();
        xhr.open('GET', assetPath, true);
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.onload = function() {
            if((this.status == 200 || this.status == 0) && this.responseText) {
                var url = false;
                if([2,3].contains(Sburb.tests.loading)) {
                    // Convert response to ArrayBuffer (But why though :( )
                    var binstr = this.responseText;
                    var len = binstr.length;
                    var bytes = new Uint8Array(len);
                    for(var i = 0; i < len; i += 1) {
                        bytes[i] = binstr.charCodeAt(i) & 0xFF;
                    }
                    var URLCreator = window[Sburb.prefixed("URL",window,false)];
                    var blob = false;
                    if(Sburb.tests.loading == 3) {
                        blob = new Blob([bytes],{type: type});
                    } else if(Sburb.tests.loading == 2) {
                        var builder = new window[Sburb.prefixed("BlobBuilder",window,false)]();
                        builder.append(bytes.buffer);
                        blob = builder.getBlob(type);
                    } // No else, this covers all the methods in this block
                    if(!blob) {
                        asset.failure(id);
                        cleanup();
                        return; // Uh what happened here?
                    }
                    if(Sburb.tests.blobrevoke) {
                        url = URLCreator.createObjectURL(blob, {autoRevoke: false});
                    } else {
                        url = URLCreator.createObjectURL(blob); // I hope this doesn't expire...
                    }
                    Sburb.assetManager.blobs[assetPath] = blob; // Save for later
                } else if(Sburb.tests.loading == 1) {
                    // Clean the string
                    var binstr = this.responseText;
                    var len = binstr.length;
                    var bytes = new Array(len);
                    for(var i = 0; i < len; i += 1) {
                        bytes[i] = binstr.charCodeAt(i) & 0xFF;
                    }
                    binstr = '';
                    // Don't break the stack - Thanks MDN!
                    var QUANTUM = 65000;
                    for(var i = 0; i < len; i += QUANTUM) {
                        binstr += String.fromCharCode.apply(null, bytes.slice(i, Math.min(i + QUANTUM, len)));
                    }
                    var b64 = window.btoa(binstr);
                    url = "data:"+type+";base64,"+b64;
                } // No else, this covers all the methods in this block
                if(!url) {
                    asset.failure(id);
                    cleanup();
                    return; // Uh what happened here?
                }
                Sburb.assetManager.cache[assetPath] = url; // Save for later
                asset.success(url,id);
                cleanup();
            } else {
                asset.failure(id);
                cleanup();
            }
        }
        xhr.onabort = function() { asset.failure(id); cleanup(); };
        xhr.onerror = function() { asset.failure(id); cleanup(); };
        xhr.send();
    } else if(Sburb.tests.loading == 12) {
        // IE 9 specific BS - May not work but I don't care
        var xhr = new XMLHttpRequest();
        xhr.open('GET', assetPath, true);
        xhr.onload = function() {
            if((this.status == 200 || this.status == 0) && this.responseText) { // Checking responseBody directly doesn't work??
                // Clean the string
                var bytes = new VBArray(this.responseBody).toArray();
                var len = bytes.length;
                var binstr = '';
                // Don't break the stack - Thanks MDN!
                var QUANTUM = 65000;
                for(var i = 0; i < len; i += QUANTUM) {
                    binstr += String.fromCharCode.apply(null, bytes.slice(i, Math.min(i + QUANTUM, len)));
                }
                var b64 = window.btoa(binstr);
                var url = "data:"+type+";base64,"+b64;
                Sburb.assetManager.cache[assetPath] = url; // Save for later
                asset.success(url,id);
                cleanup();
            } else {
                asset.failure(id);
                cleanup();
            }
        }
        xhr.onabort = function() { asset.failure(id); cleanup(); };
        xhr.onerror = function() { asset.failure(id); cleanup(); };
        xhr.send();
    } else if(Sburb.tests.loading == 0) {
        // DANGER DANGER we can't track anything! PANIC!!!
        Sburb.assetManager.cache[assetPath] = assetPath; // Save for later
        asset.success(assetPath,id,true);
        cleanup();
    } else {
        // Somebody added another fallback without editting this function. Yell at them.
        console.error("Invalid Sburb.tests.loading. Value = "+Sburb.tests.loading);
        asset.failure(id);
        cleanup();
    }
};

//Create a graphic Asset
Sburb.createGraphicAsset = function(name, path) {
    // Actual image stuff
    var ret = new Image();
    ret.type = "graphic";
    ret.name = name;
    ret.originalVals = path; // Save for serialization
    // AJAX pre-load shenanigans
    // Load via AJAX, call success or failure
    // If success, set src attribute, call onload or onerror
    ret.success = function(url) {
        var ext = path.substring(path.indexOf(".")+1,path.length);
        var type = Sburb.assetManager.mimes[ext];
        ret.src = url;
        if(type == "image/gif") {
            Sburb.Bins["gif"].appendChild(ret);
        }
    };
    ret.failure = function() { ret.failed = true; };
    ret.onload = function() { ret.loaded = true; }
    ret.onerror = ret.failure;
    ret.assetOnLoadFunction = function(fn) {
        if(ret.loaded) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.onload = function () {
                ret.loaded = true
                if(fn) { fn(); }
            }
            return false;
        }
    };
    ret.assetOnFailFunction = function(fn) {
        if(ret.failed) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.failure = function() {
                if(!ret.failed && fn) { fn(); }
                ret.failed = true;
            }
            return false;
        }
    };
    ret.reload = function() {
        ret.loaded = false;
        ret.failed = false;
        Sburb.loadGenericAsset(ret, path);
    };
    ret.reload();
    return ret;
}

//create an audio Asset
Sburb.createAudioAsset = function(name,sources) {
    // Return a dummy object if no audio support
    if(!Modernizr.audio) {
        return {
            name: name,
            type: "audio",
            originalVals: sources,
            loaded: true,
            instant: true,
            paused: true,
            ended: true,
            currentTime: 0,
            duration: 0,
            load: function() {},
            play: function() {},
            loop: function() {},
            pause: function() {},
            addEventListener: function() {},
        };
    }
    var ret = new Audio();
    ret.name = name
    ret.type = "audio";
    ret.preload = true;
    ret.originalVals = sources;
    // Ajax Shenanigans
    // Load each source, call success or failure for each
    // On success, add as a source
    // When all sources are added add an event listener and timeout
    // If resource isn't loaded by the timeout, fail
    ret.failure = function() { ret.failed = true; };
    ret.isLoaded = function() { ret.loaded = true; };
    // Check multiple times to speed up loading where the event listener fails
    ret.checkLoaded = function() {
        if(!ret.loaded) {
            ret.check_count -= 1;
            if(ret.readyState == 4) {
                delete Sburb.assetManager.recurrences[name];
                ret.isLoaded();
            } else if(!ret.check_count) {
                delete Sburb.assetManager.recurrences[name];
                ret.failure();
            } else {
                Sburb.assetManager.recurrences[name] = setTimeout(ret.checkLoaded, ret.check_interval);
            }
        } else {
            delete Sburb.assetManager.recurrences[name];
        }
    };
    ret.assetOnLoadFunction = function(fn) {
        if(ret.loaded) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.isLoaded = function () {
                ret.loaded = true
                if(fn) { fn(); }
            }
            return false;
        }
    };
    ret.assetOnFailFunction = function(fn) {
        if(ret.failed) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.failure = function() {
                if(!ret.failed && fn) { fn(); }
                ret.failed = true;
            }
            return false;
        }
    };
    ret.success = function(url,id,notBlob) {
        var tmp = document.createElement("source");
        tmp.src = url;
        ret.appendChild(tmp);
        ret.remaining -= 1;
        if(!ret.remaining) {
	        if(window.chrome) ret.load();
            ret.addEventListener('loadeddata', ret.isLoaded, false);
	        if(!notBlob) {
                Sburb.assetManager.recurrences[name] = setTimeout(ret.checkLoaded, ret.check_interval);
            }
        }
    }
    ret.reload = function() {
        ret.remaining = 0; // How many sources we have left to load
        ret.check_interval = 800; // How long to wait between checks
        ret.check_count = 5; // How many checks to make
        ret.loaded = false;
        ret.failed = false;
        for (var a=0; a < sources.length; a++) {
            var ext = sources[a].substring(sources[a].indexOf(".")+1,sources[a].length);
            var type = Sburb.assetManager.mimes[ext];
            if(type == "audio/mpeg") {
                if(Modernizr.audio.mp3) {
                    ret.remaining++;
                    Sburb.loadGenericAsset(ret, sources[a]);
                }
            } else if(type == "audio/ogg") {
                if(Modernizr.audio.ogg) {
                    ret.remaining++;
                    Sburb.loadGenericAsset(ret, sources[a]);
                }
            } else {
                ret.remaining++;
                Sburb.loadGenericAsset(ret, sources[a]);
            }
        }
    };
    ret.reload();
    return ret;
}

//create a flash movie Asset
Sburb.createMovieAsset = function(name,path){
    var ret = {}; //src:Sburb.assetManager.resolvePath(path)};
    ret.name = name;
    ret.type = "movie";
    ret.originalVals = path;
    
    ret.done = function(url) {
        ret.src = url;
        Sburb.Bins["movie"].innerHTML += '<div id="'+name+'"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" id="movie" width="'+Sburb.Stage.width+'" height="'+Sburb.Stage.height+'"><param name="allowScriptAccess" value="always" /\><param name="wmode" value="transparent"/\><param name="movie" value="'+ret.src+'" /\><param name="quality" value="high" /\><embed src="'+ret.src+'" quality="high" WMODE="transparent" width="'+Sburb.Stage.width+'" height="'+Sburb.Stage.height+'" swLiveConnect="true" id="movie'+name+'" name="movie'+name+'" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /\></object></div>';
        document.getElementById(name).style.display = "none";
    }
    ret.success = function(url) { ret.done(url); ret.loaded = true; };
    ret.failure = function() { ret.failed = true; };
    ret.assetOnLoadFunction = function(fn) {
        if(ret.loaded) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.success = function (url) {
                ret.done(url);
                ret.loaded = true
                if(fn) { fn(); }
            }
            return false;
        }
    };
    ret.assetOnFailFunction = function(fn) {
        if(ret.failed) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.failure = function() {
                if(!ret.failed && fn) { fn(); }
                ret.failed = true;
            }
            return false;
        }
    };
    ret.reload = function() {
        ret.loaded = false;
        ret.failed = false;
        Sburb.loadGenericAsset(ret, path);
    };
    
    ret.reload();

    return ret;
}

//create a path asset
Sburb.createPathAsset = function(name, path) {
    var ret = path;
    ret.name = name;
    ret.type = "path";
    ret.instant = true;
    ret.assetOnLoadFunction = function(fn) {
        if(fn) { fn(); }
        return;
    }
    ret.assetOnFailFunction = function(fn) { return false; }
    return ret
}

//create a font
Sburb.createFontAsset = function(name, sources){
    var ret = {font:sources[0]};
    ret.name = name;
    ret.originalVals = sources;
    ret.type = "font";
    ret.done = function(url) { ret.loaded = true; };
    ret.failure = function() { ret.failed = true; };
    ret.success = function(url, id) {
        var font = "url('"+url+"') format('"+ret.sources[id]+"')";
        ret.sources[id] = font;
        ret.remaining -= 1;
        if(!ret.remaining) {
            Sburb.Bins["font"].innerHTML += '<style type="text/css">@font-face{ font-family: '+ret.name+'; src: '+ret.sources.join(',')+'; '+ret.extra+'}</style>';
            Sburb.stage.font="10px "+name;
            ret.done();
        }
    };
    ret.assetOnLoadFunction = function(fn) {
        if(ret.loaded) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.done = function (url) {
                ret.loaded = true
                if(fn) { fn(); }
            }
            return false;
        }
    };
    ret.assetOnFailFunction = function(fn) {
        if(ret.failed) {
            if(fn) { fn(); }
            return true;
        } else {
            ret.failure = function() {
                if(!ret.failed && fn) { fn(); }
                ret.failed = true;
            }
            return false;
        }
    };
    ret.reload = function() {
        ret.loaded = false;
        ret.failed = false;
        var sourceList = sources.split(',');
        ret.remaining = 0
        ret.sources = [];
        ret.extra = "";
        for(var i=0;i<sourceList.length;i++){
            var values = sourceList[i].split(':');
            var type = values[0].trim();
            var path = values[1].trim();
            if(type == "url"){
                var extension = path.substring(path.indexOf(".")+1,path.length);
                var format = "";
                if(extension=="ttf"){
                    format = "truetype";
                }else if(extension=="woff"){
                    format = "woff";
                }else if(extension=="svg"){
                    format = "svg";
                }
                ret.remaining += 1;
                Sburb.loadGenericAsset(ret, path, ret.sources.length);
                ret.sources.push(format);
            }else if(type == "local"){
                ret.sources.push("local('"+path+"')");
            }else if(type == "weight"){
                ret.extra+= "font-weight:"+path+"; "
            }
        }
    };
    
    ret.reload();
    
    return ret
}

//create a text asset
Sburb.createTextAsset = function(name, text) {
    var ret = {text: unescape(text).trim()};
    ret.name = name;
    ret.type = "text";
    ret.instant = true;
    ret.assetOnLoadFunction = function(fn) {
        if(fn) { fn(); }
        return;
    }
    ret.assetOnFailFunction = function(fn) { return false; }
    return ret
}

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){

////////////////////////////////////////////
//Debugger Class
////////////////////////////////////////////

Sburb.Debugger = function() {
    this.url = "http://sburb.info/report/version1/";
    this.fps = 0;
    this.errors = [];
    this.xhrs = [];
    this.tests = {};
    this.open = false;
    this.tilde = false; // Has tilde already been pushed?
    this.space = false; // Has space already been pushed?
    this.getImg = false; // Requested to get a picture of the current canvas?
    this.img = false;
    this.report = false;
    this.colors = {
        // Console messages
        "error":     "#CC0000",
        "exception": "#990000",
        "warn":      "#CCCC00",
        "info":      "#000099",
        "log":       "#AAAAAA",
        "debug":     "#777777",
        // Test messages
        "success":   "#00CC00",
        "failure":   "#CC0000",
        "variant11": "#00CC00",
        "variant10": "#00CC00",
        "variant9":  "#00CC00",
        "variant8":  "#00CC00",
        "variant7":  "#CCAA00",
        "variant6":  "#CCAA00",
        "variant5":  "#CCAA00",
        "variant4":  "#CCAA00",
        "variant3":  "#FF6600",
        "variant2":  "#FF6600",
        "variant1":  "#FF6600",
        "variant12": "#FF6600",
        "variant0":  "#CC0000",
    };
    // Run tests
    this.tests["Audio Support"] = Sburb.tests.audio ? "success" : "failure";
    this.tests["Save Support"] = Sburb.tests.storage ? "success" : "failure";
    this.tests["File Loading ["+Sburb.tests.loading+"]"] = "variant"+Sburb.tests.loading;
    // Get them errors
    var that = this;
    this.console = new Sburb.Console();
    this.XMLHttpRequest = window.XMLHttpRequest; // Save real XMLHttpRequest
    // window.XMLHttpRequest = function() { return new Sburb.XMLHttpRequest(); }; // Replace real XMLHttpRequest
    window.addEventListener("error",function(e) { that.errors.push({"type":e.type,"text":e.message,"url":e.filename,"line":e.lineno,"time":e.timeStamp});},false);
}

Sburb.Debugger.prototype.handleInputs = function(pressed) {
    if(pressed[Sburb.Keys.tilde] && !this.tilde) {
        this.tilde = true;
        this.open = !this.open;
    }
    // if(pressed[Sburb.Keys.space] && !this.space && this.open) {
    //     this.space = true;
    //     this.sendDebugReport();
    // }
    if(!pressed[Sburb.Keys.tilde])
        this.tilde = false;
    if(!pressed[Sburb.Keys.space])
        this.space = false;
    if(pressed[Sburb.Keys.escape])
        this.open = false;
}

Sburb.Debugger.prototype.draw = function() {
    // Track FPS
    this.fps++;
    var that = this;
    setTimeout(function() { that.fps--; }, 1000);
    // Save the image
    if(this.getImg) {
        this.getImg = false;
        this.img = Sburb.Stage.toDataURL();
        this.gotImg();
    }
    // Draw
    if(this.open) {
        // Obscure the game
        var lineWidth = Sburb.stage.lineWidth;
        var strokeStyle = Sburb.stage.strokeStyle;
        Sburb.stage.lineWidth = 9;
        Sburb.stage.strokeStyle = "#000000";
        Sburb.stage.beginPath();
        for(var i = 0; i <= Sburb.Stage.height; i += 10) {
            Sburb.stage.moveTo(0,i);
            Sburb.stage.lineTo(Sburb.Stage.width,i);
        }
        Sburb.stage.closePath();
        Sburb.stage.stroke();
        Sburb.stage.lineWidth = lineWidth;
        Sburb.stage.strokeStyle = strokeStyle;
        // Dump the errors
        Sburb.stage.textAlign = "left";
        Sburb.stage.font="bold 18px Verdana";
        for(var error = this.errors.length - 1, y = Sburb.Stage.height - 15; error >= 0; error--, y -= 24) {
            if(this.errors[error].type in this.colors) {
                Sburb.stage.fillStyle = this.colors[this.errors[error].type];
            } else {
                Sburb.stage.fillStyle = "#000000";
            }
            Sburb.stage.fillText(this.errors[error].text,10,y);
        }
        // Display test status
        var y = 70;
        Sburb.stage.textAlign = "right";
        Sburb.stage.font="bold 18px Verdana";
        for(var test in this.tests) {
            if(!this.tests.hasOwnProperty(test)) continue;
            var color = this.tests[test];
            var width = Sburb.stage.measureText(test).width;
            Sburb.stage.fillStyle = this.colors[color];
            Sburb.stage.fillRect(Sburb.Stage.width-(width+20),y,width+10,24);
            Sburb.stage.fillStyle = "#FFFFFF";
            Sburb.stage.fillText(test,Sburb.Stage.width-15,y+18);
            y += 26;
        }
        // Add title
        Sburb.stage.fillStyle = "#000000";
        Sburb.stage.fillRect(Sburb.Stage.width/2-125,10,250,65);
        Sburb.stage.textAlign = "center";
        Sburb.stage.fillStyle = "#FFFFFF";
        Sburb.stage.font="bold 28px Verdana";
        Sburb.stage.fillText("Sburb Debugger",Sburb.Stage.width/2,33);
        Sburb.stage.font="14px Verdana";
        // Sburb.stage.fillText("Press SPACE to send bug report",Sburb.Stage.width/2,51);
        Sburb.stage.fillText("Press ~ or ESC to exit",Sburb.Stage.width/2,67);
        // Add FPS
        Sburb.stage.fillStyle = "#000000";
        Sburb.stage.fillRect(Sburb.Stage.width-50,Sburb.Stage.height-25,50,25);
        Sburb.stage.textAlign = "right";
        Sburb.stage.fillStyle = "#FFFFFF";
        Sburb.stage.font="bold 16px Verdana";
        Sburb.stage.fillText(this.fps+"fps",Sburb.Stage.width-8,Sburb.Stage.height-10);
        // Reset
        Sburb.stage.textAlign = "center";
        Sburb.stage.fillStyle = "#000000";
    }
}

Sburb.Debugger.prototype.sendDebugReport = function() {
    var div = document.createElement('div');
    var title = document.createElement('h2');
    var form = document.createElement('form');
    var textbox = document.createElement('textarea');
    var submit = document.createElement('input');
    div.id = "sburb_debug_report";
    div.style.position = "absolute";
    div.style.zIndex = "9999";
    div.style.background = "white";
    div.style.width = "550px";
    div.style.top = "100px";
    div.style.left = "50px";
    title.innerText = "What seems to be the problem?";
    title.style.margin = "0 20px";
    form.method = "POST";
    form.action = "#";
    form.style.textAlign = "right";
    form.onsubmit = this.submitForm;
    textbox.id = "sburb_debug_report_box";
    textbox.style.width = "530px";
    textbox.style.height = "200px";
    textbox.style.margin = "0 8px";
    textbox.style.display = "block";
    submit.type = "submit";
    submit.value = "Send Bug Report";
    form.appendChild(textbox);
    form.appendChild(submit);
    div.appendChild(title);
    div.appendChild(form);
    Sburb.Game.parentNode.appendChild(div);
    textbox.focus();
}

Sburb.Debugger.prototype.submitForm = function() {
    var div = document.getElementById("sburb_debug_report");
    Sburb.debugger.report = document.getElementById("sburb_debug_report_box").value;
    Sburb.debugger.getImg = true;
    div.parentNode.removeChild(div);
    return false;
}

Sburb.Debugger.prototype.gotImg = function() {
    var debug = {
        "fps": this.fps,
        "errors": this.errors,
        "tests": this.tests,
        "xhrs": this.xhrs,
    };
    var raw = {
        "debugger": JSON.stringify(debug),
        "canvas": this.img.substr(22), // Cut off "data:image/png;base64,"
        "report": this.report,
        "url": location.href,
        "save": Sburb.serialize(Sburb),
    };
    var list = [];
    var data = "";
    for(k in raw) {
        if(!raw.hasOwnProperty(k)) continue;
        list.push(encodeURIComponent(k)+"="+encodeURIComponent(raw[k]));
    };
    data = list.join("&"); // Why do I have to do this myself? Come on javascript.
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST",this.url,true);
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if((this.status == 200 || this.status == 0) && this.responseText) {
            var result = JSON.parse(this.responseText);
            if("success" in result && result["success"]) {
                console.debug("Bug report sent.");
            } else {
                console.debug("Bug report failed to save.");
            }
        } else {
            console.debug("Bug report failed to send.");
        }
    }
    xhr.onerror = function() { console.debug("Bug report failed to send."); };
    xhr.onabort = function() { console.debug("Bug report failed to send."); };
    xhr.send(data);
}

// ===================
// = Replace Console =
// ===================
Sburb.Console = function() {
    var console = this._console = window.console; // Save the real console
    window.console = this;
    // Utilities
    var ignore = {
        "log": 1,
        "debug": 1,
        "info": 1,
        "warn": 1,
        "error": 1,
        "exception": 1
    };
    var isFunction = function(obj) { return obj && {}.toString.call(obj) === "[object Function]"; }
    var addError = function(type,args) {
        var largs = Array.prototype.slice.call(args);
        Sburb.debugger.errors.push({type:type,text:largs.join(', ')});
    }
    var proxy = function(method, args) {
        return console[method].apply(console, args); // This breaks in IE
    }
    // Import all of console
    for (var prop in console) {
        if (prop in ignore) continue;
        try {
            if (isFunction(console[prop])) {
                if (typeof this[prop] == "undefined") {
                    this[prop] = (function(name, func){
                        return function() { return func(name, arguments); };
                    })(prop, proxy);
                } 
            }
            else
                this[prop] = console[prop];
        } catch(E) {}
    }
    // Override logging functions
    this.log       = function() { addError("log",arguments);       return proxy("log",arguments);       }
    this.debug     = function() { addError("debug",arguments);     return proxy("debug",arguments);     }
    this.info      = function() { addError("info",arguments);      return proxy("info",arguments);      }
    this.warn      = function() { addError("warn",arguments);      return proxy("warn",arguments);      }
    this.error     = function() { addError("error",arguments);     return proxy("error",arguments);     }
    this.exception = function() { addError("exception",arguments); return proxy("exception",arguments); }
    return this;
}

// ==========================
// = Replace XMLHttpRequest =
// ==========================
Sburb.XMLHttpRequest = function() {
    // Public fun
    var self = this;
    var xhr = self._xhr = new Sburb.debugger.XMLHttpRequest();
    self.reqType = null;
    self.reqUrl = null;
    self.reqStart = null;
    self.readyState = 0;
    self.onreadystatechange = function(){};
    self.spy = {
        requestHeaders: [],
        responseHeaders: [],
        method: null,
        url: null,
        async: null,
        loaded: false,
        status: null,
        statusText: null,
        data: null
    };
    // Private fun
    var supportsApply = self.xhr && self.xhr.open && self.xhr.open.apply != "undefined";
    var isFunction = function(obj) { return obj && {}.toString.call(obj) === "[object Function]"; }
    var ignoreSelf = {
        abort: 1,
        channel: 1,
        getInterface: 1,
        mozBackgroundRequest: 1,
        multipart: 1,
        onreadystatechange: 1,
        open: 1,
        send: 1,
        setRequestHeader: 1
    };
    var ignoreXHR = {
        channel: 1,
        onreadystatechange: 1,
        readyState: 1,
        responseBody: 1,
        responseText: 1,
        responseXML: 1,
        status: 1,
        statusText: 1,
        upload: 1,
        spy: 1,
        _xhr: 1
    };
    var updateSelfProperties = function() {
        for(var prop in xhr) {
            if (prop in ignoreSelf) continue;
            try {
                if(xhr[prop] && !isFunction(xhr[prop])) {
                    self[prop] = xhr[prop];
                }
            } catch(E) {}
        }
    }
    var updateXHRProperties = function() {
        for(var prop in self) {
            if (prop in ignoreXHR) continue;
            try {
                if(self[prop] && !xhr[prop]) {
                    xhr[prop] = self[prop];
                }
            } catch(E) {}
        }
    }
    var finishXHR = function() {
        var duration = new Date().getTime() - self.reqStart;
        var success = xhr.status == 200 || xhr.status == 0;
        var status = xhr.status + " " + xhr.statusText;
        var responseHeadersText = xhr.getAllResponseHeaders();
        var responses = responseHeadersText ? responseHeadersText.split(/[\n\r]/) : [];
        var reHeader = /^(\S+):\s*(.*)/;
        for (var i=0, l=responses.length; i<l; i++) {
            var text = responses[i];
            var match = text.match(reHeader);
            if (match) {
                var name = match[1];
                var value = match[2];
                if (name == "Content-Type")
                    self.spy.mimeType = value;
                self.spy.responseHeaders.push({name: name, value: value});
            }
        }
        //self.spy.responseText = xhr.responseText;
        self.spy.loaded = true;
        self.spy.status = xhr.status;
        self.spy.statusText = status;
        updateSelfProperties();
        Sburb.debugger.xhrs.push(self.spy);
        if(!success)
            console.warn("XHR for "+self.spy.url+" failed");
    }
    var handleStateChange = function() {
        self.readyState = xhr.readyState;
        if (xhr.readyState == 4) {
            finishXHR();
            xhr.onreadystatechange = function(){};
        }
        self.onreadystatechange();
    }
    // Overwrite specific functions
    this.open = function(method, url, async, user, password) {
        updateSelfProperties();
        self.spy.method = method;
        self.spy.url = url;
        self.spy.async = async;
        if (async)
            xhr.onreadystatechange = handleStateChange;
        if (this.supportsApply)
            xhr.open.apply(xhr, arguments);
        else
            xhr.open(method, url, async, user, password);
    }
    this.send = function(data) {
        self.spy.data = data;
        self.reqStart = new Date().getTime();
        updateXHRProperties();
        try {
            xhr.send(data);
        } catch(e) {
            throw e; 
        } finally {
            if (!self.spy.async) {
                self.readyState = xhr.readyState;
                finishXHR();
            }
        }
    }  
    this.setRequestHeader = function(header, value) {
        self.spy.requestHeaders.push({name: header, value: value});
        return xhr.setRequestHeader(header, value);
    }    
    this.abort = function() {
        xhr.abort();
        updateSelfProperties();
        handleRequestStatus(false, "Aborted");
    }
    // Import XHR stuff
    for (var prop in xhr) {
        if (prop in ignoreSelf) continue;
        try {
            if (isFunction(xhr[prop])) {
                if (typeof self[prop] == "undefined") {
                    self[prop] = (function(name, xhr){
                        return this.supportsApply ? function() { return xhr[name].apply(xhr, arguments); } : function(a,b,c,d,e) { return xhr[name](a,b,c,d,e); };
                    })(prop, xhr);
                } 
            }
            else
                self[prop] = xhr[prop];
        } catch(E) {}
    }
    return this;
}

return Sburb;
})(Sburb || {});
var Sburb = (function(Sburb){


/////////////////////////////////////
//Path class
/////////////////////////////////////

//constructor
Sburb.Path = function(){
	this.points = [];
}

//add a point to the path
Sburb.Path.prototype.push = function(point){
	this.points.push(point);
}

//Check if the given points are in the path, favouring positively
Sburb.Path.prototype.queryBatchPos = function(queries,results){
	for(var query in queries){
	    if(!queries.hasOwnProperty(query)) continue;
	    results[query] = results[query] || this.query(queries[query]);
	}
}

//Check if the given points are in the path, favouring negatively
Sburb.Path.prototype.queryBatchNeg = function(queries,results){
	for(var query in queries){
	    if(!queries.hasOwnProperty(query)) continue;
	    results[query] = results[query] && !this.query(queries[query]);
	}
}

//Check if the given point is in the path
Sburb.Path.prototype.query = function(pt){
	for(var c = false, i = -1, l = this.points.length, j = l-1; ++i < l;j=i){
		var ptA = this.points[i];
		var ptB = this.points[j];
		((ptA.y <= pt.y && pt.y < ptB.y) || (ptB.y <= pt.y && pt.y < ptA.y))
		&& (pt.x < (ptB.x - ptA.x) * (pt.y - ptA.y) / (ptB.y - ptA.y) + ptA.x)
		&& (c = !c);
	}
	return c;
}

var Sburb = (function(Sburb){

////////////////////////////////////////////
//Debugger Class
////////////////////////////////////////////

Sburb.Debugger = function() {
    this.url = "http://sburb.info/report/version1/";
    this.fps = 0;
    this.errors = [];
    this.xhrs = [];
    this.tests = {};
    this.open = false;
    this.tilde = false; // Has tilde already been pushed?
    this.space = false; // Has space already been pushed?
    this.getImg = false; // Requested to get a picture of the current canvas?
    this.img = false;
    this.report = false;
    this.colors = {
        // Console messages
        "error":     "#CC0000",
        "exception": "#990000",
        "warn":      "#CCCC00",
        "info":      "#000099",
        "log":       "#AAAAAA",
        "debug":     "#777777",
        // Test messages
        "success":   "#00CC00",
        "failure":   "#CC0000",
        "variant11": "#00CC00",
        "variant10": "#00CC00",
        "variant9":  "#00CC00",
        "variant8":  "#00CC00",
        "variant7":  "#CCAA00",
        "variant6":  "#CCAA00",
        "variant5":  "#CCAA00",
        "variant4":  "#CCAA00",
        "variant3":  "#FF6600",
        "variant2":  "#FF6600",
        "variant1":  "#FF6600",
        "variant12": "#FF6600",
        "variant0":  "#CC0000",
    };
    // Run tests
    this.tests["Audio Support"] = Sburb.tests.audio ? "success" : "failure";
    this.tests["Save Support"] = Sburb.tests.storage ? "success" : "failure";
    this.tests["File Loading ["+Sburb.tests.loading+"]"] = "variant"+Sburb.tests.loading;
    // Get them errors
    var that = this;
    this.console = new Sburb.Console();
    this.XMLHttpRequest = window.XMLHttpRequest; // Save real XMLHttpRequest
    window.XMLHttpRequest = function() { return new Sburb.XMLHttpRequest(); }; // Replace real XMLHttpRequest
    window.addEventListener("error",function(e) { that.errors.push({"type":e.type,"text":e.message,"url":e.filename,"line":e.lineno,"time":e.timeStamp}); that.open = true; },false);
}

Sburb.Debugger.prototype.handleInputs = function(pressed) {
    if(pressed[Sburb.Keys.tilde] && !this.tilde) {
        this.tilde = true;
        this.open = !this.open;
    }
    if(pressed[Sburb.Keys.space] && !this.space && this.open) {
        this.space = true;
        this.sendDebugReport();
    }
    if(!pressed[Sburb.Keys.tilde])
        this.tilde = false;
    if(!pressed[Sburb.Keys.space])
        this.space = false;
    if(pressed[Sburb.Keys.escape])
        this.open = false;
}

Sburb.Debugger.prototype.draw = function() {
    // Track FPS
    this.fps++;
    var that = this;
    setTimeout(function() { that.fps--; }, 1000);
    // Save the image
    if(this.getImg) {
        this.getImg = false;
        this.img = Sburb.Stage.toDataURL();
        this.gotImg();
    }
    // Draw
    if(this.open) {
        // Obscure the game
        var lineWidth = Sburb.stage.lineWidth;
        var strokeStyle = Sburb.stage.strokeStyle;
        Sburb.stage.lineWidth = 9;
        Sburb.stage.strokeStyle = "#000000";
        Sburb.stage.beginPath();
        for(var i = 0; i <= 450; i += 10) {
            Sburb.stage.moveTo(0,i);
            Sburb.stage.lineTo(650,i);
        }
        Sburb.stage.closePath();
        Sburb.stage.stroke();
        Sburb.stage.lineWidth = lineWidth;
        Sburb.stage.strokeStyle = strokeStyle;
        // Dump the errors
        Sburb.stage.textAlign = "left";
        Sburb.stage.font="bold 18px Verdana";
        for(var error = this.errors.length - 1, y = 435; error >= 0; error--, y -= 24) {
            if(this.errors[error].type in this.colors) {
                Sburb.stage.fillStyle = this.colors[this.errors[error].type];
            } else {
                Sburb.stage.fillStyle = "#000000";
            }
            Sburb.stage.fillText(this.errors[error].text,10,y);
        }
        // Display test status
        var y = 70;
        Sburb.stage.textAlign = "right";
        Sburb.stage.font="bold 18px Verdana";
        for(var test in this.tests) {
            if(!this.tests.hasOwnProperty(test)) continue;
            var color = this.tests[test];
            var width = Sburb.stage.measureText(test).width;
            Sburb.stage.fillStyle = this.colors[color];
            Sburb.stage.fillRect(630-width,y,width+10,24);
            Sburb.stage.fillStyle = "#FFFFFF";
            Sburb.stage.fillText(test,635,y+18);
            y += 26;
        }
        // Add title
        Sburb.stage.fillStyle = "#000000";
        Sburb.stage.fillRect(200,10,250,65);
        Sburb.stage.textAlign = "center";
        Sburb.stage.fillStyle = "#FFFFFF";
        Sburb.stage.font="bold 28px Verdana";
        Sburb.stage.fillText("Sburb Debugger",325,33);
        Sburb.stage.font="14px Verdana";
        Sburb.stage.fillText("Press SPACE to send bug report",325,51);
        Sburb.stage.fillText("Press ~ or ESC to exit",325,67);
        // Add FPS
        Sburb.stage.fillStyle = "#000000";
        Sburb.stage.fillRect(600,425,50,25);
        Sburb.stage.textAlign = "right";
        Sburb.stage.fillStyle = "#FFFFFF";
        Sburb.stage.font="bold 16px Verdana";
        Sburb.stage.fillText(this.fps+"fps",642,440);
        // Reset
        Sburb.stage.textAlign = "center";
        Sburb.stage.fillStyle = "#000000";
    }
}

Sburb.Debugger.prototype.sendDebugReport = function() {
    var div = document.createElement('div');
    var title = document.createElement('h2');
    var form = document.createElement('form');
    var textbox = document.createElement('textarea');
    var submit = document.createElement('input');
    div.id = "sburb_debug_report";
    div.style.position = "absolute";
    div.style.zIndex = "9999";
    div.style.background = "white";
    div.style.width = "550px";
    div.style.top = "100px";
    div.style.left = "50px";
    title.innerText = "What seems to be the problem?";
    title.style.margin = "0 20px";
    form.method = "POST";
    form.action = "#";
    form.style.textAlign = "right";
    form.onsubmit = this.submitForm;
    textbox.id = "sburb_debug_report_box";
    textbox.style.width = "530px";
    textbox.style.height = "200px";
    textbox.style.margin = "0 8px";
    textbox.style.display = "block";
    submit.type = "submit";
    submit.value = "Send Bug Report";
    form.appendChild(textbox);
    form.appendChild(submit);
    div.appendChild(title);
    div.appendChild(form);
    document.getElementById("SBURBgameDiv").parentNode.appendChild(div);
    textbox.focus();
}

Sburb.Debugger.prototype.submitForm = function() {
    var div = document.getElementById("sburb_debug_report");
    Sburb.debugger.report = document.getElementById("sburb_debug_report_box").value;
    Sburb.debugger.getImg = true;
    div.parentNode.removeChild(div);
    return false;
}

Sburb.Debugger.prototype.gotImg = function() {
    var debug = {
        "fps": this.fps,
        "errors": this.errors,
        "tests": this.tests,
        "xhrs": this.xhrs,
    };
    var raw = {
        "debugger": JSON.stringify(debug),
        "canvas": this.img.substr(22), // Cut off "data:image/png;base64,"
        "report": this.report,
        "url": location.href,
        "save": Sburb.serialize(Sburb),
    };
    var list = [];
    var data = "";
    for(k in raw) {
        if(!raw.hasOwnProperty(k)) continue;
        list.push(encodeURIComponent(k)+"="+encodeURIComponent(raw[k]));
    };
    data = list.join("&"); // Why do I have to do this myself? Come on javascript.
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST",this.url,true);
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.onload = function() {
        if((this.status == 200 || this.status == 0) && this.responseText) {
            var result = JSON.parse(this.responseText);
            if("success" in result && result["success"]) {
                console.debug("Bug report sent.");
            } else {
                console.debug("Bug report failed to save.");
            }
        } else {
            console.debug("Bug report failed to send.");
        }
    }
    xhr.onerror = function() { console.debug("Bug report failed to send."); };
    xhr.onabort = function() { console.debug("Bug report failed to send."); };
    xhr.send(data);
}

// ===================
// = Replace Console =
// ===================
Sburb.Console = function() {
    var console = this._console = window.console; // Save the real console
    window.console = this;
    // Utilities
    var ignore = {
        "log": 1,
        "debug": 1,
        "info": 1,
        "warn": 1,
        "error": 1,
        "exception": 1
    };
    var isFunction = function(obj) { return obj && {}.toString.call(obj) === "[object Function]"; }
    var addError = function(type,args) {
        var largs = Array.prototype.slice.call(args);
        Sburb.debugger.errors.push({type:type,text:largs.join(', ')});
    }
    var proxy = function(method, args) {
        return console[method].apply(console, args); // This breaks in IE
    }
    // Import all of console
    for (var prop in console) {
        if (prop in ignore) continue;
        try {
            if (isFunction(console[prop])) {
                if (typeof this[prop] == "undefined") {
                    this[prop] = (function(name, func){
                        return function() { return func(name, arguments); };
                    })(prop, proxy);
                } 
            }
            else
                this[prop] = console[prop];
        } catch(E) {}
    }
    // Override logging functions
    this.log       = function() { addError("log",arguments);       return proxy("log",arguments);       }
    this.debug     = function() { addError("debug",arguments);     return proxy("debug",arguments);     }
    this.info      = function() { addError("info",arguments);      return proxy("info",arguments);      }
    this.warn      = function() { addError("warn",arguments);      return proxy("warn",arguments);      }
    this.error     = function() { addError("error",arguments);     return proxy("error",arguments);     }
    this.exception = function() { addError("exception",arguments); return proxy("exception",arguments); }
    return this;
}

// ==========================
// = Replace XMLHttpRequest =
// ==========================
Sburb.XMLHttpRequest = function() {
    // Public fun
    var self = this;
    var xhr = self._xhr = new Sburb.debugger.XMLHttpRequest();
    self.reqType = null;
    self.reqUrl = null;
    self.reqStart = null;
    self.readyState = 0;
    self.onreadystatechange = function(){};
    self.spy = {
        requestHeaders: [],
        responseHeaders: [],
        method: null,
        url: null,
        async: null,
        loaded: false,
        status: null,
        statusText: null,
        data: null
    };
    // Private fun
    var supportsApply = self.xhr && self.xhr.open && self.xhr.open.apply != "undefined";
    var isFunction = function(obj) { return obj && {}.toString.call(obj) === "[object Function]"; }
    var ignoreSelf = {
        abort: 1,
        channel: 1,
        getInterface: 1,
        mozBackgroundRequest: 1,
        multipart: 1,
        onreadystatechange: 1,
        open: 1,
        send: 1,
        setRequestHeader: 1
    };
    var ignoreXHR = {
        channel: 1,
        onreadystatechange: 1,
        readyState: 1,
        responseBody: 1,
        responseText: 1,
        responseXML: 1,
        status: 1,
        statusText: 1,
        upload: 1,
        spy: 1,
        _xhr: 1
    };
    var updateSelfProperties = function() {
        for(var prop in xhr) {
            if (prop in ignoreSelf) continue;
            try {
                if(xhr[prop] && !isFunction(xhr[prop])) {
                    self[prop] = xhr[prop];
                }
            } catch(E) {}
        }
    }
    var updateXHRProperties = function() {
        for(var prop in self) {
            if (prop in ignoreXHR) continue;
            try {
                if(self[prop] && !xhr[prop]) {
                    xhr[prop] = self[prop];
                }
            } catch(E) {}
        }
    }
    var finishXHR = function() {
        var duration = new Date().getTime() - self.reqStart;
        var success = xhr.status == 200 || xhr.status == 0;
        var status = xhr.status + " " + xhr.statusText;
        var responseHeadersText = xhr.getAllResponseHeaders();
        var responses = responseHeadersText ? responseHeadersText.split(/[\n\r]/) : [];
        var reHeader = /^(\S+):\s*(.*)/;
        for (var i=0, l=responses.length; i<l; i++) {
            var text = responses[i];
            var match = text.match(reHeader);
            if (match) {
                var name = match[1];
                var value = match[2];
                if (name == "Content-Type")
                    self.spy.mimeType = value;
                self.spy.responseHeaders.push({name: name, value: value});
            }
        }
        //self.spy.responseText = xhr.responseText;
        self.spy.loaded = true;
        self.spy.status = xhr.status;
        self.spy.statusText = status;
        updateSelfProperties();
        Sburb.debugger.xhrs.push(self.spy);
        if(!success)
            console.warn("XHR for "+self.spy.url+" failed");
    }
    var handleStateChange = function() {
        self.readyState = xhr.readyState;
        if (xhr.readyState == 4) {
            finishXHR();
            xhr.onreadystatechange = function(){};
        }
        self.onreadystatechange();
    }
    // Overwrite specific functions
    this.open = function(method, url, async, user, password) {
        updateSelfProperties();
        self.spy.method = method;
        self.spy.url = url;
        self.spy.async = async;
        if (async)
            xhr.onreadystatechange = handleStateChange;
        if (this.supportsApply)
            xhr.open.apply(xhr, arguments);
        else
            xhr.open(method, url, async, user, password);
    }
    this.send = function(data) {
        self.spy.data = data;
        self.reqStart = new Date().getTime();
        updateXHRProperties();
        try {
            xhr.send(data);
        } catch(e) {
            throw e; 
        } finally {
            if (!self.spy.async) {
                self.readyState = xhr.readyState;
                finishXHR();
            }
        }
    }  
    this.setRequestHeader = function(header, value) {
        self.spy.requestHeaders.push({name: header, value: value});
        return xhr.setRequestHeader(header, value);
    }    
    this.abort = function() {
        xhr.abort();
        updateSelfProperties();
        handleRequestStatus(false, "Aborted");
    }
    // Import XHR stuff
    for (var prop in xhr) {
        if (prop in ignoreSelf) continue;
        try {
            if (isFunction(xhr[prop])) {
                if (typeof self[prop] == "undefined") {
                    self[prop] = (function(name, xhr){
                        return this.supportsApply ? function() { return xhr[name].apply(xhr, arguments); } : function(a,b,c,d,e) { return xhr[name](a,b,c,d,e); };
                    })(prop, xhr);
                } 
            }
            else
                self[prop] = xhr[prop];
        } catch(E) {}
    }
    return this;
}

return Sburb;
})(Sburb || {});





return Sburb;
})(Sburb || {});
