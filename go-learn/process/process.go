package main

import "fmt"

func scan() {
	var c string
	fmt.Println("please input first word:")
	fmt.Scan(&c)
	if c == "M" {
		fmt.Println("Monday")
	} else if c == "F" {
		fmt.Println("Friday")
	} else if c == "T" {
		fmt.Println("please input second word:")
		fmt.Scan(&c)
		if c == "U" {
			fmt.Println("Tuesday")
		} else {
			fmt.Println("Thursday")
		}
	} else if c == "S" {
		fmt.Println("please input second word:")
		fmt.Scan(&c)
		if c == "a" {
			fmt.Println("Saturday")
		} else {
			fmt.Println("Sunday")
		}
	}
}

func f1() {
	for i := 0; i < 10; i++ {
		fmt.Printf("第 %v 条\n", i)
	}

	// for {
	// 	fmt.Println("永真循环")
	// }

	var a = [5]int{1, 2, 3, 4, 5}
	for i, v := range a {
		fmt.Printf("i: %d, v: %v\n", i, v)
	}
	for _, v := range a { // 匿名变量 _ 可以不使用
		fmt.Printf("v: %v\n", v)
	}

	m := make(map[string]string, 0)
	m["name"] = "finget"
	m["age"] = "20"
	m["email"] = "123@qq.com"

	for k, v := range m {
		fmt.Printf("%v : %v\n", k, v)
	}

MYLABEL: // 自定义标识，break 到标识位置
	for i := 0; i < 10; i++ {
		fmt.Printf("i: %v\n", i)
		if i > 5 {
			break MYLABEL
		}
	}
	fmt.Println("END...")
}

func main() {
	if age := 12; age > 18 {
		fmt.Printf("成年了")
	} else if age > 12 {
		fmt.Printf("未成年")
	} else {
		fmt.Printf("小朋友!")
	}

	a := 10
	if a > 0 { // 不能直接判断非0
		fmt.Printf("a: %v\n", a)
	}

	day := 2
	switch day {
	case 1, 2, 3, 4, 5:
		fmt.Println("workday")
		fallthrough // 穿透
	case 6, 7:
		fmt.Println("weekend")
	default:
		fmt.Println("error day")
	}
	f1()
}
