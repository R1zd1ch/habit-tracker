import { differenceInDays } from 'date-fns';

function calculateMissedDays(createdAt: string, completedDays: number): number | false {
  const createdDate = new Date(createdAt);
  const today = new Date();
  const daysSinceCreated = differenceInDays(today, createdDate);

  return daysSinceCreated > completedDays ? daysSinceCreated - completedDays : false;
}

export default calculateMissedDays;
