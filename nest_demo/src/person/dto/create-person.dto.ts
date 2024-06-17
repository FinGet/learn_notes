// 用 Nest 接收的话，使用 @Body 装饰器，Nest 会解析请求体，然后注入到 dto 中。

// dto 是 data transfer object，就是用于封装传输的数据的对象
export class CreatePersonDto {
  name: string;
  age: number;
}
