import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { useSearch } from "@/hooks/users/useSearch";
import { useDebounce } from "@/hooks/custom/useDebounce";

function SearchUsers() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data, isLoading, isError } = useSearch(debouncedSearch);

  const users = data?.users || [];

  return (
    <section className="mx-auto min-h-[calc(100dvh-10rem)] max-w-2xl">
      <header className="sticky top-14 z-10 border-b border-gray-200 bg-white px-4 py-4 md:top-0">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
            aria-label="Search users by name or email"
            className="h-10 border-0 bg-gray-100 pl-10 focus-visible:ring-1"
          />
        </div>
      </header>

      <div className="px-4 py-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size={26} />
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-sm text-red-600">
            Could not load users.
          </p>
        ) : users.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {debouncedSearch
              ? "No users match your search."
              : "No other users found."}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {users.map((user) => (
              <li key={user._id}>
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-3 py-3 transition hover:bg-gray-50"
                >
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {user.username}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default SearchUsers;
