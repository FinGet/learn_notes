import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// 更新todo
export async function PUT(
  request,
  { params }
) {
  try {
    const headersList = headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const { completed } = await request.json();
    const todoId = params.id;

    // 使用 MySQL 更新 todo
    // const [result] = await pool.query(
    //   'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
    //   [completed, todoId, userId]
    // );
    // 使用 Prisma 更新 todo
    const updatedTodo = await prisma.todos.update({
      where: { id: BigInt(todoId), user_id: BigInt(userId) },
      data: { completed },
    });

    return NextResponse.json({ message: '更新成功' });
  } catch (error) {
    return NextResponse.json({ error: '更新待办事项失败' }, { status: 500 });
  }
}

// 删除todo
export async function DELETE(
  request,
  { params }
) {
  try {
    const headersList = headers();
    const token = headersList.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const userId = getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const todoId = params.id;

    await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [todoId, userId]
    );

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    return NextResponse.json({ error: '删除待办事项失败' }, { status: 500 });
  }
}