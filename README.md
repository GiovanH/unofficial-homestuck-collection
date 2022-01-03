![The Unofficial Homestuck Collection](src/assets/collection_logo.png)

Let me tell you a story about a webcomic called *Homestuck*. The fourth in a series of “MS Paint Adventures” authored by Andrew Hussie from 2007 to 2016, it became wildly successful, in part because of its eclectic use of web technology like Adobe Flash and GIF animations.

However, with Flash finally being phased out at the end of 2020, *Homestuck* is in a precarious state. While there have been official attempts to preserve aspects of the original experience by VIZ Media (who have published *Homestuck* since 2018), the results have been mixed. With extra content scattered around the web in various states of decay, a solution was needed to preserve *Homestuck's* one-of-a-kind presentation and flair, for both returning readers and those new to the story.

This is the repository for a self-contained collection that contains Homestuck (with Flash elements fully intact), the other MS Paint Adventures, official Homestuck side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience.

To run The Unofficial Homestuck Collection, you need to pair this application with a pack of assets designed specifically to integrate with it. A decent amount of effort has been made to keep this repository free from the majority of that copyrighted content, and (at least for now), it won't contain a link to the place you can find it.

## Some details on the codebase

This application runs entirely in Electron + Vue, with very little else going on. Although it functions in a manner very similar to a web browser, everything is running in what I would charitably describe as a "creative" fashion. I am by no means an expert, and while I'd love to say I always had good practices in mind while developing this, I largely didn't even know what a good practice *was* for a decent chunk of it.

So what I'm saying is this: You're welcome to peruse the codebase, fork it, make and suggest changes, or use it in any way you see fit. Just uh... don't expect it to be well formed or documented in any of the ways that really count. If you want to make some changes and my code is causing you physical discomfort, hit me up on Discord at `Bambosh#1025`. I'll do my best to help talk it through with you!
          
### Compiles and hot-reloads for development
```
make test
```

### Compiles and minifies for production
```
make publish
```

### Lints and fixes files
```
make lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
