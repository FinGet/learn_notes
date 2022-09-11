package main

import "fmt"

type Person struct {
	id, age     int
	name, email string
}

func changeName(p *Person) {
	p.name = "finget111"
}

func main() {
	var p1 Person
	p1.age = 23
	p1.name = "finget"
	fmt.Printf("p1: %v\n", p1)

	// 按顺序直接赋值
	p2 := Person{
		1,
		20,
		"finget",
		"11@qq.com",
	}
	fmt.Printf("p2: %v\n", p2)

	// 部分初始化
	p3 := Person{
		age:  24,
		name: "finget",
	}

	fmt.Printf("p3: %v\n", p3)

	// 结构体指针
	var pp *Person

	pp = &p3
	fmt.Printf("pp: %p\n", pp)
	fmt.Printf("pp: %v\n", *pp)

	// 结构体作为函数参数，不能改变原结构体，如果是指针则会改变
	// changeName(p3)
	changeName(&p3) // 指针
	fmt.Printf("p3: %v\n", p3)

}
