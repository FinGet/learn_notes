import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // 验证输入
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    // 使用 MySQL 检查用户是否已存在
    // const [existingUsers] = await pool.query(
    //   'SELECT * FROM users WHERE email = ? OR username = ?',
    //   [email, username]
    // );
    // 使用 Prisma 检查用户是否已存在
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名或邮箱已存在' },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建新用户
    // 使用 MySQL 创建用户
    // const [result] = await pool.query(
    //   'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    //   [username, email, hashedPassword]
    // );
    // 使用 Prisma 创建用户
    const result = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: '注册成功', userId: result.id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册过程中发生错误' },
      { status: 500 }
    );
  }
}