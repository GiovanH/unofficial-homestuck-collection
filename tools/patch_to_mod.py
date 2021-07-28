import argparse
import json
import difflib
import pprint
import itertools
import re

def getArgs():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("patch")
    arg_parser.add_argument("base")
    arg_parser.add_argument("--out", default="diff.json")
    arg_parser.add_argument("--diff", action="store_true")
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
    if re.match(r"^[a-z]+$", key):
        return f".{key}"
    return f"[{key!r}]"

def get_patchlines(obj_1: dict, obj_2: dict, stack="archive.mspa") -> dict:
    result = []

    for key in obj_1.keys():
        value = obj_1[key]
        other_value = obj_2.get(key)

        if isinstance(value, dict):
            result += get_patchlines(value, obj_2.get(key, {}), stack=f"{stack}{jsSubscript(key)}")

        elif isinstance(value, list):
            if value != other_value:
                result.append(f"{stack}{jsSubscript(key)} = {other_value!r}")

        elif value != other_value:
            # result.append(f"{stack} = {other_value!r}")
            # opcodes = difflib.SequenceMatcher(None, value, other_value).get_opcodes()

            # o = 5
            # for (tag, i1, i2, j1, j2) in opcodes:
            #     a = value[i1-o:i2+o]
            #     b = other_value[j1-o:j2+o]
            #     if tag == "replace":
            #         result.append(f"s/{b!r}/{a!r}/")
            #     if tag == "insert":
            #         result.append(f"s/{b!r}/{a!r}/")
            for v, ov in zip(value.split("<br />"), other_value.split("<br />")):
                if v != ov:
                    # result.append(f"s/{ov!r}/{v!r}/")
                    result.append(f"{stack} = {stack}.replace({ov!r}, {v!r})")
    return result

def get_replacements(obj_1: dict, obj_2: dict, stack=[]):
    for key in obj_1.keys():
        value = obj_1[key]
        other_value = obj_2.get(key)
        mystack = [*stack, key]

        if isinstance(value, dict):
            yield from get_replacements(value, obj_2.get(key, {}), stack=mystack)

        elif isinstance(value, list):
            if value != other_value:
                yield (mystack, other_value, value)

        elif value != other_value:
            for v, ov in zip(value.split("<br />"), other_value.split("<br />")):
                if v != ov:
                    yield (mystack, ov, v)

def main():
    args = getArgs()
    print(args)
    with open(args.patch, "r", encoding="utf-8") as fp:
        patch = json.load(fp)

    with open(args.base, "r", encoding="utf-8") as fp:
        base = json.load(fp)

    diff = get_difference(patch, base)

    with open(args.out, "w", encoding="utf-8") as fp:
        json.dump(diff, fp, indent=2)

    # js = get_patchlines(patch, base)

    # with open("edit.js", "w", encoding="utf-8") as fp:
    #     fp.write("\n".join(js))

    with open("edit2.js", "w", encoding="utf-8") as fp:
        # There's some potential for more optimization here by grouping the stacks more heavily
        # i.e. t => archive.mspa.story[t[0]].content = archive.mspa.story[t[0]].content.replace(t[1], t[2])
        # ...except we don't know that everything is in a magic subscriptable `story` object.

        for stack, group in itertools.groupby(get_replacements(patch, base), lambda t: t[0]):
            js_stack = "".join(["archive.mspa"] + [jsSubscript(k) for k in stack])
            group = list(group)

            if len(group) == 1:
                for stack_, value, repl in group:
                    if isinstance(repl, list):
                        fp.write(f"{js_stack} = {repl!r}\n")
                    else:
                        fp.write(f"{js_stack} = {js_stack}.replace(\n  {value!r}, \n  {repl!r})\n")
            else:
                lists = []
                for stack_, value, repl in group:
                    lists.append([value, repl])
                fp.write('// {}\n{{'.format(js_stack) + f"{json.dumps(lists, indent=2)}.forEach(t => ({js_stack} = {js_stack}.replace(t[0], t[1])))" + "}\n")


if __name__ == "__main__":
    main()
