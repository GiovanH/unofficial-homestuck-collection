#!/bin/python

import re
import sys

def findHomerowRepls(searchstr):
    # Page spoilers
    matches = re.finditer(r'''(?P<ind>[ ]*)<div class=\"rowItem (?P<class>\w+?)\" v-if=\"\!\$pageIsSpoiler\(['\"](?P<spoil>.+?)['\"]\)\">
[ \n]*<a class=\"thumbnail\" href=\"(?P<href>.+?)\"><Media url=\"(?P<thumbsrc>.+?)\"/></a>
[ \n]*<div class=\"description\">
[ \n]*<h2><a href=\".+?\">(?P<title>.+?)</a></h2>
[ \n]*<p class=\"date\">(?P<date>.+?)</p>
[ \n]*<p>(?P<body>(.|\n)+?)</p>
[ \n]*</div>
[ \n]*</div>''', searchstr)
    # print(list(matches))
    for match in list(matches):
        src = match.group(0)
        print(repr(src))
        repl = """{ind}<HomeRowItem
{ind}  class="rowItem"
{ind}  href="{href}"
{ind}  thumbsrc="{thumbsrc}"
{ind}  afterpage="{spoil}"
{ind}  date="{date}">
{ind}  <template v-slot:title>{title}</template>
{ind}  <p>{body}</p>
{ind}</HomeRowItem>""".format(**match.groupdict())
        print(repr(src), "->", repr(repl))
        searchstr = searchstr.replace(src, repl)

    # New reader spoilers
    matches = re.finditer(r'''(?P<ind>[ ]*)<div class=\"rowItem (?P<class>\w+?)\" v-if=\"\!\$isNewReader\">
[ \n]*<a class=\"thumbnail\" href=\"(?P<href>.+?)\"><Media url=\"(?P<thumbsrc>.+?)\"/></a>
[ \n]*<div class=\"description\">
[ \n]*<h2><a href=\".+?\">(?P<title>.+?)</a></h2>
[ \n]*<p class=\"date\">(?P<date>.+?)</p>
[ \n]*<p>(?P<body>(.|\n)+?)</p>
[ \n]*</div>
[ \n]*</div>''', searchstr)
    # print(list(matches))
    for match in list(matches):
        src = match.group(0)
        print(repr(src))
        repl = """{ind}<HomeRowItem
{ind}  class="rowItem"
{ind}  href="{href}"
{ind}  thumbsrc="{thumbsrc}"
{ind}  afterpage="010030"
{ind}  date="{date}">
{ind}  <template v-slot:title>{title}</template>
{ind}  <p>{body}</p>
{ind}</HomeRowItem>""".format(**match.groupdict())
        print(repr(src), "->", repr(repl))
        searchstr = searchstr.replace(src, repl)

    # Non spoilers
    matches = re.finditer(r'''(?P<ind>[ ]*)<div class=\"rowItem (?P<class>\w+?)\">
[ \n]*<a class=\"thumbnail\" href=\"(?P<href>.+?)\"><Media url=\"(?P<thumbsrc>.+?)\"/></a>
[ \n]*<div class=\"description\">
[ \n]*<h2><a href=\".+?\">(?P<title>.+?)</a></h2>
[ \n]*<p class=\"date\">(?P<date>.+?)</p>
[ \n]*<p>(?P<body>(.|\n)+?)</p>
[ \n]*</div>
[ \n]*</div>''', searchstr)
    # print(list(matches))
    for match in list(matches):
        src = match.group(0)
        print(repr(src))
        repl = """{ind}<HomeRowItem
{ind}  class="rowItem"
{ind}  href="{href}"
{ind}  thumbsrc="{thumbsrc}"
{ind}  :afterpage="null"
{ind}  date="{date}">
{ind}  <template v-slot:title>{title}</template>
{ind}  <p>{body}</p>
{ind}</HomeRowItem>""".format(**match.groupdict())
        print(repr(src), "->", repr(repl))
        searchstr = searchstr.replace(src, repl)

    # Done
    return searchstr


with open(sys.argv[1], "r", encoding="utf-8") as fp:
    searchstr = fp.read()

# findRepls(searchstr)
with open(sys.argv[1], "w", encoding="utf-8") as fp:
    fp.write(findHomerowRepls(searchstr))


