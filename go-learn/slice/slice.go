package main

import "fmt"

func main() {
	var s1 []int // 声明切片 没有长度
	var s2 []string

	fmt.Printf("s1: %v\n", s1)
	fmt.Printf("s2: %v\n", s2)

	s1 = append(s1, 5)
	s1 = append(s1, 3, 45, 66)
	fmt.Printf("s1: %v\n", s1)
	fmt.Printf("len(s1): %v\n", len(s1)) // 长度
	fmt.Printf("cap(s1): %v\n", cap(s1)) // 容量

	s3 := []int{1, 2, 3, 4, 5}

	fmt.Printf("s3[:2]: %v\n", s3[:2])
	fmt.Printf("s3[3:]: %v\n", s3[3:])
	fmt.Printf("s3[2:5]: %v\n", s3[2:5]) // 前闭 后开
	fmt.Printf("s3[0:1]: %v\n", s3[0:1])

	s3Copy := make([]int, len(s3))
	copy(s3Copy, s3)
	fmt.Printf("s3Copy: %v\n", s3Copy)

	// 删除 i = 2
	s3Copy = append(s3Copy[:2], s3Copy[3:]...)
	fmt.Printf("s3Copy: %v\n", s3Copy)
	// a = append(a[:index], a[index:]...)

	var val = 3

	for i, v := range s3 {
		if v == val {
			fmt.Printf("i: %v\n", i)
		}
	}
}
