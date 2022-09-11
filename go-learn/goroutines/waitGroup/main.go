package main

import (
	"fmt"
	"sync"
)

var wg sync.WaitGroup

func showMsg(i int) {
	defer wg.Done() // 每个协程执行后就 -1
	fmt.Printf("i: %v\n", i)
}

func main() {
	for i := 0; i < 5; i++ {
		go showMsg(i)
		wg.Add(1) // 类似一个计算器，记录有多个协程
	}
	wg.Wait() // 等待协程执行完 直到计数器为0
	fmt.Println("end...")
}
