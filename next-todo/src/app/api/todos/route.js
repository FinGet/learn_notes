import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
// import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
import { getPrisma } from '@/lib/prisma';
import { serializeBigInt } from '@/utils';
import { withErrorHandler } from '@/middleware/db-error';



// 获取用户ID的辅助函数
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// 获取所有todos
export async function GET(request) {
  return withErrorHandler(async () => {
    const prisma = await getPrisma();
    try {
      // 使用 headers() 作为同步函数
      const headersList = headers();
      const authorization = headersList.get('authorization');
  
      console.log('Authorization header:', authorization);
  
      if (!authorization) {
        return NextResponse.json({ error: '未授权' }, { status: 401 });
      }
  
      const token = authorization.replace('Bearer ', '');
      const userId = getUserIdFromToken(token);
      console.log('userId', userId);
  
      if (!userId) {
        return NextResponse.json({ error: '无效的token' }, { status: 401 });
      }
  
      // 使用 MySQL 获取 todos
      // const [todos] = await pool.query(
      //   'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      //   [userId]
      // );
  
      const todos = await prisma.todos.findMany({
        where: {
          user_id: BigInt(userId),
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      
      
      return NextResponse.json(serializeBigInt(todos), { status: 200 });
    } catch (error) {
      console.error('Error in GET /api/todos:', error);
      return NextResponse.json(
        { error: '获取待办事项失败', details: error.message },
        { status: 500 }
      );
    }
  })

}

// 创建新todo
export async function POST(request) {
  const prisma = await getPrisma();

  try {
    const headersList = headers();
    const authorization = headersList.get('authorization');

    if (!authorization) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const token = authorization.replace('Bearer ', '');
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return NextResponse.json({ error: '无效的token' }, { status: 401 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: '标题不能为空' }, { status: 400 });
    }
    // 使用Sql 创建 todo
    // const [result] = await pool.query(
    //   'INSERT INTO todos (user_id, title) VALUES (?, ?)',
    //   [userId, title]
    // );

    // const [newTodo] = await pool.query(
    //   'SELECT * FROM todos WHERE id = ?',
    //   [result.insertId]
    // );

    // 使用 Prisma 创建 todo
    const newTodo = await prisma.todos.create({
      data: {
        user_id: BigInt(userId),
        title,
      },
    });

    return NextResponse.json(serializeBigInt(newTodo), { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: '创建待办事项失败', details: error.message },
      { status: 500 }
    );
  }
}