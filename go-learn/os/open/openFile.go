package main

import (
	"fmt"
	"io"
	"os"
	"time"
)

func openClose() {
	f, err := os.Open("a1.txt")
	if err != nil {
		fmt.Printf("err: %v\n", err)
	} else {
		fmt.Printf("f.Name: %v\n", f.Name())
		f.Close()
	}

	f2, err2 := os.OpenFile("a2.txt", os.O_RDWR|os.O_CREATE, 0755) // O_RDWR:可读写，O_CREATE:没有这个文件就创建一个
	if err2 != nil {
		fmt.Printf("err2: %v\n", err2)
	} else {
		fmt.Printf("f2.Name(): %v\n", f2.Name())
		f2.Close()
	}
}

func createFile() {
	// 等价于： OpenFile(name, O_RDWR|O_CREATE, 0666)
	f, _ := os.Create("a2.txt")
	fmt.Printf("f.Name(): %v\n", f.Name())

	// 第一个参数 默认目录：Temp 第二个参数 文件名前缀
	f2, _ := os.CreateTemp("", "temp")       // 创建临时文件
	fmt.Printf("f2.Name(): %v\n", f2.Name()) // /var/folders/rz/rj0gbx2s48q9fr9skwd3n4qm0000gn/T/temp1612362794
}

func readOps() {
	f, _ := os.Open("a1.txt")
	var ret string
	// 循环读取文件内容
	for {
		buf := make([]byte, 1)
		n, err := f.Read(buf) // ReadAt(buf, 3) 从3开始读，偏移量
		fmt.Printf("n: %v\n", n)
		fmt.Printf("string(buf): %v\n", string(buf))
		ret += string(buf)
		if err == io.EOF {
			break
		}
	}
	f.Close()
	time.Sleep(time.Second)
	fmt.Println("循环结束!")
	fmt.Printf("ret: %v\n", ret)
}

func readDir() {
	de, err := os.ReadDir("goroutines") // 读取文件夹
	if err != nil {
		fmt.Printf("err: %v\n", err)
	} else {
		for _, v := range de { // 遍历目录
			fmt.Printf("v.IsDir(): %v\n", v.IsDir())
			fmt.Printf("v.Name(): %v\n", v.Name())
		}
	}
}

func main() {
	// openClose()
	// createFile()
	// readOps()
	readDir()
}
