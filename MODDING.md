# Modding API

This document is a draft and may or may not represent the final API **or** the current development implementation. See [issues](https://github.com/Bambosh/unofficial-homestuck-collection/issues/43) for discussion. 

Implementation of the modding API can be found at or near [`/src/mods.js`](https://github.com/Bambosh/unofficial-homestuck-collection/blob/develop/src/mods.js)

## Basic Overview

### Writing mods

Mods can be written according to the [API specification](#API-specification) below.

...

### Distributing mods

Mods should be distributed as either single-file `.js` scripts or as compressed archives containing a mod folder. 

...

### Installing mods

A single-file mod with the filename `mymod.js` should be installed in the form

`{asset folder}/mods/mymod.js`

A mod folder with the folder name `mybigmod` should be installed in the form

`{asset folder}/mods/mybigmod/` such that the file `{asset folder}/mods/mybigmod/mod.js` exists. 

Archives like `.zip` or `.7z` files are *not* recognized as mods and need to be extracted as per the above.

### Using mods

Installed mods will be available in the `SETTINGS` page (jump `/settings`), under the header **Mod Settings**. Detailed instructions will be available there.

## API specification

As per [Installing mods](#installing-mods) above, there are two forms of mods: single-file scripts and mod folders. 

Single-file js scripts behave much the same as standard mods, but they do not have a folder to scope and thus cannot reference local files. As such, the `routes` and `treeroute` interfaces are not available in singlefile mods. 

The rest of this specification will be built around the mod folder structure, with the understanding that single-file mods have a subset of the same functionality. 

Names in `module.exports` are exposed directly to the modding API, and are the meat of your mod. You can put other sub functionality in your js file, but your `exports` variable is what interfaces with the main collection. 

### Metadata

These are basic metadata attributes used in the settings screen for user selection. These are all required.

- `title` (string): The title of your mod. This should be as short as possible while being recognizable. 
- `desc` (string): A longer description of your mod and its basic functions
- `author` (string): The name of the person or group who authored the mod.
- `modVersion` (number): A javascript number specifying the version of the mod. This may be used for update checking, so this number should strictly increase with subsequent releases.
- `locked` (string, optional): If your mod's name or description are spoilers, or if your mod unlocks spoiler content in some way, the mod will be hidden until the reader reaches this MSPA page number. For instance, use `"001901"` to unlock once the reader starts reading Homestuck.

While are free to define your own names internally, you should not use names starting with an underscore (`_data`, for instance) as these may be overridden without warning.

### `edit()`

The `edit()` function is the main way mods should edit data in the archive. When your mod is loaded, `yourmod.edit(archive)` is called with the entire archive passed by reference. `edit` can edit that object arbitrarily. The return value of `edit()` is ignored.

Examples:

```js
edit(archive) {
    archive.mspa.story['001901'].content = `A young man stands in his bedroom. It just so happens that today, the 13th of April, is this young man's birthday. 
        Though it was thirteen years ago he was given life, it is only today he will be given a name!
        <br /><br />
        What will the name of this young man be?`
}
```

This replaces the `content` of page `001901` with a new block of HTML (here, the original date, without the year specified.) This clobbers any data previously in `content`, including modifications other mods may have made, and should be avoided. A better way to do this same operation would be:

```js
edit(archive) {
    archive.mspa.story['001901'].content = 
        archive.mspa.story['001901'].content.replace(
            "the 13th of April, 2009, ", 
            "the 13th of April, "
        )
}
```

Here, the specific phrase "the 13th of April, 2009, " is replaced, and any other text in `content` is left to pass through. 

### Routes

An obvious use for modding is replacing files and images with new ones you provide. **If the image is a new one you're adding, you do not need to use `edit()` for this**. A naive way to replace the first image of Homestuck, for example, would be this:

```js
edit(archive) {
    archive.mspa.story['001901'].media = [
        "/some/new/path/here/mymod/mynew.gif"
      ]
}
```

However, there isn't a good way to construct `/some/new/path/here`. 

Instead, you should use the **Routes** system. Instead of telling the collection to change `['001901'].media` image to `mynew.gif`, you can tell the collection to *route* `"/storyfiles/hs2/00001.gif"` to `mymod/mynew.gif`. 

The syntax is a simple key/value mapping, where keys are asset paths (prefixed with the protocol "assets://" in place of your assets directory) and the values are local file paths. 

`trees`: `Map<AssetPath(String), LocalPath(String)>`

So, to write our first-panel replacement mod, we would simply need the following:

```
mymod/
mymod/mynew.gif
mymod/mod.js
```

And in `/mymod/mod.js`

```js
routes: {
    'assets://storyfiles/hs2/00001.gif': './file.gif'
}
```

Note that `./` here means a local path relative to your mod folder. 

With this enabled, any time any story page references that file, your file is substituted in place. You can think of this as something akin to Docker volume mapping, but much simpler.

In the above example, we replace a panel already in the collection with one we provide. But what if we want to redirect it to a file already in the collection? This is easy:

```js
routes: {
    'assets://storyfiles/hs2/00001.gif': 'assets://storyfiles/hs2/00002.gif'
}
```

Just reroute the first file's path to another's. (Note that it is possible to use this syntax to create an infinite loop, which the collection will detect and treat as an error.)

### Treeroutes

You might have a case where you want to patch a large number of files at once without manually typing in each route pair yourself. While it is entirely legal to programatically generate your own `routes` object, there is a convenience system to handle this for you: **Treeroutes**

Treeroutes build a `routes` object for you using an entire folder tree. This has the effect of a traditional patch done with a simple folder merge. 

`trees`, like routes, is a key/value mapping, but it maps *local folders* to logical folder routes.

`trees`: `Map<LocalPath(String), AssetPathDirectory(String)>` (note that this is not parallel with `routes`)

Example:

Given a mod directory structure

```
damara/
damara/mod.js
damara/dialogs/
damara/dialogs/damaraDialog.xml
damara/dialogs/daveDialog.xml
damara/dialogs/subfolder/subfile.xml
...
```

A `mod.js` with

```js
trees: {
    "./dialogs/": "assets://storyfiles/hs2/05395/levels/openbound_p3/dialogs/"
}
```

would be the same as specifying

```js
routes: {
    'assets://storyfiles/hs2/05395/levels/openbound_p3/dialogs/': './dialogs/damaraDialog.xml',
    'assets://storyfiles/hs2/05395/levels/openbound_p3/dialogs/': './dialogs/daveDialog.xml',
    'assets://storyfiles/hs2/05395/levels/openbound_p3/dialogs/subfolder': './dialogs/subfolder/subfile.xml'
    ...
}
```

SPECIAL CASE: If your treeroute maps the whole asset folder is in the form of

```js
trees: {
    "./[mytree]/": "assets://"
}
```

you can use the shorthand

```js
treeroute: "./[mytree]/"
```

with the same effect.

### `styles`

Mods can inject custom CSS into the whole app. `styles` declares a list of local css files to be injected.

`styles`: `List<LocalPath(String)>`

```js
styles: [
    "./test.css"
]
```

Specific page/context selectors should be included in the CSS file.

### Footnotes

Mods can add to the global library of footnotes (which is empty, by default) by defining their `footnotes` field. Each footnote has HTML content and an author name. Any given page can have any number of footnotes. 

The `footnotes` object is constructed accordingly:

`footnotes`: `List<FootnotesScope>`

`FootnotesScope` is your main object to manipulate. It has fields

- `author` (string): The author of the footnote. Note that this is not necessarily the author of the mod.
- `class` (string, optional): A custom CSS class the footnote container will inherit. Use this if you want to do custom styling.
- `preface` (bool, optional): If set to `true`, notes will appear before pages instead of after them.
- `footnotes`: `Map<PageNum, List<Note>>`

Individual notes are as follows:

- `content` (string): The actual content of the footnote. This can include HTML including formatting tags. Be sure to escape HTML if you're defining it in JSON.
- `author` (string, optional): An explicitly defined author for this particular note. This does not need to be set and will inherit from the `FootnotesScope` if note defined.
- `class` (string, optional): An explicitly defined class for this particular note. This does not need to be set and will inherit from the `FootnotesScope` if note defined.
- `preface` (bool, optional): An explicitly defined preface-state for this particular note. This does not need to be set and will inherit from the `FootnotesScope` if note defined.

So, putting that all together, here is a valid footnotes object:

```json
[{
  "author": "Default author",
  "footnotes": {
    "001901": [{
      "content": "Footnote <i>html content</i>"
    },{
      "content": "Footnote <i>author</i>",
      "author": "Author override"
    },{
      "content": "Footnote <i>class</i>",
      "class": "css-override"
    },{
      "content": "Footnote <i>force clear author</i>",
      "author": null
    }],
    "001902": [{
      "content": "Footnote <b>a2</b>",
      "author": "username_a2",
      "class": "css_a2"
    }],
    "001903": [
      {"content": "Footnote <b>a3a</b>"},
      {"content": "Footnote <b>a3b</b>"}
    ]
  }
}]
```

Optionally, your `footnotes` field can instead be set to a string, which will be treated as a local json path to a `footnotes` object, which will be loaded. E.g.

```js
    footnotes: "./footnotes.json"
```

Aside: Internally, there is no such thing as a `FootnoteScope`. Instead the parser constructs explicit maps of footnotes, computing inheritance at load time.

### Vue Hooks

Vue hooks are the most complicated and the most powerful method of modifying the collection, and modify the Vue.js pages directly using mixins. 

`vueHooks`: `List<VueHook>`

Each `VueHook` has the following properties:

- `match(t)` (function): Gets the page's vue `this` object as an argument. Should return `true` if this hook is relevant for the page, and should not mutate state.
- `matchName` (string, optional): Shorthand for `match(c) {return c.$options.name == "pageText"}`. Helpful for matching specific `.vue` files by name. Do not define both a `matchName` and a `match(t)` function in the same VueHook.
- `computed` (optional): The `computed` object is a collection of functions that are used to override the page's existing `computed` values. **Unlike `vue`'s computed**, these functions take a `$super` argument that contains the *previous* result of the computation. 
- `data` (optional): The `data` object is a collection of objects and functions. Objects in `data` are merged with the `data` function of the vue page, overriding any previous data. Functions in the `data` object take a `$super` argument that contains any previous data from that name, and should return a modified or replaced version of that object.

Examples of VueHooks:

```js
vueHooks: [{
    match(c) {return c.$options.name == "pageText"},
    computed: {
        logButtonText($super) {
            return "MOD " + $super()
        }
    }
}
```

This hooks the `pageText` vue page, which contains the spoiler button logic. It adds the word "MOD" before any log button text, so pages will read "MOD Show Pesterlog" or "MOD Hide Pesterlog". This demonstrates user of the `$super` argument within `computed`.

```js
vueHooks: [{
    matchName: "navBanner",
    data: {
        urls: [
            [ "/"
            ],
            [ "https://www.homestuck.com",
              "toggleJumpBox"
            ],
            [ "/map",
              "/log",
              "/search"
            ],
            [ "toggleBookmarks"
            ],
            [ "/settings",
              "/credits"
            ]
        ],
        labels($super){
            let labels = $super
            labels['']["https://www.homestuck.com"] = "VIZ"
            labels['']["/"] = "HOMESTUCK"
            return labels
        }
    },
}]
```

This hook uses the `matchName` shorthand to match the `navBanner` page, which is the top navigation bar. 

It replaces the underlying `url` object with a new one, discarding any data that was previously there. It also replaces the `labels`, but this time it only modifies the two labels relevant to the change, again using the `$super` syntax.

