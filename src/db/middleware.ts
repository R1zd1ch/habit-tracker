// prisma/middleware.ts

import prisma from './db';

prisma.$use(async (params, next) => {
  if (params.model === 'Progress' && (params.action === 'create' || params.action === 'update')) {
    const result = await next(params);
    if (result.completed) {
      await prisma.habit.update({
        where: { id: result.habitId },
        data: { show: false },
      });
    }

    return result;
  }

  return next(params);
});
