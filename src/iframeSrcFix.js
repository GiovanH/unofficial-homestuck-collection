// This awful hack is necessary because of a a bug in old versions of electron (at least up to 11.0.0)
// where iframes can't use custom protocols to fetch pages. Instead, electron tries to open them with an external browser.
//
// This hack has two simultaneous solutions:
// 1. It patches setters to resolve asset URLs before actually setting them.
// 1.a. patches src setter and setAttribute of iframe
// 1.b. patches innerHTML setter of all elements. If it contains any iframes, their URLs are resolved
//
// 2. MutationObserver looks for changes in src attribute and for new nodes in the document. On updates - resolves their srcs.
//
// Ideally, solution 1 would not be necessary, but electron immediately sends a request when src is set,
// before MutationObserver has a chance to fix the URL. This is not a huge problem since it does fix it eventually,
// but the first request still happens, and electron still opens it in an external browser, which is annoying.
// 
// On the other hand, 1 can't be the only solution because it does not affect changes made via inspect element,
// which might be useful for mod developers.
// So, two solutions it is, although 2 is only enabled when developer mode is on
//
// Ideally, this would also fix webview element, but there doesn't seem to be a way to patch it.
// It seems to have no class, prototype, etc
//

const Resources = require('@/resources.js')

function fixSrc(value) {
  if (value.startsWith('assets://')) {
    return Resources.resolveAssetsProtocol(value)
  } else {
    return value
  }
}

let installed = false
const old = {}

function install() {
  if (installed) {
    return
  }
  installed = true

  old.innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
  Object.defineProperty(Element.prototype, 'innerHTML', {
    get: old.innerHTML.get,
    set: function(value) {
      const lc = value.toLowerCase()
      if (lc.includes('iframe')) {
        const parser = document.createElement('div')
        old.innerHTML.set.call(parser, value)

        for (const el of parser.querySelectorAll('iframe')) {
          const old = el.getAttribute('src')
          if (old != null) {
            // This is fine. This url will be resolved by the patched setter
            el.setAttribute('src', old)
          }
        }

        old.innerHTML.set.call(this, parser.innerHTML)
      } else {
        old.innerHTML.set.call(this, value)
      }
    }
  })

  old.iframeSrc = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'src')
  Object.defineProperty(HTMLIFrameElement.prototype, 'src', {
    get: old.iframeSrc.get,
    set: function(value) {
      old.iframeSrc.set.call(this, fixSrc(value))
    }
  })

  old.iframeSetAttribute = HTMLIFrameElement.prototype.setAttribute
  HTMLIFrameElement.prototype.setAttribute = function(name, value, ...args) {
    if (name == 'src') {
      return old.iframeSetAttribute.call(this, name, fixSrc(value), ...args)
    } else {
      return old.iframeSetAttribute.call(this, name, value, ...args)
    }
  }
}

function uninstall() {
  if (!installed) {
    return
  }

  Object.defineProperty(Element.prototype, 'innerHTML', old.innerHTML)

  Object.defineProperty(HTMLIFrameElement.prototype, 'src', old.iframeSrc)
  HTMLIFrameElement.prototype.setAttribute = old.iframeSetAttribute

  installed = false
}

let recursionPreventionFlag = false
const observer = new MutationObserver(mutations => {
  if (recursionPreventionFlag) {
    return
  }

  try {
    recursionPreventionFlag = true
    for (const mut of mutations) {
      if (mut.type == 'attributes' && mut.target.nodeName == 'IFRAME') {
        const el = mut.target
        el.setAttribute('src', el.getAttribute('src'))
      } else if (mut.type == 'childlist') {
        for (const el of mut.target.querySelectorAll('iframe')) {
          const old = el.getAttribute('src')
          if (old != null) {
            // This is fine. This url will be resolved by the patched setter
            el.setAttribute('src', old)
          }
        }
      }
    }
  } finally {
    recursionPreventionFlag = false
    observer.takeRecords()
  }
})

function setDevtoolsFix(isEnabled) {
  if (isEnabled) {
    observer.observe(document, { attributeFilter: ['src'], childList: true, subtree: true })
  } else {
    observer.disconnect()
  }
}

module.exports = {
  install,
  uninstall,
  setDevtoolsFix,
}
