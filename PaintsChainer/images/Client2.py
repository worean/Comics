'''
Created on 2017. 7. 16.

@author: Park
'''
import socket
import cv2
import numpy as np
import os
import sys
import platform

def recvall(sock,count):
    buf = b''
    while count:
        newbuf = sock.recv(count)
        if not newbuf: return None
        buf += newbuf
        count -= len(newbuf)
    return buf

if __name__ == '__main__':
    HOST = '192.168.0.33'         # The remote host
    PORT = 50007              # The same port as used by the server
    print(socket.gethostname(), HOST, PORT)
    img = cv2.imread('input.png')
    mask = cv2.imread('mask.png',cv2.IMREAD_UNCHANGED)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((HOST, PORT))
    
    result, imgencode = cv2.imencode('.png',img)
    result, maskencode = cv2.imencode('.png',mask)

    stringData = imgencode.tostring()
    s.send(str(len(stringData)).ljust(16))
    s.send(stringData)
    stringData = maskencode.tostring()
    s.send(str(len(stringData)).ljust(16))
    s.send(stringData)
    
    length = recvall(s,16)
    imageData = recvall(s,int(length))
    data = np.fromstring(imageData,dtype='uint8')
    decimg = cv2.imdecode(data,1)
    cv2.imwrite('output.png',decimg)
    s.close()

    
