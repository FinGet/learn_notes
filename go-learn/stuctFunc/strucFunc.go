package main

import (
	"fmt"
)

type Person struct {
	id, age     int
	name, email string
}

// 给结构体绑定一个方法
func (per Person) eat(food string) {
	fmt.Printf("eat food: %v\n", food)
}

// 接口
type USB interface {
	read()
	write(name string)
}

type Pc struct {
	name string
}

func (c Pc) read() {
	fmt.Printf("read c.name: %v\n", c.name)
}

func (c Pc) write(name string) {
	c.name = name
	fmt.Printf("write c.name: %v\n", c.name)
}

// 接口嵌套
type Flyer interface {
	fly()
}
type Swimmer interface {
	swim()
}

type FlyFish interface {
	Flyer
	Swimmer
}

// 构造函数
func NewPerson(name string, age int) (*Person, error) {
	if name == "" {
		return nil, fmt.Errorf("name 不能为空")
	}
	if age < 0 {
		return nil, fmt.Errorf("age 不能小于0")
	}
	return &Person{name: name, age: age}, nil
}

func main() {
	p1 := Person{
		1,
		23,
		"finget",
		"123@qq.com",
	}

	p1.eat("apple")

	// 指定c 的接口为 USB 那么 就必须实现 read 和 write 方法
	var c USB = Pc{
		name: "mac pro",
	}
	// fmt.Printf("c: %v\n", c)
	c.read()
	c.write("mac air")

	p2, error := NewPerson("Finget", 19)

	if error == nil {
		fmt.Printf("p2: %v\n", *p2)
	}
}
