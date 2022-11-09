fn main() {
    println!("Hello, world!");
    let x = 5;
    println!("The value of x is: {}", x);
    // x = 6; // error: cannot assign to immutable variable `x`
    // println!("The value of x is: {}", x);

    let mut y = 5; // mutable variable 可变的变量
    println!("The value of y is: {}", y);
    y = 6;
    println!("The value of y is: {}", y);


    const MAX_POINT: i32 = 100_000; // const 常量 只能赋值一次 可以用来表示一个固定的值
    // convert the identifier to upper case: `MAX_POINT`
    println!("The value of MAX_POINT is: {}", MAX_POINT);
    
    // shadowing 隐藏 重复定义
    let z = 5;
    let z = z + 1;
    {
        let z = z * 2;
        println!("The value of z is: {}", z); // 12
    }
    println!("The value of z is: {}", z); // 6


    // 整数
    let a: u8 = 123; // u8
    let b: u16 = 123; // u16
    let c: u32 = 123; // u32
    let d: u64 = 123; // u64
    let e: usize = 123; // usize
    println!("The value of a is: {}", a);

    // 浮点数
    let n = 1.0; // f64 
    let f: f32 = 3.0; // f32
    println!("The value of n is: {}", n);

    // 布尔
    let g: bool = true; // bool
    println!("The value of g is: {}", g);
    // 字符串
    let s: &str = "hello"; // &str
    let heart_eyed_cat = '😻';
    println!("The value of heart_eyed_cat is: {}", heart_eyed_cat);

    // 元组
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of x is: {}", x);

    // 数组
    let a = [1, 2, 3, 4, 5];
    let first = a[0];
    println!("The value of first is: {}", first);

    let b: [i32; 5] = [1, 2, 3, 4, 5]; // 在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量
    let c = [3; 5]; // [3, 3, 3, 3, 3]

    another_function(5, 'h');

    // 函数返回值
    let h = plus_one(5);
    println!("The value of h is: {}", h);


    let mut s = String::from("hello");

    s.push_str(", world!"); // push_str() 在字符串后追加字面值

    println!("The value of s is: {}", s);
}

fn another_function(x: i32, unit_label: char) { // 在函数签名中，必须 声明每个参数的类型
    println!("Another function.");
    println!("The value of x is: {}", x);
    println!("The value of unit_label is: {}", unit_label);
}

// 我们并不对返回值命名，但要在箭头（->）后声明它的类型
fn plus_one(x: i32) -> i32 {
    // x + 1 // 隐式的返回值，最后不加分号
    return x + 1; // return 加上分号，表示返回值
}
