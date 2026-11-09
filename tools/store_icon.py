# Иконка 512×512 для Google Play (тот же рисунок, что у значка приложения)
import sys, math
from PIL import Image, ImageDraw
def icon(S):
    k=S/192; im=Image.new('RGBA',(S,S)); d=ImageDraw.Draw(im)
    d.rectangle([0,0,S,S],fill='#6fb6dc')
    d.polygon([(0,int(122*k)),(int(40*k),int(96*k)),(int(80*k),int(118*k)),(int(130*k),int(90*k)),(S,int(120*k))],fill='#8fb3c7')
    d.rectangle([0,int(120*k),S,S],fill='#6f9b4f')
    d.rectangle([int(70*k),int(84*k),int(122*k),S],fill='#b9a58b')
    for i in range(4): d.rectangle([int((70+i*14)*k),int(72*k),int((79+i*14)*k),int(86*k)],fill='#8e7b63')
    d.ellipse([int(88*k),int(120*k),int(104*k),int(146*k)],fill='#2a2230')
    cx,cy,r=int(96*k),int(52*k),int(34*k)
    d.arc([cx-r,cy-r,cx+r,cy+r],start=200,end=340,fill='#7a4a22',width=max(2,int(7*k)))
    a1,a2=math.radians(200),math.radians(340)
    d.line([(cx+r*math.cos(a1),cy+r*math.sin(a1)),(cx,int(64*k)),(cx+r*math.cos(a2),cy+r*math.sin(a2))],fill='#fbf0d6',width=max(1,int(2*k)))
    d.line([(cx,int(64*k)),(cx,int(10*k))],fill='#5e3b1f',width=max(2,int(4*k)))
    d.polygon([(cx,int(4*k)),(cx-int(7*k),int(16*k)),(cx+int(7*k),int(16*k))],fill='#f3c35f')
    return im
icon(2048).resize((512,512),Image.LANCZOS).convert('RGB').save(sys.argv[1])
