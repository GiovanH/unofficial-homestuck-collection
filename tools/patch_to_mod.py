import argparse
import json
import difflib
# import pprint
import itertools
import re
import traceback

def getArgs():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("patch")
    arg_parser.add_argument("base")
    arg_parser.add_argument("--root", default="mspa", help="root object, defaults mspa")
    return arg_parser.parse_args()

def get_difference(obj_1: dict, obj_2: dict, stack="archive") -> dict:
    result = {}

    for key in obj_1.keys():
        value = obj_1[key]
        other_value = obj_2.get(key)

        if isinstance(value, dict):
            difference = get_difference(value, obj_2.get(key, {}), stack=f"{stack}.{key}")

            if difference:
                result[key] = difference

        elif isinstance(value, list):
            if value != other_value:
                result[key] = other_value
                result[f"{key}_old"] = value

        elif value != other_value:
            result[key] = other_value

    return result

def jsSubscript(key):
    # can be optimized for strings
    try:
        if isinstance(key, str) and re.match(r"^[a-z]+$", key):
            return f".{key}"
    except:
        # print(key)
        raise
    return f"[{key!r}]"

def getValueReplacements(value, other_value):
    if isinstance(value, str) and isinstance(other_value, str):
        seperators = r"(?:<br ?/>)|(?:\n)"
        seq_a = [*filter(bool, re.split(seperators, value)), None]
        seq_b = [*filter(bool, re.split(seperators, other_value)), None]
        i = 0
        j = 0
        while True:
            if i >= len(seq_a):
                break
            if j >= len(seq_b):
                break
            if seq_a[i] == seq_b[j]:
                i += 1
                j += 1
            else:
                # print(seq_a, seq_b, i, j)
                if (i + 1 < len(seq_a) and j + 1 < len(seq_b)):
                    i2 = i + 1
                    # Try to match just after i
                    for j2 in range(j, len(seq_b)):
                        # print("i", i2, j2, repr(seq_a[i2]), repr(seq_b[j2]))
                        if seq_a[i2] == seq_b[j2]:
                            t = ('<br />'.join(seq_b[j:j2]), '<br />'.join(seq_a[i:i2]))
                            # print("i lookahead match", t)
                            yield t
                            i = i2 + 1
                            j = j2 + 1
                            continue
                    if i == i2 + 1:
                        # If matched, continue.
                        continue
                    j2 = j + 1
                    # Try to match just after j
                    for i2 in range(i, len(seq_a)):
                        # print("j", i2, j, repr(seq_a[i2]), repr(seq_b[j2]))
                        if seq_a[i2] == seq_b[j2]:
                            t = ('<br />'.join(seq_b[j:j2]), '<br />'.join(seq_a[i:i2]))
                            # print("j lookahead match", t)
                            yield t
                            i = i2 + 1
                            j = j2 + 1
                            continue
                    if j == j2 + 1:
                        # If matched, continue.
                        continue
                t = (seq_b[i], seq_a[j])
                # print("no-lookahead match", t)
                yield t
                i += 1
                j += 1
    else:
        yield (other_value, value)

def get_replacements(obj_1: dict, obj_2: dict, stack=[]):
    if isinstance(obj_1, dict):
        iterator = obj_1.items()
    elif isinstance(obj_1, list):
        iterator = enumerate(obj_1)

    for key, value in iterator:
        mystack = [*stack, key]

        if isinstance(obj_1, dict):
            other_value = obj_2.get(key)
        elif isinstance(obj_1, list):
            try:
                other_value = obj_2[key]
            except IndexError:
                # print(key)
                # print("o1", repr(obj_1)[:80])
                # print("o2", repr(obj_2)[:80])
                raise

        if isinstance(value, dict):
            yield from get_replacements(value, other_value or {}, stack=mystack)

        elif isinstance(value, list):
            if value != other_value:
                try:
                    yield from get_replacements(value, other_value or [], stack=mystack)
                except IndexError:
                    # print(key)
                    # print("o1", repr(obj_1)[:80])
                    # print("o2", repr(obj_2)[:80])
                    # print(" v", repr(value)[:80])
                    # print("ov", repr(other_value)[:80])
                    yield (mystack, other_value, value)

        elif value != other_value:
            for t in getValueReplacements(value, other_value):
                yield (mystack, *t)

def main():
    args = getArgs()
    # print(args)
    with open(args.patch, "r", encoding="utf-8") as fp:
        patch = json.load(fp)

    with open(args.base, "r", encoding="utf-8") as fp:
        base = json.load(fp)

    diff = get_difference(patch, base)

    with open("args.out", "w", encoding="utf-8") as fp:
        json.dump(diff, fp, indent=2)

    # with open("edit.js", "w", encoding="utf-8") as fp:
    #     fp.write("\n".join(js))

    with open("edit2.js", "w", encoding="utf-8") as fp:
        # There's some potential for more optimization here by grouping the stacks more heavily
        # i.e. t => archive.mspa.story[t[0]].content = archive.mspa.story[t[0]].content.replace(t[1], t[2])
        # ...except we don't know that everything is in a magic subscriptable `story` object.

        for stack, group in itertools.groupby(get_replacements(patch, base), lambda t: t[0]):
            js_stack = ([f"archive.{args.root}"] + [jsSubscript(k) for k in stack])
            js_stack_key = js_stack[-1]
            js_stack_pre = ''.join(js_stack[:-1])
            js_stack = ''.join(js_stack)
            group = list(group)

            if len(group) == 1:
                # Single replacement for this key
                for stack_, value, repl in group:
                    if value is None:
                        continue

                    # print(js_stack, js_stack_pre, js_stack_key)
                    if js_stack_key == ".content":
                        if not isinstance(repl, list):
                            fp.write(f"\"{stack[-2]}\": {{\n  pat:  {value!r}, \n  repl: {repl!r}}},\n")
                        else:
                            raise NotImplementedError(repl)
                    else:
                        if isinstance(repl, list):
                            fp.write(f"{js_stack} = {repl!r}\n")
                        else:
                            fp.write(f"{js_stack} = {js_stack}.replace(\n  {value!r}, \n  {repl!r})\n")
            else:
                # Chain multiple replacements
                lists = []
                for stack_, value, repl in group:
                    if value is None:
                        continue
                    lists.append([value, repl])
                if js_stack_key == ".content":
                    fp.write(f"\"{stack[-2]}\": ")
                    fp.write("[\n" + ', '.join(f"{{\n  pat:  {value!r}, \n  repl: {repl!r}\n}}" for (value, repl) in lists) + "],\n")
                else:
                    fp.write('// {}\n{{'.format(js_stack) + f"{json.dumps(lists, indent=2)}.forEach(t => ({js_stack} = {js_stack}.replace(t[0], t[1])))" + "}\n")


if __name__ == "__main__":
    main()
