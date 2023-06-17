// Client sends or sendsyncs, server reacts (registered with on)
var listeners = {}

const sendSync = function (channel, args) {
    if (listeners[channel]) {
        // const res = listeners[channel](args)
        const res = listeners[channel](null, args)
        console.warn("fakeIpc responding:", channel, args, listeners[channel], res)
        return res
    } else {
        console.error("fakeIpc has no resposne for send:", channel)
        console.warn(listeners)
    }
}

const fakeIpc = {
    // Server sends, client reacts (registered with on)

    // FG:

    // ipcRenderer.send("RELOAD_ARCHIVE_DATA")

    send: sendSync,
    sendSync: sendSync,

    // ipcRenderer.on('ARCHIVE_UPDATE', (event, archive) => {
    // this.$root.archive = archive
    // })

    // BG:

    // ipcMain.on('RELOAD_ARCHIVE_DATA', (event) => {
    //     win.webContents.send('ARCHIVE_UPDATE', archive)
    // })
    on(channel, listener) {
        // console.warn("fakeIpc registering on event:", channel, "clobbering?", listeners[channel])
        listeners[channel] = listener
    },


    // ipcMain.handle('prompt-okay-cancel', async (event, args) => {
    //   const title = args.title || "Notice"
    //   const ok_string = args.okay || "OK"
    //   const cancel_string = args.cancel || "Cancel"
    //   const answer = dialog.showMessageBoxSync(win, {
    //     type: 'warning',
    //     buttons: [
    //       ok_string,
    //       cancel_string
    //     ],
    //     cancelId: 1,
    //     defaultId: 1,
    //     title,
    //     message: args.message
    //   })
    //   return (answer === 0)
    // })
    handle(channel, handler) {
        console.warn("fakeIpc handling:", channel, "clobbering?", listeners[channel])
        listeners[channel] = handler
        // listeners[channel] = (args) => handler(null, args)
    },


    // ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
    //   if (answer === true)
    //     this.$updateNewReader(pageId, true)

    //   message: 'Watch out! Once you disable new reader mode, major Homestuck spoilers will immediately become visible on many pages of the collection. Are you sure you want to go ahead?'
    // }
    invoke(channel, args) {
        if (listeners[channel]) {
            // console.info("invoking", channel, args, listeners[channel])
            return new Promise((resolve, reject) => {
              resolve(listeners[channel](null, args))
            });
        } else {
            console.error("fakeIpc discarding invoked channel:", channel, args)
            console.warn(listeners)
        }
    },
}

// Client invokes, server handles
var invokables = {
    'prompt-okay-cancel'(event, opts) {
        // convert prompt-okay-cancel promise to confirm promise
        const {title, message} = opts
        return confirm(message)
    },
    'steam-open'(event, opts) {
        window.open(opts, '_blank').focus()
    },
    'factory-reset'(event, opts) {
        const store = require('@/../webapp/localstore.js')
        store.delete('localData')
        window.location.reload(false);
    },
    'STARTUP_GET_INFO'(event, args) {
        return {port: undefined, appVersion: require('../package.json').version}
    },
    'set-title'(event, new_title) {
        document.title = new_title
    }
}

// Object.entries(invokables).forEach(i => fakeIpc.handle(i[0], (event, args) => i[1](args)))
Object.entries(invokables).forEach(i => fakeIpc.handle(i[0], i[1]))


module.exports = fakeIpc