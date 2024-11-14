import { PrismaClient } from '@prisma/client'

class PrismaService {
  static instance
  static isInitialized = false

  static async getInstance() {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
      
      // 只在首次初始化时检查连接
      if (!PrismaService.isInitialized) {
        try {
          await PrismaService.instance.$connect()
          PrismaService.isInitialized = true
          console.log('Database connected successfully')
        } catch (error) {
          console.error('Failed to connect to database:', error)
          throw error
        }
      }
    }
    return PrismaService.instance
  }
}

// 导出获取实例的方法
export const getPrisma = PrismaService.getInstance