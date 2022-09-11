package main

import (
	"fmt"
)

func main() {
	var ip *int
	fmt.Printf("ip: %v\n", ip) // nil 空指针
	fmt.Printf("ip: %T\n", ip)

	var i int = 100
	ip = &i                     // 指针赋值
	fmt.Printf("ip: %v\n", ip)  // 0xc0000b2020 内存地址
	fmt.Printf("ip: %v\n", *ip) // 100

	arr := [3]int{1, 2, 3}
	var pa [3]*int

	fmt.Printf("pa: %v\n", pa) // [<nil> <nil> <nil>]

	// 数组指针循环赋值
	for i := 0; i < len(arr); i++ {
		pa[i] = &arr[i]
	}

	fmt.Printf("pa: %v\n", pa)
}
