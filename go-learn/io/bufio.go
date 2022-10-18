package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	f, _ := os.Open("a.txt")
	defer f.Close()
	r := bufio.NewReader(f)
	s, _ := r.ReadString('\n')
	fmt.Printf("s: %v\n", s)
}
