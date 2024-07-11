# M x y
# Q x1 y1, x y

import numpy as np
import re
import pandas as pd
import matplotlib.pyplot as plt

import math

rx_dict = {
    'M': (re.compile(
        r'M(?P<mgroup>'
        r'[ ]*(?P<x>[0-9.-]+)'
        r'[ ]+(?P<y>[0-9.-]+)'
        r'(?:[ ]|$)+){1}')),
    'Q': re.compile(
        r'Q(?P<qgroup>'
        r'[ ]*(?P<x1>[0-9.-]+)'
        r'[ ]+(?P<y1>[0-9.-]+)'
        r'[ ]+(?P<x>[0-9.-]+)'
        r'[ ]+(?P<y>[0-9.-]+)'
        r'(?:[ ]|$)+){1}'),
    'repeat': re.compile(r'([0-9.-]+)')
}

def valuesToMatrixes(valuestxt):
    lines = valuestxt.split(";")
    matrixes = []
    for line in lines:
        matrix = []
        last_instruction = None
        while line:
            # print(line)
            for key, rx in rx_dict.items():
                match = rx.search(line)
                if match:
                    # print(key, match, match.groups())
                    if key == "repeat":
                        assert last_instruction is not None
                        line = last_instruction + line
                        # don't chomp
                    else:
                        last_instruction = key
                        # do chomp
                        line = line[match.span()[1]:]
                        if key == "M":
                            print(match.groups())
                            __, x, y = match.groups()
                            matrix.append([float(x), float(y)])
                        elif key == "Q":
                            __, x1, y1, x, y = match.groups()
                            matrix.append([float(x1), float(y1)])
                            matrix.append([float(x), float(y)])
                        else:
                            raise NotImplementedError(key)
                    # Regardless, matched
                    break  # break rx_dict
                else:
                    continue
            else:  # Nobreak
                raise NotImplementedError(line)
        matrixes.append(np.array(matrix))
        # end for line in lines
    return matrixes
    # return [[m[0], m[-1]] for m in matrixes] 

def matrixToSvg(matrix):
    out = ""
    for i, (x, y) in enumerate(matrix):
        if i == 0:
            out += "M"
        if i == 1:
            out += "Q"
        out += f"{x:<7} {y:<7}"
    out += ";"
    return out

matrixes = valuesToMatrixes("""M0.0     -61.3   Q-10.85  -10.45  -74.5   -1.35   -138.15 -7.8    -181.15 -45.15  -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3 ;
M0.0     -61.3   Q-10.85  -10.45  -74.5   -1.35   -138.15 -7.8    -181.15 -45.15  -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3 ;
M-6.5    -81.8   Q-20.9   -10.45  -84.5   -1.35   -148.1  -7.8    -186.1  -45.15  -224.1  -98.05  -206.4  -156.1  -188.7  -214.1  -203.4  -269.3 ;
M-6.5    -81.8   Q-20.9   -10.45  -84.5   -1.35   -148.1  -7.8    -186.1  -45.15  -224.1  -98.05  -206.4  -156.1  -188.7  -214.1  -203.4  -269.3 ;
M-25.5   -140.3  Q-63.3   -95.15  -103.9  -78.9   -144.45 -62.65  -181.9  -84.3   -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3 ;
M-25.5   -140.3  Q-63.3   -95.15  -103.9  -78.9   -144.45 -62.65  -181.9  -84.3   -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3 ;
M-14.0   -102.8  Q-64.65  -101.15 -107.4  -66.9   -150.1  -32.65  -184.75 -69.3   -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3 ;
M-14.0   -102.8  Q-64.65  -101.15 -107.4  -66.9   -150.1  -32.65  -184.75 -69.3   -219.35 -105.9  -218.65 -160.0  -217.9  -214.1  -184.95 -258.3 ;
M-2.5    -53.8   Q-9.8    -6.3    -67.5   -1.3    -125.2  -8.95   -120.8  -53.7   -116.4  -116.35 -166.0  -165.25 -215.6  -214.15 -180.45 -253.3 ;
M-2.5    -53.8   Q-9.8    -6.3    -67.5   -1.3    -125.2  -8.95   -120.8  -53.7   -116.4  -116.35 -166.0  -165.25 -215.6  -214.15 -180.45 -253.3 ;
M-8.0    -88.3   Q-9.8    -6.3    -72.15  -2.85   -134.45 -12.0   -172.5  -21.9   -210.5  -55.75  -210.9  -123.3  -211.25 -190.8  -160.45 -239.8 ;
M-8.0    -88.3   Q-9.8    -6.3    -72.15  -2.85   -134.45 -12.0   -172.5  -21.9   -210.5  -55.75  -210.9  -123.3  -211.25 -190.8  -160.45 -239.8 ;
M-50.5   -217.3  Q-41.4   -52.9   -99.0   -35.35  -156.6  -17.75  -190.35 -57.9   -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -165.95 -244.3 ;
M-50.5   -217.3  Q-41.4   -52.9   -99.0   -35.35  -156.6  -17.75  -190.35 -57.9   -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -165.95 -244.3 ;
M0.0     -61.3   Q-10.85  -10.45  -74.5   -1.35   -138.15 -7.8    -181.15 -45.15  -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3 ;
M0.0     -61.3   Q-10.85  -10.45  -74.5   -1.35   -138.15 -7.8    -181.15 -45.15  -224.1  -98.05  -221.0  -156.1  -217.9  -214.1  -184.95 -258.3 """)


# matrixes = valuesToMatrixes("""M1  50  Q51 50 51 0""")
# print(matrixes)

theta = math.pi/5

rot_matrix = np.matrix([
    [math.cos(theta), -math.sin(theta)],
    [math.sin(theta), math.cos(theta)]
])

print("Before")
for matrix in matrixes:
    print(matrixToSvg(matrix))
    # plotMatrix(matrix)

def constrain(matrix):
    matrix = matrix.copy()
    head = matrix[0]
    matrix -= [head[0], 0]
    return matrix

print("After")
for i, matrix in enumerate(matrixes):
    out_matrix = np.round(constrain(matrix), 3)

    print(matrixToSvg(out_matrix))

    # plt.figure(i)
    # x = np.array(range(-400, 400)) 
    # y = (math.cos(theta) * x + 60)
    # plt.plot(x, y, c="black")

    # plt.plot((0, 0), (-400, 400), c="black")
    # plt.scatter(0, 0, c="red")

    # plt.plot(*zip(*matrix), c="green")
    # plt.plot(*zip(*out_matrix), c="blue")
    # plt.scatter(*zip(*matrix), c="green")
    # plt.scatter(*zip(*out_matrix), c="blue")
    # plt.show()



