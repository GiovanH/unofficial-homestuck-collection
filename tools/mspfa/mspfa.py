#!/bin/python3
# Run mspfa.py <story_slug> <mspfa_id>
# e.g. python3 mspfa.py "Felt" 21

import re
import json
import os
import shutil
import requests
import bs4
import yaml
import time
import urllib.parse
import logging
import difflib
import itertools
from urllib.parse import urlparse
from lib import TriadLogger

try:
    from tqdm import tqdm
except ImportError:
    def tqdm(iterator, *args, **kwargs):
        yield from iterator

class Hacks():
    swflinks = True
    swflinks_vidreplace = True

logger = None

# net.OPTION_STRIPARGS = True

# https://mspfa.com/?s=42186&p=13

# MSPFA.story
# a: The author's name
# b: Whether to show comments (0 = hide)
# c: The adventure owner's ID
# d: The creation date of the adventure in Epoch time
# e: An array of IDs of the adventure's editors
# f: An array of IDs of users who favourited the adventure and have notifications off
# g: An array of IDs of users who favourited the adventure and have notifications on
# h: The adventure's status (ongoing, inactive, complete)
# i: The adventure's ID
# j: The adventure's unverified JavaScript
# k: Whether the adventure was featured or not (hidden on unfeatured adventures)
# m: The default command used when adding a page (default: "Next.")
# n: The adventure's name
# o: The adventure's icon URL (if undefined, "/images/wat/random.njs" is used)
# p: An array of the pages
# p.d: The date that the page was uploaded in Epoch time
# p.c: The command of the page
# p.b: The body of the page
# p.n: An array of the pages that this page leads to (next commands)
# q: The URL of the adventure's feature image (unused)
# r: The adventure's description
# t: An array of the adventure's tags
# u: The date the adventure was last updated in Epoch time
# v: The adventure's verified JavaScript
# w: The author's website
# x: The URL of the adventure's banner image
# y: The adventure's CSS

RAW_FILES = {
    "y": "adventure.css",
    "j": "javascript.unverified.js",
    "v": "javascript.verified.js",
}

def bbToHTML(bbcode):
    bbcode_replacements = [
        [r'  ', "&nbsp;&nbsp;"],
        [r'\t', "&nbsp;&nbsp;&nbsp;&nbsp;"],
        [r'\n', "<br>"],
        [r'\[b\]((?:(?!\[b\]).)*?)\[\/b\]', "<span style=\"font-weight: bolder;\">\\1</span>"],
        [r'\[i\]((?:(?!\[i\]).)*?)\[\/i\]', "<span style=\"font-style: italic;\">\\1</span>"],
        [r'\[u\]((?:(?!\[u\]).)*?)\[\/u\]', "<span style=\"text-decoration: underline;\">\\1</span>"],
        [r'\[s\]((?:(?!\[s\]).)*?)\[\/s\]', "<span style=\"text-decoration: line-through;\">\\1</span>"],
        [r'\[size=(\d*?)\]((?:(?!\[size=(?:\d*?)\]).)*?)\[\/size\]', "<span style=\"font-size: \\1px;\">\\2</span>"],
        [r'\[color=("?)#?([a-f0-9]{3}(?:[a-f0-9]{3})?)\1\]((?:(?!\[color(?:=[^;]*?)\]).)*?)\[\/color\]', "<span style=\"color: #\\2;\">\\3</span>"],
        [r'\[color=("?)([^";]+?)\1\]((?:(?!\[color(?:=[^;]*?)\]).)*?)\[\/color\]', "<span style=\"color: \\2;\">\\3</span>"],
        [r'\[background=("?)#?([a-f0-9]{3}(?:[a-f0-9]{3})?)\1\]((?:(?!\[background(?:=[^;]*?)\]).)*?)\[\/background\]', "<span style=\"background-color: #\\2;\">\\3</span>"],
        [r'\[background=("?)([^";]+?)\1\]((?:(?!\[background(?:=[^;]*?)\]).)*?)\[\/background\]', "<span style=\"background-color: \\2;\">\\3</span>"],
        [r'\[font=("?)([^";]*?)\1\]((?:(?!\[size(?:=[^;]*?)\]).)*?)\[\/font\]', "<span style=\"font-family: \\2;\">\\3</span>"],
        [r'\[(center|left|right|justify)\]((?:(?!\[\1\]).)*?)\[\/\1\]', "<div style=\"text-align: \\1;\">\\2</div>"],
        [r'\[url\]([^"]*?)\[\/url\]', "<a href=\"\\1\">\\1</a>"],
        [r'\[url=("?)([^"]*?)\1\]((?:(?!\[url(?:=.*?)\]).)*?)\[\/url\]', "<a href=\"\\2\">\\3</a>"],
        [r'\[alt=("?)([^"]*?)\1\]((?:(?!\[alt(?:=.*?)\]).)*?)\[\/alt\]', "<span title=\"\\2\">\\3</span>"],
        [r'\[img\]([^"]*?)\[\/img\]', "<img src=\"\\1\">"],
        [r'\[img=(\d*?)x(\d*?)\]([^"]*?)\[\/img\]', "<img src=\"\\3\" width=\"\\1\" height=\"\\2\">"],
        [r'\[spoiler\]((?:(?!\[spoiler(?: .*?)?\]).)*?)\[\/spoiler\]', "<div class=\"spoiler closed\"><div style=\"text-align: center;\"><input type=\"button\" value=\"Show\" data-close=\"Hide\" data-open=\"Show\"></div><div>\\1</div></div>"],
        [r'\[spoiler open=("?)([^"]*?)\1 close=("?)([^"]*?)\3\]((?:(?!\[spoiler(?: .*?)?\]).)*?)\[\/spoiler\]', "<div class=\"spoiler closed\"><div style=\"text-align: center;\"><input type=\"button\" value=\"\\2\" data-open=\"\\2\" data-close=\"\\4\"></div><div>\\5</div></div>"],
        [r'\[spoiler close=("?)([^"]*?)\1 open=("?)([^"]*?)\3\]((?:(?!\[spoiler(?: .*?)?\]).)*?)\[\/spoiler\]', "<div class=\"spoiler closed\"><div style=\"text-align: center;\"><input type=\"button\" value=\"\\4\" data-open=\"\\4\" data-close=\"\\2\"></div><div>\\5</div></div>"],
        [r'\[flash=(\d*?)x(\d*?)\](.*?)\[\/flash\]', "<object type=\"application/x-shockwave-flash\" data=\"\\3\" width=\"\\1\" height=\"\\2\"></object>"],
        [r'\[user\](.+?)\[\/user\]', "<a class=\"usertag\" href=\"/user/?u=\\1\" data-userid=\"\\1\">@...</a>"]
    ]
    html = bbcode
    for (pattern, repl) in bbcode_replacements:
        html = re.sub(pattern, repl, html, flags=re.I)
    return html

# def mirrorUrlBackoff(*args, **kwargs):
#     backoff = 0
#     keepTrying = True
#     while keepTrying:
#         try:
#             return net.mirrorUrl(*args, **kwargs)
#         except requests.exceptions.HTTPError:
#             if backoff > 6:
#                 raise
#             backoff += 1
#             time.sleep(2**backoff)

def saveImageAs(story, src_url, target_name):
    directory = os.path.join(story, "img")
    os.makedirs(directory, exist_ok=True)

    ext = os.path.splitext(urlparse(src_url).path)[1]
    if "?format=jpg" in src_url:
        ext = ".jpg"
    if ext:
        target_name += ext

    outpath = os.path.join(directory, target_name)
    if os.path.isfile(outpath):
        return outpath.replace("\\", "/")

    try:
        filestream = getStream(src_url, "https://mspfa.com/")
        _saveChunked(outpath, filestream)
        return outpath.replace("\\", "/")
    except requests.exceptions.HTTPError:
        logging.error(f"Could not download file '{src_url}' to '{outpath}'", exc_info=True)
        raise

def getStream(url, prev_url=None):
    """Extremely light, dumb helper to get a stream from a url

    Args:
        url (str): Remote URL
        prev_url (str, optional): Previous url, for relative resolution

    Returns:
        Requests stream
    """
    url = urllib.parse.urljoin(prev_url, url)
    headers = {}

    # Workarounds
    if "photobucket" in url:
        headers['referer'] = "/".join(url.split("/")[:3])

    stream = requests.get(url, stream=True, headers=headers, verify=False)
    try:
        if "tinypic.com" in url:
            raise requests.exceptions.HTTPError()
        if stream.url.endswith("/404.gif"):
            raise requests.exceptions.HTTPError()
        stream.raise_for_status()
    except requests.exceptions.HTTPError as e:
        wb_url = "https://web.archive.org/web/0im_/" + url
        try:
            stream = requests.get(wb_url, stream=True, headers=headers)
            if stream.url.endswith("/404.gif"):
                raise requests.exceptions.HTTPError()
            stream.raise_for_status()
            logging.warning(f"Got '{url}' from the wayback machine", exc_info=False)
        except requests.exceptions.HTTPError:
            logging.error(f"Could not download file '{wb_url}' either:", exc_info=False)
            raise e
    return stream

def _saveChunked(path, response):
    """Save a binary stream to a path. Dumb.

    Args:
        path (str): 
        response (response): 
    """
    try:
        with open(path, 'wb') as file:
            for chunk in response:
                file.write(chunk)
    except Exception:
        # Clean up partial file
        os.unlink(path)
        raise

def swfhack(pageno, bbcode, soup):
    # Hack: Replace flash links with real flash embeds

    # Find dimensions of the video embed
    # Find links to swf files
    # Swaparooni

    swf_width = 650
    swf_height = 450
    panel_video = soup.find("video", width=True, height=True)
    if panel_video:
        swf_width = panel_video['width']
        swf_height = panel_video['height']

    for swflink in soup.find_all("a", href=re.compile(r"\.swf$")):
        logger.debug(f"swf link {swflink!r} on page {pageno}")
        swf_bbcode = f"[flash={swf_width}x{swf_height}]{swflink['href']}[/flash]"

        bbcode_pre = bbcode

        if panel_video and Hacks.swflinks_vidreplace:
            videomirror = "Mirror: " + ", ".join([
                f"[url={source['src']}]{source['type']}[/url]"
                for source in panel_video.findAll("source")
            ])
            re_video = r"<video.+?</video>"
            if re.search(re_video, bbcode, flags=re.I | re.DOTALL):
                bbcode = re.sub(re_video, f"{swf_bbcode}\n{videomirror}\n", bbcode, flags=re.I | re.DOTALL)
                if bbcode_pre == bbcode:
                    logger.warning(f"{pageno} Video replace failed? No change.")
                    bbcode = swf_bbcode + "\n" + bbcode
            else:
                logger.warning(f"{pageno} Video replace failed? Failed to match.")
                logger.debug(bbcode)
                bbcode = swf_bbcode + "\n" + bbcode

        else:
            bbcode = swf_bbcode + "\n" + bbcode

        logger.debug("Swf replacement:\n" + "\n".join(difflib.Differ().compare(
            bbcode_pre.split("\n"), 
            bbcode.split("\n")
        )) + "\n")
    return bbcode

def downloadStory(STORY_NUM, offline=True):
    global logger
    # parser.add_simple_formatter('img', '<img src=%(value)s" />')

    # curl 'https://mspfa.com/' --data-raw 'do=action&k=v'

    r = requests.request("POST", 'https://mspfa.com/', data={
        "do": "story",
        "s": str(STORY_NUM)
    })

    try:
        r.raise_for_status()
        story_resp = r.json()
    except requests.exceptions.HTTPError:
        r = requests.get(f"https://mspfa.com/?s={STORY_NUM}")
        soup = bs4.BeautifulSoup(r.text)
        story_resp = json.loads(soup.select("#maintenance-data")[0].contents[0])

    story_name = story_resp.get('n')

    logger = TriadLogger(f"{STORY_NUM}-{story_name}")

    os.makedirs(f"{story_name}", exist_ok=True)
    os.makedirs(f"{story_name}", exist_ok=True)
    json.dump(story_resp, open(f"{story_name}/story_raw.json", "w"), indent=2)

    # os.makedirs(f"{story_name}/json", exist_ok=True)
    # os.makedirs(f"{story_name}/yaml", exist_ok=True)
    # os.makedirs(f"{story_name}/html", exist_ok=True)
    os.makedirs(f"{story_name}/img", exist_ok=True)
    # os.makedirs(f"{story_name}/assets", exist_ok=True)

    # Write blank file
    open(f"{story_name}/links.txt", "w").close()
    if os.path.isfile(f"{story_name}/missing_urls.txt"):
        os.unlink(f"{story_name}/missing_urls.txt")

    # imagespool = loom.Spool(2, "Images")
    # linkspool = loom.Spool(2, "Links")

    # Thumbnail
    if story_resp['o']:
        story_resp['o'] = "assets://mspfa/" + saveImageAs(story_name, story_resp['o'], 'thumbnail')

    adv_images = {}
    page_list = list(enumerate(story_resp['p']))

    for (pageno, page) in tqdm(page_list, desc=story_name):
        pageno += 1
        page["i"] = pageno

        command = page['c']
        page_bbcode = page['b']

        html = bbToHTML(page_bbcode)
        soup = bs4.BeautifulSoup(f"<h2>{command}</h2>\n{html}", features="html.parser")

        with open(f"{story_name}/links.txt", "a", encoding="utf-8") as linklist:
            for a in soup.find_all("a", href=True):
                linklist.write(a['href'])
                linklist.write("\n")

        images = list(itertools.chain(
            [i['src'] for i in soup.find_all("img")],
            [o['data'] for o in soup.find_all("object", data=True)],
            [o['value'] for o in soup.find_all("param", attrs={'name': "movie"}, value=True)],
            [o['src'] for o in soup.find_all("source")],
        ))
        images += [
            a['href'] for a in soup.find_all("a")
            if any(a['href'].endswith(e) for e in ["swf", "mp4", "mp3", "png", "jpg", "gif", "jpeg", "webm"])
        ]

        weird_things = None 
        # soup.find_all("object", data=False)
        if weird_things:
            logger.warning(weird_things)

        if Hacks.swflinks:
            page['b'] = swfhack(pageno, page['b'], soup)

        if offline:
            for i, src in enumerate(images):
                if adv_images.get(src, False):
                    img_id = adv_images[src]
                else:
                    if len(images) <= 1:
                        img_id = f"{pageno}"
                    else:
                        img_id = f"{pageno}_{i}"

                adv_images[src] = img_id

                try:
                    outpath = "assets://mspfa/" + saveImageAs(story_name, src, img_id)
                    # Replace text in source
                    page['b'] = page['b'].replace(src, outpath)
                except requests.exceptions.HTTPError:
                    logger.warning(f"Could not replace path {img_id} in page {pageno}")
                    with open(f"{story_name}/missing_urls.txt", "a", encoding="utf-8") as linklist:
                        linklist.write(src + "\n")

    # json.dump(adv_images, open(f"{story_name}/adv_images.json", "w"))
    yaml.dump(adv_images, open(f"{story_name}/adv_images.yaml", "w"))

    # yaml.dump(story_resp, open(f"{story_name}/story_raw.yaml", "w"))

    try:
        story_resp["editors"] = [
            requests.request("POST", 'https://mspfa.com/', data={
                "do": "user",
                "u": str(editor)
            }).json()
            for editor in story_resp['e']
        ]
        for junk in ["f", "g", "e"]:
            story_resp.pop(junk)
    except Exception as e:
        logger.warn(e)

    # json.dump(story_resp, open(f"{story_name}/story.json", "w"))
    yaml.dump(story_resp, open(f"{story_name}/story.yaml", "w"))

    story_resp.pop("p")

    for key, filename in RAW_FILES.items():
        val = story_resp.pop(key)
        if val:
            with open(f"{story_name}/{filename}", "w") as fp:
                fp.write(val)

    # json.dump(story_resp, open(f"{story_name}/story_meta.json", "w"))
    yaml.dump(story_resp, open(f"{story_name}/story_meta.yaml", "w"))

    logger.info(f"{story_resp['n']}: {len(page_list)} pages")

    with open(f"{story_name}/mod.js", "w") as fp:
        fp.write(f"""module.exports = {{
  title: "{story_name}{' (online)' if not offline else ''}",
  summary: "MSPFA",
  
  edit: true,

  trees: {{
      './': 'assets://mspfa/{story_name}/',
  }},
  computed(api) {{
    return {{
      edit(archive){{
        archive.mspfa['{story_name}'] = api.readYaml("./story.yaml")
      }}
    }}
  }}
}}""")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(
        description="Render j2 templates",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('story_ids', help="Story IDs", nargs='+')
    parser.add_argument('--online', action='store_true', help="Don't download resources", default=False)
    args = parser.parse_args()
    for id_ in args.story_ids:
        downloadStory(id_, offline=(not args.online))

"""
requests.request

echo $DATA

curl 'https://mspfa.com/' -H 'content-type: application/x-www-form-urlencoded' -H 'accept: application/json' --data ${DATA} > ${STORY}.json

python3 -c "import json; for json.load(open('waterworks.json'))"
"""
