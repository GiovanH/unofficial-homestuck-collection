## Webapp

- install jq, jinja2-cli (python)
- get the webapp branch from github
- edit environment files, litepack.sh script, browser.js.j2 files to configure your asset locations and mod configuration
- use the litepack.sh script to take an APV2 and generate a webpack-version asset pack
- use the new make/just commands to test locally and publish builds
 
there are two web roots to host, one for the assets and one for the webapp ui. cdn style
webpack output goes in one, litepack.sh output (assetpackv2lite) goes on the other
litepack (called "lite" because it's designed to be able to make a smaller output file also) is necessary because some of the javascript has to be rewritten, since unlike the desktop client the webapp actually webpack builds against some asset pack files


## Legal

```text
The unofficial-homestuck-collection webapp branch is not part of the unofficial-homestuck-collection project and is NOT licensed under GPL3.

Copyright (c) GiovanH, All Rights Reserved
```
