import { useLiveUpdate } from '@/features/LiveUpdateProvider';

export function useIsUserOnline(userId: number): boolean {
  const { users } = useLiveUpdate();
  return users.map((el) => el.id).includes(userId);
}
