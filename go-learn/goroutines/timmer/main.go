package main

import (
	"fmt"
	"time"
)

func main() {
	timer := time.NewTimer(time.Second * 2)
	fmt.Printf("time.Now(): %v\n", time.Now())
	c := <-timer.C // 阻塞
	fmt.Printf("c: %v\n", c)

	<-time.After(time.Second * 3) // 也可以阻塞
	// timer.Reset(time.Second) 可以重新设置时间
	// timer.Stop() // 关闭
	fmt.Printf("time.Now(): %v\n", time.Now())

}
