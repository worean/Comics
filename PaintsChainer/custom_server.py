#!/usr/bin/env python

import http.server

import sys
import time
import re
import socket
import argparse
import cv2
import numpy as np
import sys
import platform

from cgi import parse_header, parse_multipart
from urllib.parse import parse_qs


# sys.path.append('./cgi-bin/wnet')
sys.path.append('./cgi-bin/paint_x2_unet')
import cgi_exe
sys.path.append('./cgi-bin/helpers')
from platformAdapter import OSHelper


def recvall(sock,count):
    buf = b''
    while count:
        newbuf = sock.recv(count)
        if not newbuf: return None
        buf += newbuf
        count -= len(newbuf)
    return buf


# set args 
def parse_args():
    parser = argparse.ArgumentParser(
        description='chainer line drawing colorization server')
    parser.add_argument('--gpu', '-g', type=int, default=0,
                        help='GPU ID (negative value indicates CPU)')
    parser.add_argument('--mode', '-m', default="stand_alone",
                        help='set process mode')
    # other mode "post_server" "paint_server"

    parser.add_argument('--port', '-p', type=int, default=8000,
                        help='using port')
    parser.add_argument('--debug', dest='debug', action='store_true')
    parser.set_defaults(feature=False)

    parser.add_argument('--host', '-ho', default='localhost',
                        help='using host')
    args = parser.parse_args()
    return args

if "__main__" in __name__:
 
    args = parse_args()
    
    # initialize painter(colorize algorithm)
    if args.mode == "stand_alone" or args.mode == "paint_server":
        print('GPU: {}'.format(args.gpu))
        painter = cgi_exe.Painter(gpu=args.gpu)


    # set id 
    id_str = 'example'

    HOST = '127.0.0.1'
    PORT = 50007             
    ADDR = (HOST,PORT)
    print('serving at', HOST, ':', PORT )

        
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(ADDR)


    server.listen(5)
    while 1:
        
        client,addr_info = server.accept()
        print ('Connected by', addr_info)
        

        length = recvall(client,16)
        print ('Receive Image')
        imageData = recvall(client,int(length))

        length = recvall(client,16)
        print ('Receive Mask')
        maskData = recvall(client,int(length))
        
        print ('Decode img, mask file')
        imgdata = np.fromstring(imageData,dtype='uint8')
        decImg = cv2.imdecode(imgdata,1)
        maskdata = np.fromstring(maskData,dtype='uint8')
        decMask = cv2.imdecode(maskdata,cv2.IMREAD_UNCHANGED)
        
        cv2.imwrite("images/line/input.png",decImg)
        cv2.imwrite("images/ref/input.png",decMask)

        print ('colorize')
        painter.colorize("input")
  #     painter.colorize_local(decImg, decMask, id_str,False,'C',0,128,"jpg")
        colorizedImg = painter.get_ImgData()

        print ('encode')
        result, imgencode = cv2.imencode('.jpg',colorizedImg)
        stringData = imgencode.tostring()
        length = str(len(stringData)).ljust(16)
        print ('Send to', addr_info)
        client.send(length.encode('utf-8'))
        client.send(stringData)