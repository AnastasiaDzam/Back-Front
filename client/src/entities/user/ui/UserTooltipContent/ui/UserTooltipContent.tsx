import type { CatType } from '@/entities/user/model';

export function UserTooltipContent({
  firstName,
  lastName,
  email,
}: Pick<CatType, 'firstName' | 'lastName' | 'email'>): React.JSX.Element {
  return (
    <div>
      <div>
        <strong>{`${firstName} ${lastName}`}</strong>
      </div>
      <div>{email}</div>
    </div>
  );
}
