# Streams from smip library

# from contextlib import contextmanager
# from string import Formatter
# from sys import argv
# import shutil
# import os

import logging

def timestamp():
    """Just give a human-readable timestamp.
    Format is %Y-%m-%d %I:%M%p, i.e. "2018-01-02 9:12 PM"

    Returns:
        str: Timestamp
    """
    import datetime

    return datetime.datetime.now().strftime("%Y-%m-%d %I:%M%p")

def makeLogHandler(base, level, format_string):
    h = base
    h.setLevel(level)  
    h.setFormatter(logging.Formatter(format_string, "%Y-%m-%d %H:%M:%S"))
    return h


active_log_handlers = {}


def TriadLogger(__name, stream=True, file=True, debug=True, retries=0):
    global active_log_handlers
    
    logger = logging.getLogger(__name)
    logger.setLevel(logging.DEBUG)

    progname = __name
    if retries > 0:
        if retries > 20:
            raise Exception("Cannot open logfile! Too many instances open?")
        progname = f"{progname}{retries}"

    filepath_normal = f"{progname}_latest.log"
    filepath_debug = f"{progname}_latest_debug.log"

    try:

        if stream:
            if not active_log_handlers.get("stream"):
                active_log_handlers["stream"] = makeLogHandler(logging.StreamHandler(), logging.INFO, '[%(name)s] %(levelname)s: %(message)s')
            logger.addHandler(active_log_handlers["stream"])
        
        if file:
            if not active_log_handlers.get("file"):
                active_log_handlers["file"] = makeLogHandler(logging.FileHandler(filepath_normal, mode="w"), logging.INFO, '%(asctime)s [%(name)s] %(levelname)s: %(message)s')
            logger.addHandler(active_log_handlers["file"])

        if debug:
            if not active_log_handlers.get("file_debug"):
                active_log_handlers["file_debug"] = makeLogHandler(logging.FileHandler(filepath_debug, mode="w", encoding="utf-8"), logging.DEBUG, '%(asctime)s [%(name)s] %(levelname)s: %(message)s')
            logger.addHandler(active_log_handlers["file_debug"])

        return logger

    except PermissionError:
        print(f"'{filepath_normal}' is busy(?), incrementing")
        return TriadLogger(__name, stream=stream, file=file, debug=debug, retries=(retries + 1))

