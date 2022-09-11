package main

import (
	"fmt"
	"math/rand"
	"time"
)

func show(msg string) {
	for i := 0; i < 5; i++ {
		fmt.Printf("msg: %v\n", msg)
		time.Sleep(time.Millisecond * 100)
	}
}

// 协程之间通信
var channels = make(chan int)

// ch <- v    // 发送值v到Channel ch中
// v := <-ch  // 从Channel ch中接收数据，并将数据赋值给v
func send() {
	rand.Seed(time.Now().UnixNano())
	value := rand.Intn(10)
	fmt.Printf("value: %v\n", value)
	channels <- value
}

func main() {
	go show("java") // go 启动一个协程来执行
	show("golang")
	fmt.Println("end...") // 主函数退出，程序就结束了，协程也被杀死了
	// 协程间通信
	defer close(channels)
	go send()
	fmt.Println("wait...")
	value := <-channels
	fmt.Printf("value: %v\n", value)
}
