var store;

const isWebApp = ((typeof window !== 'undefined') && window.isWebApp) || false

if (!isWebApp) {
  const Store = require('electron-store')
  store = new Store()
} else {
  store = require('@/../webapp/localstore.js')
}

const new_issue_link = 'https://github.com/giovanh/unofficial-homestuck-collection/issues/new'

const error_dialog_msg = "If you think this is an error in the application, you can submit a bug report:"

// Begin webpackery

const BUILD_GIT_REVISION = process.env.BUILD_GIT_REVISION
const BUILD_GIT_REMOTE = process.env.BUILD_GIT_REMOTE
const BUILD_DATE = process.env.BUILD_DATE
const BUILD_PLATFORM = process.env.BUILD_PLATFORM
const BUILD_BRANCH = process.env.BUILD_BRANCH

function buildReportBody(error, versions) {
  versions = {
    ...versions,
    BUILD_BRANCH,
    BUILD_GIT_REMOTE,
    BUILD_GIT_REVISION,
    BUILD_DATE,
    BUILD_PLATFORM
  }
  if (typeof process !== 'undefined') {
    versions['Architecture'] = process.arch
    versions['Platform'] = process.platform
  }

  const versions_str = Object.entries(versions)
    .map(kv => `- ${kv[0]}: ${kv[1]}`)
    .join('\n')

  var body = `
Before reporting a bug:
- Read the FAQ: https://homestuck.giovanh.com/unofficial-homestuck-collection/faq.html
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

**Versions**
${versions_str}

`
  if (error) {
    body += `**Stacktrace**

\`\`\`text
${error.message}

${error.stack}
\`\`\`
`
  }
  body += `**Settings**

\`\`\`text
${JSON.stringify(store.get('settings'), null, 2)}
\`\`\`

**Additional context**
Add any other context about the problem here.
`
  return body
}

function createIssueLink(versions, error) {
  const url = new URL(new_issue_link)
  url.search = new URLSearchParams({
    body: buildReportBody(error, versions)
  })
  return url
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
  // throw Error('Render report test')
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
  // throw Error('Main report test')
}

export default {
  registerRenderLogger,
  registerMainLogger,
  createIssueLink,
  buildReportBody
}
