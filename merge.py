import os
import re
import shutil

path = os.getcwd()
info = os.listdir(path)
files = []
for i in info:
	if os.path.isfile(os.path.join(path,i)):
		files.append(i)	
#print files
for i in files:
	name = re.split('\.',i)
	tmp = name[0]
	if name[1] == 'out':
		name = re.split('-',name[0])
		#if not os.path.exists(path+os.sep+name[1]):
		#	os.mkdir(path+os.sep+name[1])
		shutil.move(os.path.join(i),os.path.join(tmp+".cpp"))
		print (name)
