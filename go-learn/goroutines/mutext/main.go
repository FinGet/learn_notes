package main

import (
	"fmt"
	"sync"
)

var i int = 100
var wg sync.WaitGroup
var lock sync.Mutex // 修改共享数据 需要加锁 (同时修改一条数据，则需要加锁)

func add() {
	defer wg.Done()
	lock.Lock()
	i += 1
	fmt.Printf("i++: %v\n", i)
	lock.Unlock()
}

func sub() {
	defer wg.Done()
	lock.Lock()
	i -= 1
	fmt.Printf("i--: %v\n", i)
	lock.Unlock()
}

func main() {
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go add()
		wg.Add(1)
		go sub()
	}
	wg.Wait()
	fmt.Printf("end i: %v\n", i)
}
