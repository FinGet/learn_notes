package main

import (
	"fmt"
	"runtime"
)

func show(i int) {
	fmt.Printf("i: %v\n", i)
}

func main() {
	go show(222)

	for i := 0; i < 5; i++ {
		runtime.Gosched() // 让出cpu 让给 子协程执行
		fmt.Printf("i: %v\n", i)
	}
}
