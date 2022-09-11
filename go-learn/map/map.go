package main

import "fmt"

func main() {
	var m1 = make(map[string]string)
	m1["name"] = "finget"
	m1["age"] = "23"

	keys := make([]string, 0, len(m1))
	for k := range m1 {
		keys = append(keys, k)
	}
	fmt.Printf("keys: %v\n", keys)

	// 判断是否包含
	v, has := m1["name"]
	fmt.Printf("v: %v\n", v)
	fmt.Printf("has: %v\n", has)

	// 遍历 map
	for k, v := range m1 {
		fmt.Printf("k: %v\n", k)
		fmt.Printf("v: %v\n", v)
	}
}
