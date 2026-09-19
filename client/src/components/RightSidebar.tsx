import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const suggestions = ["alex", "maria", "dev_guy", "sam"];

function RightSidebar() {
  return (
    <aside className="sticky top-6 hidden w-72 shrink-0 py-8 lg:block">
      <div className="mb-6 flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="you" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold">your_username</p>
          <p className="text-sm text-gray-500">Your name</p>
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold text-gray-500">
        Suggested for you
      </p>

      <ul className="space-y-3">
        {suggestions.map((name) => (
          <li key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{name}</span>
            </div>
            <button
              type="button"
              className="text-sm font-semibold text-blue-500"
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default RightSidebar;
