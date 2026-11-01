import math
# фазы: (до волны, рост HP за волну, рост награды за волну)
def mk(ph):
    def f(w, idx):
        v=1; prev=1
        for end,*g in ph:
            span=max(0,min(w,end)-prev); v*=g[idx]**span; prev=end
            if w<=end: break
        return v
    return f
def count(w): return min(40, 6+int(w*0.5))
def sim(ph,dm,g,c0,n=3,maxh=3000):
    f=mk(ph); lv=[0]*n; coins=0; best=0; t=0; marks={}; k=1.6
    power=lambda: math.prod(dm**l for l in lv)
    while t<maxh*3600 and best<1000:
        w=max(1,(best//10)*10)
        while True:
            while True:
                i=min(range(n),key=lambda j:lv[j]); c=c0*g**lv[i]
                if coins>=c: coins-=c; lv[i]+=1
                else: break
            if power()*k < f(w,0): break
            coins+=count(w)*2*f(w,1)+3+w//2; t+=25+count(w)*0.4; best=max(best,w)
            for m in (50,100,150,200,300,400,500,750,1000):
                if best>=m and m not in marks: marks[m]=round(t/3600,1)
            w+=1
            if best>=1000: break
        t+=20
    return marks
for ph,c0 in [
 ([(100,1.035,1.02),(300,1.055,1.012),(10**9,1.065,1.008)],50),
 ([(100,1.035,1.02),(300,1.055,1.012),(10**9,1.065,1.008)],30),
 ([(100,1.035,1.021),(300,1.052,1.012),(10**9,1.06,1.008)],30),
 ([(100,1.035,1.021),(250,1.052,1.013),(500,1.058,1.01),(10**9,1.065,1.008)],30),
]:
    print(ph[1:],c0, sim(ph,1.10,1.15,c0))
print('---')
for ph,c0 in [
 ([(100,1.035,1.018),(250,1.058,1.01),(500,1.062,1.009),(10**9,1.066,1.008)],30),
 ([(100,1.035,1.019),(250,1.056,1.01),(500,1.06,1.009),(10**9,1.065,1.008)],30),
 ([(100,1.035,1.019),(250,1.056,1.01),(500,1.06,1.009),(10**9,1.065,1.008)],20),
]:
    print(ph,c0, sim(ph,1.10,1.15,c0,maxh=20000))
print('===')
for ph in [[(100,1.035,1.019),(250,1.056,1.007),(500,1.06,1.008),(10**9,1.065,1.008)],
           [(100,1.035,1.019),(250,1.057,1.005),(500,1.06,1.008),(10**9,1.065,1.008)]]:
    print(ph, sim(ph,1.10,1.15,25,maxh=20000))
