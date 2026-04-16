import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const prismaClientSingleton = () => {
  // If running on Cloudflare Workers edge (OpenNext injects bindings into process.env)
  if (process.env.DB) {
    const adapter = new PrismaD1(process.env.DB as any)
    return new PrismaClient({ adapter })
  }
  
  // Fallback for local development (`next dev`) and build time
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
