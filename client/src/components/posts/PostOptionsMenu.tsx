import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

type PostOptionsMenuProps = {
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function PostOptionsMenu({
  disabled = false,
  onEdit,
  onDelete,
}: PostOptionsMenuProps) {
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
        aria-label="Post options"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="rounded-full p-1.5 transition hover:bg-gray-100 disabled:opacity-50"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onEdit)}
            className="w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-gray-50"
          >
            Edit post
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleAction(onDelete)}
            className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete post
          </button>
        </div>
      )}
    </div>
  );
}

export default PostOptionsMenu;
