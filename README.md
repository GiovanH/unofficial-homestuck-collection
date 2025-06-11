![The Unofficial Homestuck Collection](src/assets/collection_logo.png)

Homepage: <https://homestuck.giovanh.com/unofficial-homestuck-collection/>

---

Let me tell you a story about a webcomic called *Homestuck*. The fourth in a series of “MS Paint Adventures” authored by Andrew Hussie from 2007 to 2016, it became wildly successful, in part because of its eclectic use of web technology like Adobe Flash and GIF animations.

However, with Flash finally being phased out at the end of 2020, *Homestuck* is in a precarious state. While there have been official attempts to preserve aspects of the original experience by VIZ Media (who have published *Homestuck* since 2018), the results have been mixed. With extra content scattered around the web in various states of decay, a solution was needed to preserve *Homestuck's* one-of-a-kind presentation and flair, for both returning readers and those new to the story.

This is the repository for a self-contained collection that contains Homestuck (with Flash elements fully intact), the other MS Paint Adventures, official Homestuck side-stories, and a variety of goodies for the enquiring reader, as well as a variety of unintrusive enhancements to the overall presentation, both for quality and convenience.

To run The Unofficial Homestuck Collection, you need to pair this application with a pack of assets designed specifically to integrate with it. A decent amount of effort has been made to keep this repository free from the majority of that copyrighted content, and (at least for now), it won't contain a link to the place you can find it.

## Some details on the codebase

This application runs entirely in Electron + Vue, with very little else going on. Although it functions in a manner very similar to a web browser, everything is running in what I would charitably describe as a "creative" fashion. I am by no means an expert, and while I'd love to say I always had good practices in mind while developing this, I largely didn't even know what a good practice *was* for a decent chunk of it.

So what I'm saying is this: You're welcome to peruse the codebase, fork it, make and suggest changes, or use it in any way you see fit. Just uh... don't expect it to be well formed or documented in any of the ways that really count. If you want to make some changes and my code is causing you physical discomfort, [try asking around our Discord server.](https://discord.gg/43QHASFC2X) Someone should be able to help out!

Building a development version of TUHC requires NPM (Node 14.18), Yarn, `make`, and `tar`.

- NPM is the node package manager, used for developing with Node.js.
- [Yarn](https://www.npmjs.com/package/yarn) is a npm-like package manager that is itself distributed as an NPM package.
- `tar` and `make` are basic GNU utilities used extremely commonly in software development. `tar` is used to pack files (like zip) and `make` is used to build projects with dependencies. If you don't already have them on your system (you can maintain robust CLI environments using tools like [cygwin](https://www.cygwin.com) or [WSL](https://docs.microsoft.com/en-us/windows/wsl/install)), you can download [`tar`](http://gnuwin32.sourceforge.net/packages/gtar.htm) and [`make`](https://www.gnu.org/software/make/) individually directly from GNU.

## Legal

<pre>The Unofficial Homestuck Collection
Copyright (C) 2025 GiovanH

This program is free software: you can redistribute it and/or modify
it under the terms of the <a href="https://www.gnu.org/licenses">GNU General Public License</a> as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
</pre>

As per section 7, an additional requirement of this license is that all attribution and crediting must be preserved. Modifications that remove
attribution or otherwise misrepresent the authorship or origin of material
are not permitted and violate the license conditions. 

---

In (non legally-binding) summary, you may freely use and distribute the software, as well as modify it and distribute your changes and modified versions, so long as you do not restrict the rights of others to do the same. You must clearly notate any changes and provide links to the unmodified original, and not remove credits.
