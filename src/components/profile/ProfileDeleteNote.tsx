import { X } from 'lucide-react';

const DeleteNote = ({ id, onDelete }: { id: number; onDelete: (id: number) => void }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/notes?noteId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        console.log('Note deleted');
        onDelete(id);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting note:', error.message);
      }
    }
  };
  return <X onClick={handleDelete}></X>;
};

export default DeleteNote;
