package main

import "fmt"

var c = make(chan int)

func main() {
	go func() {
		for i := 0; i < 2; i++ {
			c <- i
		}
		close(c) // 关闭通道，就不会出现死锁
	}()

	// c2 := <-c
	// fmt.Printf("c2: %v\n", c2)
	// c2 = <-c
	// fmt.Printf("c2: %v\n", c2)
	// c2 = <-c
	// fmt.Printf("c2: %v\n", c2) // 超出  all goroutines are asleep - deadlock! 死锁

	// 循环遍历通道数据
	for v := range c {
		fmt.Printf("v: %v\n", v)
	}
}
