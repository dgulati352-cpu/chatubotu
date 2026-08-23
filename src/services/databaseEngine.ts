import { DatabaseSchema, DatabaseType, DatabaseModel, DatabaseColumn } from '../types/database';

export class DatabaseEngine {
  public static createInitialSchema(dbType: DatabaseType = 'postgresql', appTopic: string = 'SaaS'): DatabaseSchema {
    const isEcommerce = appTopic.toLowerCase().includes('shop') || appTopic.toLowerCase().includes('store') || appTopic.toLowerCase().includes('commerce');
    const isSocial = appTopic.toLowerCase().includes('social') || appTopic.toLowerCase().includes('chat') || appTopic.toLowerCase().includes('feed');

    let models: DatabaseModel[] = [];
    let mockData: Record<string, any[]> = {};

    if (isEcommerce) {
      models = [
        {
          id: 'user_model',
          name: 'User',
          tableName: 'users',
          description: 'Store registered customer and merchant accounts',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'email', type: 'String', isUnique: true, isNullable: false },
            { name: 'passwordHash', type: 'String', isNullable: false },
            { name: 'fullName', type: 'String', isNullable: false },
            { name: 'role', type: 'Enum', defaultValue: "'CUSTOMER'" },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        },
        {
          id: 'product_model',
          name: 'Product',
          tableName: 'products',
          description: 'Catalog items available for purchase',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'title', type: 'String', isNullable: false },
            { name: 'description', type: 'String', isNullable: true },
            { name: 'price', type: 'Float', isNullable: false },
            { name: 'stock', type: 'Int', defaultValue: '100' },
            { name: 'category', type: 'String', defaultValue: "'Electronics'" },
            { name: 'imageUrl', type: 'String', isNullable: true },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 4
        },
        {
          id: 'order_model',
          name: 'Order',
          tableName: 'orders',
          description: 'Customer purchase orders and fulfillment tracking',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'userId', type: 'UUID', isNullable: false, relationModel: 'User', relationType: '1:N' },
            { name: 'totalAmount', type: 'Float', isNullable: false },
            { name: 'status', type: 'Enum', defaultValue: "'PENDING'" },
            { name: 'paymentIntentId', type: 'String', isNullable: true },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        }
      ];

      mockData = {
        user_model: [
          { id: 'usr_01', email: 'alex.rivera@antigravity.io', fullName: 'Alex Rivera', role: 'ADMIN', createdAt: '2026-08-20T10:15:00Z' },
          { id: 'usr_02', email: 'elena.rostova@tech.com', fullName: 'Elena Rostova', role: 'CUSTOMER', createdAt: '2026-08-21T14:30:00Z' },
          { id: 'usr_03', email: 'kenji.sato@global.co', fullName: 'Kenji Sato', role: 'CUSTOMER', createdAt: '2026-08-22T09:00:00Z' }
        ],
        product_model: [
          { id: 'prd_01', title: 'Antigravity Neural Pro Earbuds', description: 'Ultra-low latency AI noise canceling audio', price: 249.99, stock: 45, category: 'Audio', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60' },
          { id: 'prd_02', title: 'Quantum Kinetic Smartwatch', description: 'Holographic display and biometrics tracker', price: 399.00, stock: 28, category: 'Wearables', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60' },
          { id: 'prd_03', title: 'Cyberpunk Mechanical Keyboard', description: 'RGB hot-swappable optical switches', price: 179.50, stock: 80, category: 'Peripherals', imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60' },
          { id: 'prd_04', title: '4K Ultra Horizon Curved Monitor', description: '240Hz OLED gaming & studio display', price: 899.99, stock: 15, category: 'Displays', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60' }
        ],
        order_model: [
          { id: 'ord_101', userId: 'usr_02', totalAmount: 399.00, status: 'DELIVERED', paymentIntentId: 'pi_398a8dfa', createdAt: '2026-08-22T11:20:00Z' },
          { id: 'ord_102', userId: 'usr_03', totalAmount: 429.49, status: 'PROCESSING', paymentIntentId: 'pi_991823ab', createdAt: '2026-08-23T08:15:00Z' },
          { id: 'ord_103', userId: 'usr_02', totalAmount: 899.99, status: 'PENDING', paymentIntentId: 'pi_772183fa', createdAt: '2026-08-23T10:45:00Z' }
        ]
      };
    } else if (isSocial) {
      models = [
        {
          id: 'user_model',
          name: 'User',
          tableName: 'users',
          description: 'Social network member profile and credentials',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'username', type: 'String', isUnique: true, isNullable: false },
            { name: 'displayName', type: 'String', isNullable: false },
            { name: 'avatarUrl', type: 'String', isNullable: true },
            { name: 'bio', type: 'String', isNullable: true },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        },
        {
          id: 'post_model',
          name: 'Post',
          tableName: 'posts',
          description: 'User feeds, media posts, and announcements',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'authorId', type: 'UUID', isNullable: false, relationModel: 'User', relationType: '1:N' },
            { name: 'content', type: 'String', isNullable: false },
            { name: 'likesCount', type: 'Int', defaultValue: '0' },
            { name: 'tags', type: 'Json', defaultValue: "'[]'" },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        }
      ];

      mockData = {
        user_model: [
          { id: 'usr_01', username: 'antigravity_dev', displayName: 'Nova Architect', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60', bio: 'Building the multi-agent decentralized web.' },
          { id: 'usr_02', username: 'cypher_pulse', displayName: 'Liam Vance', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60', bio: 'Fullstack React & Node.js Engineer.' }
        ],
        post_model: [
          { id: 'pst_01', authorId: 'usr_01', content: 'Dual AI agents just generated our fullstack microservices architecture in 3.4 seconds! 🚀', likesCount: 42, tags: ['ai', 'antigravity', 'fullstack'] },
          { id: 'pst_02', authorId: 'usr_02', content: 'Synced API contracts directly to Prisma schemas and React Query hooks flawlessly.', likesCount: 29, tags: ['prisma', 'typescript'] }
        ]
      };
    } else {
      // Default SaaS / Dashboard
      models = [
        {
          id: 'user_model',
          name: 'User',
          tableName: 'users',
          description: 'SaaS tenant users and role-based permissions',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'email', type: 'String', isUnique: true, isNullable: false },
            { name: 'fullName', type: 'String', isNullable: false },
            { name: 'role', type: 'Enum', defaultValue: "'DEVELOPER'" },
            { name: 'organizationId', type: 'UUID', isNullable: true },
            { name: 'isActive', type: 'Boolean', defaultValue: 'true' },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        },
        {
          id: 'project_model',
          name: 'Project',
          tableName: 'projects',
          description: 'Workspaces and application deployments',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'name', type: 'String', isNullable: false },
            { name: 'description', type: 'String', isNullable: true },
            { name: 'status', type: 'Enum', defaultValue: "'ACTIVE'" },
            { name: 'ownerId', type: 'UUID', isNullable: false, relationModel: 'User', relationType: '1:N' },
            { name: 'apiTokensCount', type: 'Int', defaultValue: '1' },
            { name: 'createdAt', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 3
        },
        {
          id: 'activity_model',
          name: 'ActivityLog',
          tableName: 'activity_logs',
          description: 'Audit trail and system telemetry events',
          columns: [
            { name: 'id', type: 'UUID', isPrimary: true, isNullable: false },
            { name: 'projectId', type: 'UUID', isNullable: false, relationModel: 'Project', relationType: '1:N' },
            { name: 'action', type: 'String', isNullable: false },
            { name: 'payload', type: 'Json', isNullable: true },
            { name: 'ipAddress', type: 'String', defaultValue: "'127.0.0.1'" },
            { name: 'timestamp', type: 'DateTime', defaultValue: 'now()' }
          ],
          rowsCount: 4
        }
      ];

      mockData = {
        user_model: [
          { id: 'usr_01', email: 'dhairya@antigravity.io', fullName: 'Dhairya Gulati', role: 'OWNER', isActive: true, createdAt: '2026-08-20T08:00:00Z' },
          { id: 'usr_02', email: 'sara.connor@cyber.io', fullName: 'Sara Connor', role: 'ADMIN', isActive: true, createdAt: '2026-08-21T11:20:00Z' },
          { id: 'usr_03', email: 'marcus.wright@nexus.net', fullName: 'Marcus Wright', role: 'DEVELOPER', isActive: true, createdAt: '2026-08-22T16:45:00Z' }
        ],
        project_model: [
          { id: 'prj_01', name: 'Nexus AI Cloud', description: 'High-speed autonomous multi-agent orchestration server', status: 'ACTIVE', ownerId: 'usr_01', apiTokensCount: 4, createdAt: '2026-08-20T09:30:00Z' },
          { id: 'prj_02', name: 'Pulse Realtime Telemetry', description: 'Distributed event stream processor with Redis bus', status: 'ACTIVE', ownerId: 'usr_01', apiTokensCount: 2, createdAt: '2026-08-21T12:00:00Z' },
          { id: 'prj_03', name: 'Quantum Analytics Engine', description: 'Data warehouse reporting & AI dashboard', status: 'PAUSED', ownerId: 'usr_02', apiTokensCount: 1, createdAt: '2026-08-22T14:10:00Z' }
        ],
        activity_model: [
          { id: 'log_01', projectId: 'prj_01', action: 'DEPLOY_BACKEND_CONTAINER', payload: { version: '2.4.0', status: 'SUCCESS' }, timestamp: '2026-08-23T10:00:00Z' },
          { id: 'log_02', projectId: 'prj_01', action: 'GENERATE_FRONTEND_UI', payload: { components: 18, routes: 5 }, timestamp: '2026-08-23T10:05:00Z' },
          { id: 'log_03', projectId: 'prj_02', action: 'DATABASE_MIGRATION_APPLIED', payload: { schema: 'v3_users_orders' }, timestamp: '2026-08-23T11:15:00Z' },
          { id: 'log_04', projectId: 'prj_01', action: 'GITHUB_COMMIT_SYNC', payload: { sha: 'a89c2f1', branch: 'main' }, timestamp: '2026-08-23T11:45:00Z' }
        ]
      };
    }

    const defaultUriMap: Record<DatabaseType, string> = {
      postgresql: 'postgresql://postgres:secret_antigravity@localhost:5432/app_db?schema=public',
      sqlite: 'file:./dev.db',
      mysql: 'mysql://root:secret@localhost:3306/app_db',
      mongodb: 'mongodb+srv://admin:secret@cluster0.antigravity.mongodb.net/app_db?retryWrites=true&w=majority',
      supabase: 'https://xyzcompany.supabase.co',
      redis: 'redis://default:token@fly-antigravity-redis.upstash.io:6379'
    };

    return {
      id: `db_${Date.now()}`,
      type: dbType,
      name: `${appTopic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_db`,
      connectionUri: defaultUriMap[dbType] || defaultUriMap.postgresql,
      models,
      mockData,
      rawQueriesHistory: [
        {
          id: 'q_01',
          query: 'SELECT * FROM users LIMIT 10;',
          executedAt: Date.now() - 60000,
          rowCount: models[0]?.rowsCount || 3,
          status: 'success',
          durationMs: 4.2
        }
      ]
    };
  }

  public static generatePrismaSchema(schema: DatabaseSchema): string {
    const providerMap: Record<DatabaseType, string> = {
      postgresql: 'postgresql',
      sqlite: 'sqlite',
      mysql: 'mysql',
      mongodb: 'mongodb',
      supabase: 'postgresql',
      redis: 'postgresql'
    };

    let prisma = `// Prisma Schema generated by Antigravity Database Agent
// Database Type: ${schema.type.toUpperCase()}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${providerMap[schema.type]}"
  url      = env("DATABASE_URL")
}

`;

    schema.models.forEach(model => {
      prisma += `model ${model.name} {\n`;
      model.columns.forEach(col => {
        let typeStr: string = col.type;
        if (col.type === 'UUID') typeStr = 'String @id @default(uuid())';
        else if (col.type === 'String' && col.isPrimary) typeStr = 'String @id @default(cuid())';
        else if (col.type === 'Int' && col.isPrimary) typeStr = 'Int @id @default(autoincrement())';
        else if (col.type === 'DateTime') typeStr = 'DateTime @default(now())';
        else if (col.type === 'Json') typeStr = 'Json?';
        else if (col.type === 'Enum') typeStr = 'String @default("ACTIVE")';
        else if (col.isNullable) typeStr = `${col.type}?`;

        if (col.isUnique && !typeStr.includes('@id')) {
          typeStr += ' @unique';
        }
        if (col.defaultValue && !typeStr.includes('@default')) {
          typeStr += ` @default(${col.defaultValue})`;
        }

        prisma += `  ${col.name.padEnd(16)} ${typeStr}\n`;
      });
      prisma += `\n  @@map("${model.tableName}")\n}\n\n`;
    });

    return prisma;
  }

  public static generateSqlDdl(schema: DatabaseSchema): string {
    let sql = `-- SQL Migration DDL Generated by Antigravity Database Agent
-- Target Engine: ${schema.type.toUpperCase()}
-- Generated at: ${new Date().toISOString()}

`;

    schema.models.forEach(model => {
      sql += `CREATE TABLE IF NOT EXISTS "${model.tableName}" (\n`;
      const colDefs = model.columns.map(col => {
        let sqlType = 'VARCHAR(255)';
        if (col.type === 'UUID') sqlType = 'UUID';
        else if (col.type === 'Int') sqlType = 'INTEGER';
        else if (col.type === 'Float') sqlType = 'NUMERIC(12, 2)';
        else if (col.type === 'Boolean') sqlType = 'BOOLEAN';
        else if (col.type === 'DateTime') sqlType = 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP';
        else if (col.type === 'Json') sqlType = 'JSONB';

        let constraints = '';
        if (col.isPrimary) constraints += ' PRIMARY KEY';
        if (!col.isNullable && !col.isPrimary) constraints += ' NOT NULL';
        if (col.isUnique && !col.isPrimary) constraints += ' UNIQUE';
        if (col.defaultValue && !col.isPrimary && col.type !== 'DateTime') constraints += ` DEFAULT ${col.defaultValue}`;

        return `  "${col.name}" ${sqlType}${constraints}`;
      });

      sql += colDefs.join(',\n');
      sql += `\n);\n\n`;
    });

    return sql;
  }
}
