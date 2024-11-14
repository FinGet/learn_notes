import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export async function withErrorHandler(handler) {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: '数据库连接失败' },
        { status: 503 }
      )
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // 处理已知的 Prisma 错误
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            { error: '数据已存在' },
            { status: 409 }
          )
        case 'P2025':
          return NextResponse.json(
            { error: '记录不存在' },
            { status: 404 }
          )
      }
    }
    
    console.error('Database error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}