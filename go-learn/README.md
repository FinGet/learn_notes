# Go 入门

## vscode go 插件

安装tools：
`cmd`+`shift`+`p` => go: install/updated tools。
```bash
# 新版改成如下链接
go env -w GO111MODULE=on
go env -w GOPROXY=https://proxy.golang.com.cn,direct
```

## hello go

```bash
mkdir go-learn

cd go-learn

go mod init goLearn

touch hello.go
```

```go
// hello.go
package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}
```

```
go run hello.go
```