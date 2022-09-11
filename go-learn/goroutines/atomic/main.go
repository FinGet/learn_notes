package main

import (
	"fmt"
	"sync/atomic"
	"time"
)

var i int32 = 100

func add() {
	atomic.AddInt32(&i, 1) // 和 mutext 效果一样
	fmt.Printf("i++: %v\n", i)
}

func sub() {
	atomic.AddInt32(&i, -1)
	fmt.Printf("i--: %v\n", i)
}
func main() {
	for i := 0; i < 100; i++ {
		go add()
		go sub()
	}

	time.Sleep(time.Second * 2)
	fmt.Printf("i: %v\n", i)

	// atomic.LoadInt32() 读
	// atomic.StoreInt32() 写

	b := atomic.CompareAndSwapInt32(&i, 100, 200) // 比较并修改，如果old 是 100 则 修改 成 200
	fmt.Printf("b: %v\n", b)
	fmt.Printf("i: %v\n", i)
}
