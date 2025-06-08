var store;
if (!window.isWebApp) {
  const Store = require('electron-store')
  store = new Store()
} else {
  store = require('@/../webapp/localstore.js')
}

const new_issue_link = 'https://github.com/giovanh/unofficial-homestuck-collection/issues/new'

const error_dialog_msg = "If you think this is an error in the application, you can submit a bug report:"

function buildReportBody(error, versions) {
  return `
Before reporting a bug:
- Read the FAQ: https://bambosh.dev/unofficial-homestuck-collection/faq.html
- Make absolutely sure your exact issue hasn't already been identified in the pinned issue list
- Search the issues to see your problem is already being tracked.
- See if the issue has already been fixed in the latest prerelease build
- See if the issue has already been fixed in the \`develop\` branch (if possible)

Don't leave this section in your post.

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - Program version: \`${versions.app}\`
 - OS: \`${versions.os}\`
 - Asset Pack Version:

**Stacktrace**

\`\`\`text
${error.message}

${error.stack}
\`\`\`

**Settings**

\`\`\`text
${store.get('settings')}
\`\`\`

**Additional context**
Add any other context about the problem here.
`
}

function registerRenderLogger(log) {
  const ipcRenderer = require('electron').ipcRenderer
  log.catchErrors({
    showDialog: false,
    onError(error, versions, submitIssue) {
      const args = {
        title: 'An error occurred',
        message: `Uncaught error: '${error.message}'`,
        detail: error_dialog_msg,
        okay: "Report",
        cancel: "Ignore"
      }
      ipcRenderer.invoke('prompt-okay-cancel', args).then(answer => {
        if (answer === true) {
          submitIssue(new_issue_link, {
            title: `Render error: ${error.message}`,
            body: buildReportBody(error, versions)
          })
        }
      })
    }
  })
}

function registerMainLogger(log) {
  const electron = require('electron')
  log.catchErrors({
    showDialog: false,
    onError(error, versions, submitIssue) {
      electron.dialog.showMessageBox({
        title: 'An error occurred',
        message: `Uncaught error: '${error.message}'`,
        detail: error_dialog_msg,
        type: 'error',
        buttons: ['Report', 'Ignore']
      })
        .then((result) => {
          if (result.response === 1) {
            submitIssue(new_issue_link, {
              title: `Electron error: ${error.message}`,
              body: buildReportBody(error, versions)
            })
            return
          }
        })
    }
  })
}

export default {
  registerRenderLogger,
  registerMainLogger
}
