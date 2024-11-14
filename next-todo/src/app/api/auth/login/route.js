import { NextResponse } from 'next/server';
// import pool from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码都是必填的' },
        { status: 400 }
      );
    }

    // 查找用户
    // 使用 MySQL 查找用户
    // const [users] = await pool.query(
    //   'SELECT * FROM users WHERE email = ?',
    //   [email]
    // );
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT token
    const token = generateToken(user.id.toString());

    return NextResponse.json({
      message: '登录成功',
      token,
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录过程中发生错误' },
      { status: 500 }
    );
  }
}