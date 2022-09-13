package main

import (
	"fmt"
	"os"
)

func createFile() {
	// 创建文件
	f, err := os.Create("a.txt")

	if err != nil {
		fmt.Printf("err: %v\n", err)
	} else {
		fmt.Printf("f.Name(): %v\n", f.Name())
	}

	// 创建目录
	err2 := os.Mkdir("osFile", os.ModePerm)
	if err2 != nil {
		fmt.Printf("err2: %v\n", err2)
	}

	// 创建多个目录
	err3 := os.MkdirAll("a/b/c", os.ModePerm)
	if err3 != nil {
		fmt.Printf("err3: %v\n", err3)
	}
}

func removeFile() {
	err := os.Remove("a.txt")
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}

	// 删除a目录，及其所有子文件
	err2 := os.RemoveAll("a")

	if err2 != nil {
		fmt.Printf("err2: %v\n", err2)
	}
}

// 重命名
func rename() {
	err := os.Rename("a.txt", "a1.txt")
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}
}

func readFile() {
	b, err := os.ReadFile("a1.txt")
	if err != nil {
		fmt.Printf("err: %v\n", err)
	} else {
		fmt.Printf("b: %T\n", b) // []uint8
		fmt.Printf("b: %v\n", b) // []buffer  英文对应ASCLL 编码
		// fmt.Printf("string(b[:]): %v\n", string(b[:]))
	}
}

func writeFile() {
	err := os.WriteFile("a1.txt", []byte("hello"), os.ModePerm)
	if err != nil {
		fmt.Printf("err: %v\n", err)
	}
}

func main() {
	// createFile()
	// removeFile()
	dir, err := os.Getwd() // 获取当前代码运行时，操作的地址
	if err != nil {
		fmt.Printf("dir: %v\n", dir)
	}

	// os.Chdir("/User/finget") 修改操作路径

	// rename()

	readFile()

	// writeFile()
}
