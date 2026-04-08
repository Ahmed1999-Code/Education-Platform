import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting data cleanup...')

  // 1. Delete all study sessions
  const deletedSessions = await prisma.studySession.deleteMany({})
  console.log(`Deleted ${deletedSessions.count} study sessions.`)

  // 2. Reset user statistics
  const updatedUsers = await prisma.user.updateMany({
    data: {
      xp: 0,
      level: 1,
      currentStreak: 0,
    }
  })
  console.log(`Reset statistics for ${updatedUsers.count} users.`)

  console.log('Cleanup complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
