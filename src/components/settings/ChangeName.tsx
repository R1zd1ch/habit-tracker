/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const ChangeName = ({ props }: { props: any }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Имя
        </Label>
        <Input
          id="name"
          className="col-span-4"
          maxLength={30}
          minLength={3}
          required
          placeholder={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChangeName;
