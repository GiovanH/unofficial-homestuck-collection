const config = require('./vue.config.js')

const moduleNameMapper = Object.fromEntries(Object.entries(config.configureWebpack.resolve.alias)
  .map(t => [
    t[0].replace('*', '(.*)'),
    '<rootDir>' + t[1].replace('*', '$1')
  ]))

console.log(moduleNameMapper)

module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/dist_electron/"
  ],
  testMatch: [
    '**/*.test.[jt]s?(x)',
  ],
  moduleNameMapper,
  transform: {}
}