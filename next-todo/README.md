This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## mysql table
``` sql
CREATE DATABASE todolist_db;

USE todolist_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 目录
```
todolist-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       └── register/
│   │   │           └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   └── db.ts
├── .env.local
├── package.json
└── next.config.js
```

## prisma 入门

### 初始化 prisma 项目

```
pnpm i @prisma/client prisma 
pnpm prisma init
```

`pnpm prisma init` 初始化 prisma 项目, 会生成 `schema.prisma` 文件, 用于定义数据库模型。

可以通过`npx prisma db pull` 从数据库中拉取模型, 生成 `schema.prisma` 文件。

可以通过`npx prisma db push` 将模型推送到数据库中。

最后通过`npx prisma generate` 生成客户端。

### 使用 prisma 客户端

```js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

```js
// 查找单条记录
const user = await prisma.user.findUnique({
  where: {
    id: 1,
    // 或者其他 @unique 字段
    email: 'test@example.com'
  }
});

// 查找第一条匹配记录
const user = await prisma.user.findFirst({
  where: {
    email: {
      contains: '@example.com'
    }
  }
});

// 查找多条记录
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: '@example.com'
    }
  },
  select: {    // 选择特定字段
    id: true,
    email: true
  },
  include: {   // 包含关联数据
    posts: true
  },
  orderBy: {   // 排序
    createdAt: 'desc'
  },
  skip: 10,    // 分页
  take: 10
});
```

```js
// 创建单条记录
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
    posts: {    // 同时创建关联数据
      create: {
        title: 'Hello World',
        content: 'This is my first post'
      }
    }
  }
});

// 创建多条记录
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' }
  ],
  skipDuplicates: true  // 跳过重复记录
});
```

```JS
// 更新单条记录
const user = await prisma.user.update({
  where: {
    id: 1
  },
  data: {
    name: 'New Name',
    posts: {
      update: {   // 更新关联数据
        where: { id: 1 },
        data: { title: 'Updated Title' }
      }
    }
  }
});

// 更新多条记录
const users = await prisma.user.updateMany({
  where: {
    email: {
      contains: '@example.com'
    }
  },
  data: {
    role: 'USER'
  }
});
```

```js
// 复杂条件查询
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: '@gmail.com' } },
      { email: { contains: '@hotmail.com' } }
    ],
    AND: {
      age: {
        gte: 18   // 大于等于
      }
    },
    NOT: {
      role: 'ADMIN'
    }
  }
});

// 关联查询条件
const posts = await prisma.post.findMany({
  where: {
    author: {
      email: {
        contains: '@example.com'
      }
    }
  }
});
```

```js
// 使用事务确保数据一致性
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User'
    }
  }),
  prisma.post.create({
    data: {
      title: 'Hello',
      authorId: 1
    }
  })
]);

// 交互式事务
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  const post = await tx.post.create({ ... });
  return { user, post };
});
```

```js
// 聚合查询
const aggregations = await prisma.user.aggregate({
  _count: {
    _all: true,    // 总数
    posts: true    // 关联数量
  },
  _avg: {
    age: true      // 平均值
  },
  _sum: {
    points: true   // 求和
  }
});

// 分组查询
const groupBy = await prisma.post.groupBy({
  by: ['authorId'],
  _count: {
    _all: true
  },
  having: {
    authorId: {
      _count: {
        gt: 10
      }
    }
  }
});
```

1. 生成和迁移命令：
```bash
npx prisma generate    # 生成客户端
npx prisma db push     # 直接推送 schema 变更到数据库
npx prisma migrate dev # 创建迁移并应用
```

2. 使用 Prisma Studio 可视化管理数据：
```bash
npx prisma studio
```

3. 格式化 schema 文件：
```bash
npx prisma format
```

4. 从现有数据库拉取 schema：
```bash
npx prisma db pull
```
