use std::io; // 输入/输出库引入当前作用域。io 库来自于标准库，也被称为 std：
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..101); // 随机生成一个 1 到 100 的整数。
    
    loop { // 循环
        println!("Please input your guess.");

        let mut guess = String::new(); // mut 表明 guess 变量是可变的

        io::stdin().read_line(&mut guess) // & 表示这个参数是一个 引用
            .expect("Failed to read line");

        // let guess = guess.trim().parse::<u32>() // trim() 删除字符串首尾的空白字符，parse() 将字符串转换为整数
        //     .expect("Please type a number!");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break; // 退出循环
            },
        }
    }

    
}
