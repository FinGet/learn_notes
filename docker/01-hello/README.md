把 本地 docker engine 启动起来

```shell
docker build . -t my-hello-world
# or 
# make build
```

```shell
docker run my-hello-world
# or
# make run
```

make 和 docker 的区别是什么？

1. make 可以在 Makefile 中定义多个 target，每个 target 可以有多个命令，而 docker 只能有一个 CMD
2. make 可以定义依赖关系，比如 make run 依赖 make build，而 docker 不支持依赖关系
3. make 可以定义多个文件，而 docker 只能有一个 Dockerfile


[更多make命令 入门](https://www.ruanyifeng.com/blog/2015/02/make.html)