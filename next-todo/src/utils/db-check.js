import { prisma } from '@/lib/prisma'

export async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, message: '数据库连接成功' }
  } catch (error) {
    console.error('数据库连接失败:', error)
    return { 
      ok: false, 
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : String(error)
    }
  }
}