fn main() {
    println!("Hello, cargo!");
}

// 可以使用 cargo build 构建项目。
// 可以使用 cargo run 一步构建并运行项目。
// 可以使用 cargo check 在不生成二进制文件的情况下构建项目来检查错误。
// 有别于将构建结果放在与源码相同的目录，Cargo 会将其放到 target/debug 目录。
// cargo build --release 发布项目，Cargo 会将其放到 target/release 目录