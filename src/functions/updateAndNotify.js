const { app } = require('@azure/functions');
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient();

app.http('updateAndNotify', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (req, context) => {
    try {
      const firms = await prisma.firm.findMany();
      const selected = firms.sort(() => 0.5 - Math.random()).slice(0, 5);

      const changes = [];

      for (const firm of selected) {
        const newStatus = firm.status === 'up' ? 'down' : 'up';
        await prisma.firm.update({
          where: { id: firm.id },
          data: { status: newStatus }
        });

        changes.push({
          id: firm.id,
          name: firm.name,
          oldStatus: firm.status,
          newStatus
        });
      }

      return {
        status: 200,
        jsonBody: {
          message: 'Promijenjeni statusi za 5 firmi.',
          changes
        }
      };

    } catch (err) {
      context.error('Greška prilikom ažuriranja firmi:', err);
      return {
        status: 500,
        jsonBody: { error: 'Greška prilikom ažuriranja firmi.' }
      };
    } finally {
      await prisma.$disconnect();
    }
  }
});
