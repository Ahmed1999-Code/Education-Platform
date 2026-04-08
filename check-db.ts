import prisma from "./src/lib/prisma";

async function main() {
  console.log('--- Checking DB State ---');
  
  const users = await prisma.user.findMany({
    include: {
      studySubjects: true,
      studySessions: true
    }
  });

  console.log(`Found ${users.length} users.`);
  
  for (const user of users) {
    console.log(`\nUser: ${user.email} (ID: ${user.id})`);
    console.log(`Stats: XP=${user.xp}, Level=${user.level}, Streak=${user.currentStreak}`);
    console.log(`Subjects: ${user.studySubjects.length}`);
    for (const sub of user.studySubjects) {
      console.log(`  - ${sub.name}`);
    }
    console.log(`Sessions: ${user.studySessions.length}`);
    
    // Group sessions by subject
    const sessionsBySubject = user.studySessions.reduce((acc: any, session) => {
      acc[session.subjectId] = (acc[session.subjectId] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Sessions by subject ID:', sessionsBySubject);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
