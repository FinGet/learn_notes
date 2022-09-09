package main

import (
	"fmt"
	"math"
	"strings"
	"unsafe"
)

func getNameAndAge() (string, int) {
	return "tom", 20
}

func main() {
	var name string
	var age int
	var email string
	var isMan bool
	name = "finget"
	age = 23
	email = "123@qq.com"
	isMan = true
	if isMan {
		fmt.Println("男人")
	}

	var (
		address string = "china" // 声明 赋值
		work    string
		price   = 20 // 类型推断
	)

	var a, b, c = 1, 2, 3 // 连续赋值
	fmt.Printf("a: %v\n", a)
	fmt.Printf("b: %v\n", b)
	fmt.Printf("c: %v\n", c)

	fmt.Printf("address: %v\n", address)
	fmt.Printf("work: %v\n", work)
	fmt.Printf("price: %v\n", price)

	for i := 0; i < 5; i++ {
		fmt.Printf("i: %v\n", i)
	}
	fmt.Printf("name: %v\n", name)
	fmt.Println(name, age, email, isMan)

	str := "短变量声明，只能用在函数体内"
	fmt.Printf("str: %v\n", str)

	s, i := getNameAndAge()
	fmt.Printf("s: %v\n", s)
	fmt.Printf("i: %v\n", i)

	const PI float64 = 3.14
	fmt.Printf("PI: %v\n", PI)

	const (
		A = iota // 0
		_        // 跳过1
		B = iota // i++ 2
		C = iota // 3
	)
	fmt.Printf("A: %v\n", A)
	fmt.Printf("B: %v\n", B)
	fmt.Printf("C: %v\n", C)

	// %s string , %T type , %d int, %v var
	fmt.Printf("name: %T\n", name)
	fmt.Printf("age: %T\n", age)
	fmt.Printf("b: %T\n", isMan)

	p := &a // int 指针
	fmt.Printf("p: %T\n", p)

	arr := [...]int{1, 2, 3}
	fmt.Printf("%T\n", arr)

	var ui8 uint8 = 20
	fmt.Printf("%T %dB %v~%v\n", ui8, unsafe.Sizeof(ui8), math.MinInt8, math.MaxInt8)

	var ss = "hello go"
	fmt.Printf("ss: %v\n", ss[0:3]) // 切片 [) [3:]
	fmt.Printf("ss: %v\n", ss[0])
	fmt.Printf("len(ss): %v\n", len(ss))
	fmt.Printf("strings.Split(ss, \"\"): %v\n", strings.Split(ss, ""))
	fmt.Printf("strings.Contains(ss, \"hello\"): %v\n", strings.Contains(ss, "hello"))
	fmt.Printf("strings.ToUpper(ss): %v\n", strings.ToUpper(ss))
}
