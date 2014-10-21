#!/usr/bin/python
import thread,subprocess
import time,os,sys
import fileinput

defaultThreads = 10

FNULL = open(os.devnull,'w')
def throttleServer(threadName):
   while True:
      subprocess.call(["curl","http://54.69.188.189/?site=OMDB&title=Supernatural"],
            stdout=FNULL,stderr=FNULL)

def startThreads(n):
   print "Starting " + str(n) + " Threads"
   for i in range(n):
      thread.start_new_thread(throttleServer,("Thread_"+str(i),))

if(len(sys.argv) == 2):
   startThreads(int(sys.argv[1]))
else:
   startThreads(defaultThreads)

while 1:
   pass
