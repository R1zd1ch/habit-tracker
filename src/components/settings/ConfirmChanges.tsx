import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';

const ConfirmChanges = ({
  handleSubmit,
}: {
  handleSubmit: (email: string, password: string) => void;
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Старая почта
          </Label>
          <Input
            id="title"
            className="col-span-3"
            value={email}
            maxLength={30}
            minLength={3}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Старый пароль
          </Label>
          <Input
            id="title"
            className="col-span-3"
            value={password}
            maxLength={30}
            minLength={3}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={() => handleSubmit(email, password)}>Подтвердить</Button>
    </DialogContent>
  );
};

export default ConfirmChanges;
