package main

import (
	"fmt"
	"time"
)

func main() {
	ticker := time.NewTicker(time.Second) // setInterval

	// counter := 1
	// for range ticker.C {
	// 	counter += 1
	// 	fmt.Println("ticker")
	// 	if counter > 5 {
	// 		ticker.Stop()
	// 		fmt.Println("ticker stop")
	// 		break // 还需要手动退出循环
	// 	}
	// }

	chanInt := make(chan int)
	go func() {
		for range ticker.C {
			select {
			case chanInt <- 1:
			case chanInt <- 2:
			case chanInt <- 3:
			}
		}
	}()

	sum := 0
	for v := range chanInt {
		fmt.Printf("收到 v: %v\n", v)
		sum += v
		if sum >= 10 {
			break
		}
	}

	time.Sleep(time.Second * 3)
}
