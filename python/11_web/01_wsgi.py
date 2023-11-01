from wsgiref.simple_server import make_server

def application(environ, start_response):
    # environ：一个包含所有HTTP请求信息的dict对象；
    # start_response：一个发送HTTP响应的函数。
    print(environ.get('PATH_INFO'))
    # 获取query_string
    print(environ.get('QUERY_STRING'))
    # 获取请求方法
    print(environ.get('REQUEST_METHOD'))
    # 获取请求头
    print(environ.get('HTTP_USER_AGENT'))
    start_response('200 OK', [('Content-Type', 'text/html')])
    body = '<h1>Hello, %s!</h1>' % (environ['PATH_INFO'][1:] or 'web')
    return [body.encode('utf-8')]

# 创建一个服务器，IP地址为空，端口是8000，处理函数是application:
httpd = make_server('', 8000, application)

print('Serving HTTP on port 8000...')

httpd.serve_forever()
