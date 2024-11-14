/* eslint-disable @typescript-eslint/no-explicit-any */

import { Label } from '../ui/label';
import { Input } from '../ui/input';

const ChangeEmail = ({ props }: any) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Почта
        </Label>
        <Input
          id="email"
          className="col-span-4"
          maxLength={30}
          minLength={3}
          required
          placeholder={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChangeEmail;
