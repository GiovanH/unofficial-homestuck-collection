# MSPFA

This is a python script to build a mod with an offline archive of a MSPFA fan adventure by downloading it from the mspfa website.

To run, install the requirements with
`python3 -m pip install -r requirements`

then run the script with
`python3 mspfa.py`

Run `python3 mspfa.py --help` for usage.

```text
usage: mspfa.py [-h] [--dirname DIRNAME] [--no-swfhack] [--online] story_ids [story_ids ...]

Download an adventure and its prereqs from mspfa, formatted as a UHC mod

positional arguments:
  story_ids          Story IDs

options:
  -h, --help         show this help message and exit
  --dirname DIRNAME  Manual value for the folder path instead of using the adventure name (default: None)
  --no-swfhack       Disable SWF conversion hack (default: False)
  --online           Don't download resources or replace links within story (default: False)
```
