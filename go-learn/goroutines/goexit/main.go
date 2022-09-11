package main

import (
	"fmt"
	"runtime"
	"time"
)

func show() {
	for i := 0; i < 10; i++ {
		fmt.Printf("i: %v\n", i)
		if i >= 5 { // 主动退出协程
			runtime.Goexit()
		}
	}
}

func main() {
	runtime.GOMAXPROCS(2) // 设置cpu 核心
	go show()
	go show()
	fmt.Printf("runtime.NumCPU(): %v\n", runtime.NumCPU()) // cpu 核心数
	time.Sleep(time.Second)
}
