'use client';
import { useSidebar } from '@/components/ui/sidebar';

import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    // <button onClick={toggleSidebar}>Toggle Sidebar</button>
    <div className="pt-3 p-0 m-0" onClick={toggleSidebar}>
      {open ? (
        <GoSidebarExpand className="text-black/50 dark:text-white/80" size={30} />
      ) : (
        <GoSidebarCollapse className="text-black/50 dark:text-white/80" size={30} />
      )}
    </div>
  );
}
