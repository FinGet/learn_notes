package main

import "fmt"

func main() {
	var a1 [2]int
	var a2 [3]string

	fmt.Printf("a1: %T\n", a1) // [2]int
	fmt.Printf("a1: %v\n", a1) // [0,0]
	fmt.Printf("a2: %T\n", a2) // [3]string
	fmt.Printf("a2: %v\n", a2) // [   ]

	var a3 = [...]int{1, 2, 3}
	fmt.Printf("a3: %v\n", a3)

	var a4 = [...]bool{2: true, 5: false}
	fmt.Printf("a4: %v\n", a4)

	for i := 0; i < len(a3); i++ {
		fmt.Printf("a3[%v]: %v\n", i, a3[i])
	}

	// forr 快捷键
	for i, v := range a3 {
		fmt.Printf("a3[%v]: %v\n", i, v)
	}
}
