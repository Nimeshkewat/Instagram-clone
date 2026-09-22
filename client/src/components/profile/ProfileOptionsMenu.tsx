import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

type ProfileOptionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

function ProfileOptionsMenu({ onEdit, onDelete }: ProfileOptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Profile options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="rounded-lg bg-gray-100 p-1.5 transition hover:bg-gray-200"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onEdit)}
            className="w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50"
          >
            Edit profile
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onDelete)}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete profile
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileOptionsMenu;
