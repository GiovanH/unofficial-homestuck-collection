#!/bin/python3

import bs4
import glob
import os
import itertools
import re
import json
import ruamel.yaml


yaml = ruamel.yaml.YAML()

epilogues = {}

html_root = "J:/Homestuck/Epilogues/www.homestuck.com/epilogues/"

os.makedirs('epilogues', exist_ok=True)


def _str_presenter(dumper, data):
    TAG_STR = 'tag:yaml.org,2002:str'
    return dumper.represent_scalar(TAG_STR, data, style='|')

yaml.representer.add_representer(str, _str_presenter)


class blockstr(str):
    pass

yaml.representer.add_representer(blockstr, _str_presenter)

def extract(html_path, cat_name, page_name):
    out_name = f"epilogues/{cat_name}_{page_name}.html"
    print(out_name, cat_name, page_name)

    with open(html_path, 'rb') as fp:
        soup = bs4.BeautifulSoup(fp, features='lxml')

    rows = soup.select('body.epilogue div.row.bg-white.bg-light-gray--md')
    for elem in rows:
        for bullet in itertools.chain(
                soup.select('.hsep_bullet', src=True),
                soup.select('img', src=True)
        ):
            bullet['src'] = re.sub(r"^/assets/epilogues/(.+?_[0-9]+x[0-9]+)-.+.png", r"assets://archive/epilogues/resources/\1.png", bullet['src'])
        for no in itertools.chain(
                soup.select('script'),
                soup.select('#gamenav-container')
        ):
            no.extract()

    epilogues[cat_name][page_name] = blockstr('\n'.join(map(str, rows)))


for cat in glob.glob(os.path.join(html_root, "*/")):
    cat_name = os.path.basename(os.path.dirname(cat))
    epilogues[cat_name] = {}
    for html_path in glob.glob(os.path.join(cat, "*")):
        page_name = os.path.basename(html_path)
        extract(html_path, cat_name, page_name)

extract(os.path.join(html_root, 'prologue.html'), 'prologue', '0')



with open('epilogues.yaml', 'w', encoding='utf-8') as fp:
    yaml.dump(epilogues, fp)
