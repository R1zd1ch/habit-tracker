/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const ChangePassword = ({ props }: any) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Пароль
        </Label>
        <Input
          id="password"
          className="col-span-4"
          maxLength={30}
          minLength={3}
          autoComplete="new-password"
          required
          type="password"
          placeholder={'•••••••••••'}
          onChange={(e) => props.setPassword(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
