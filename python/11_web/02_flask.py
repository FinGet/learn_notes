from flask import Flask
from flask import request

app = Flask(__name__) # 创建一个服务，赋值给APP

@app.route('/', methods=['GET', 'POST']) # 指定接口访问的路径，支持什么请求方式get，post
def home():
    return '<h1>Home</h1>'

@app.route('/signin', methods=['GET'])
def signin_form():
    # 登录，需要输入用户名和密码
    return '''<form action="/signin" method="post">
              <p><input name="username"></p>
              <p><input name="password" type="password"></p>
              <p><button type="submit">Sign In</button></p>
              </form>'''

@app.route('/signin', methods=['POST']) # 登录，需要输入用户名和密码  
def signin():
    # 登录，需要输入用户名和密码
    # 需要从request对象读取表单内容：
    if request.form['username']=='admin' and request.form['password']=='password':
        return '<h3>Hello, admin!</h3>'
    return '<h3>Bad username or password.</h3>'

if __name__ == '__main__':
    # 启动APP，指定IP和端口号
    app.run(host='', port=5555)   

