n=5

def ct(x,a,y,b,n):
	if x==y and a==b:
		return 0
	if a==b or (x==y and (a==b-1 or a==b+1)):
		return 1
	if x==1 and y==1:
		if (a+b)%2==1 and a < b-1:
			return n*(b-a+1)/2-a
		if a<b and (a+b)%2==0 and a+b<=n:
			return n*(a+b)/2+a-1
		if a<b and (a+b)%2==0 and a+b>n:
			return n*(2*n+2-a-b)/2-a
	if x==1 and y==2:
		if a<b and (a+b)%2==0:
			return n*(b-a)/2-a
		if a<b and (a+b)%2==1 and a+b<=n+1:
			return n*(a+b-1)/2+a-1
		if a<b and (a+b)%2==1 and a+b>n+1:
			return n*(2*n+3-a-b)/2-a
	if x==2 and y==1:
		if a<b and (a+b)%2==0:
			return n*(b-a+2)/2-a+1
		if a<b and (a+b)%2==1 and a+b<n:
			return n*(a+b+1)/2+a
		if a<b and (a+b)%2==1 and a+b==n:
			return n*(n+1)/2-a+1
		if a<b and (a+b)%2==1 and a+b==n+1:
			return n*n/2+a
		if a<b and (a+b)%2==1 and a+b>n+1:
			return n*(2*n+3-a-b)/2-a+1
	if x==2 and y==2:
		if a<b-1 and (a+b)%2==1:
			return n*(b-a+1)/2-a+1
		if a<b-1 and (a+b)%2==0 and a+b<=n:
			return n*(a+b)/2+a
		if a<b-1 and (a+b)%2==0 and a+b>n:
			return n*(2*n+2-a-b)/2-a+1
	return ct(x,n+1-a,y,n+1-b,n)
	
print('\n'.join(['\t'.join([str(int(ct(1,a,1,b,n)))+"/"+str(int(ct(1,a,2,b,n))) for b in range(1,n+1)]) for a in range(1,n+1)]))
print()
print('\n'.join(['\t'.join([str(int(ct(2,a,1,b,n)))+"/"+str(int(ct(2,a,2,b,n))) for b in range(1,n+1)]) for a in range(1,n+1)]))