package main

import "fmt"

func sum(a int, b int) (ret int) {
	ret = a + b
	return ret
}

func test() (name string, age int) {
	name = "finget"
	age = 23
	return // 等价于 return name, age
}

// 不定长参数

func f1(args ...int) {
	for _, v := range args {
		fmt.Printf("v: %v\n", v)
	}
}

// 定义函数类型
type fn func(a int, b int) int

func max(a int, b int) int {
	if a > b {
		return a
	} else {
		return b
	}
}

// 闭包
func course() func(y int) int {
	var x int
	return func(y int) int {
		x += y
		return x
	}
}

// 递归
func fib(n int) int {
	if n <= 1 {
		return n
	}
	return fib(n-1) + fib(n-2)
}

// 延迟执行 defer
func deferFn() {
	fmt.Println("start")
	defer fmt.Println("step1")
	fmt.Println("end...")
}

// 没有参数和返回值，默认在main执行前调用
func init() {
	fmt.Println("init...")
}

func main() {
	r := sum(1, 2)
	fmt.Printf("r: %v\n", r)

	name, age := test()
	fmt.Printf("name: %v\n", name)
	fmt.Printf("age: %v\n", age)

	f1()

	var ff fn // ff 的类型为 fn
	ff = sum
	r = ff(1, 2)
	fmt.Printf("r: %v\n", r)
	ff = max
	r = ff(3, 4)
	fmt.Printf("r: %v\n", r)

	f1 := course()
	fmt.Printf("f1(10): %v\n", f1(10))
	fmt.Printf("f1(20): %v\n", f1(20))

	var fibn = fib(12)
	fmt.Printf("fibn: %v\n", fibn)

	deferFn()
}
