package main

import "os"

func write() {
	f, _ := os.OpenFile("a.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0755) // O_APPEND 追加  os.O_TRUNC 覆盖
	f.Write([]byte("hello word"))
	f.Close()
}

func writeString() {
	f, _ := os.OpenFile("a.txt", os.O_RDWR|os.O_TRUNC, 0755)
	f.WriteString("hello golang")
	f.Close()
}

func writeAt() {
	f, _ := os.OpenFile("a.txt", os.O_RDWR, 0755)
	f.WriteAt([]byte("aaa"), 3)
	f.Close()
}

func main() {
	// write()
	// writeString()
	writeAt()
}
