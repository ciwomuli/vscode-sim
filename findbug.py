import os
import re
def getuser(username):
	exte=re.split('\.',username);
	res=re.split('-',exte[0]);
	return res[-1:]

fi=open('check.txt');
for line in fi:
	info = re.split('\s',line)
	user =info[0:2]
	user[0]=getuser(user[0])
	user[1]=getuser(user[1])
	if user[0] == user[1]:
		continue
	digit = info[-3:]
	scoreA = eval(digit[0])
	scoreB = eval(digit[1])
	if scoreA > (84.99) or scoreB > (84.99):
		print (line)
	elif scoreA > (79.99) and scoreB > (79.99):
		print (line)
