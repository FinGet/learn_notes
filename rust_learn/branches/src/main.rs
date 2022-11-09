fn main() {
    let number = 3;
    if number < 5 { // 必须 是 bool 
        println!("condition was true")
    } else {
        println!("condition was false")
    }

    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }


    let condition = true;
    let number = if condition { 5 } else { 6 }; // if 和 else 分支的值类型必须是一样的
    println!("The value of number is: {}", number);


    // loop 循环
    // let mut count = 0;

    // loop {
    //    count +=1;
    //    if count > 10 {
    //        println!("End count = {}", count);
    //        break;
    //    } else {
    //        println!("The value of count is: {}", count);
    //    }
    // }
    
    let mut count = 0;
    'counting_up: loop { // 循环标签
        println!("count = {}", count);
        let mut remaining = 10;

        loop {
            println!("remaining = {}", remaining);
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {}", count);
    return_loop();
    while_loop();
    for_loop();
    rev();
}

fn return_loop() {
    let mut counter = 0;

    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;
        }
    };
    println!("The result is {}", result);
}

fn while_loop() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);

        number -= 1;
    }

    println!("LIFTOFF!!!");
}

fn for_loop() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {}", element);
    }

    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("LIFTOFF!!!");
}

fn rev() {
    for number in (1..4).rev() { // rev，用来反转 range
        println!("{}!", number);
    }
    println!("LIFTOFF!!!");
}