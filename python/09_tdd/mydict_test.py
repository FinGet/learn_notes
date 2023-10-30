import unittest 
from mydict import Dict

class TestDict(unittest.TestCase):
  def setUp(self) -> None:
    return super().setUp()
  
  def tearDown(self) -> None:
    return super().tearDown()
  def test_init(self):
    d = Dict(a=1, b='test')
    self.assertEqual(d.a, 1)
    self.assertEqual(d.b, 'test')
    self.assertTrue(isinstance(d, dict))

  def test_key(self):
    d = Dict()
    d['key'] = 'value'
    self.assertEqual(d.key, 'value')

  def test_attr(self):
    d = Dict()
    d.key = 'value'
    self.assertTrue('key' in d)
    self.assertEqual(d['key'], 'value')

  def test_keyerror(self):
    d = Dict()
    with self.assertRaises(KeyError):
      value = d['empty']

  def test_attrerror(self):
    d = Dict()
    with self.assertRaises(AttributeError):
      value = d.empty

# assertTrue()方法，断言返回True
# assertEqual()方法，断言相等
# assertRaises()方法，断言会抛出指定类型的Error
# with...as...语句，可以捕获到异常

# 运行单元测试
# python -m unittest mydict_test
if __name__ == '__main__': # 这里的__main__是指当前模块
  unittest.main() # 这里的main()是指执行测试