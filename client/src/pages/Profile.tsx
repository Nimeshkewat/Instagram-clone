import { useState, type ChangeEvent } from "react";
import { Grid3x3, Bookmark, Film } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/users/useProfile";
import { usePosts } from "@/hooks/posts/usePosts";
import Loader from "@/components/ui/Loader";
import ProfilePostsGrid from "@/components/profile/ProfilePostsGrid";
import ProfileOptionsMenu from "@/components/profile/ProfileOptionsMenu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/users/useUpdateProfile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ProfileSavedGrid from "@/components/profile/ProfileSavedGrid";
import FollowingAndFollowersDialog from "@/components/profile/FollowingAndFollowersDialog";
import type { FollowListType } from "@/types/users";
import { useParams } from "react-router-dom";
import { useSuggestedUsers } from "@/hooks/users/useSuggestedUsers";

const TABS = [
  { id: "posts", label: "Posts", icon: <Grid3x3 size={16} /> },
  { id: "reels", label: "Reels", icon: <Film size={16} /> },
  { id: "saved", label: "Saved", icon: <Bookmark size={16} /> },
];

const genderOptions = [
  { label: "Select a gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

function Profile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formValues, setFormValues] = useState({
    username: "",
    bio: "",
    gender: "",
  });

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfile();
  const { data: ownPostsData } = usePosts();
  const { data: feedData, isLoading: isFeedLoading } = usePosts(
    "feed",
    Boolean(userId),
  );
  const { data: suggestedData, isLoading: isUsersLoading } = useSuggestedUsers(
    Boolean(userId),
  );
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const queryClient = useQueryClient();

  const [type, setType] = useState<FollowListType>("followers");
  const [open, setOpen] = useState(false);

  const isOwnProfile = !userId;
  const visibleTabs = isOwnProfile
    ? TABS
    : TABS.filter((tab) => tab.id === "posts");
  const user = isOwnProfile
    ? profileData?.user
    : suggestedData?.suggestedUsers.find(
        (suggestedUser) => suggestedUser._id === userId,
      );
  const posts = isOwnProfile
    ? (ownPostsData?.posts ?? [])
    : (feedData?.posts.filter(
        (post) =>
          typeof post.author !== "string" && post.author?._id === userId,
      ) ?? []);

  if (
    isProfileLoading ||
    (userId !== undefined && (isUsersLoading || isFeedLoading))
  ) {
    return (
      <div className="flex min-h-65 items-center justify-center">
        <Loader size={28} />
      </div>
    );
  }

  if ((isOwnProfile && isProfileError) || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Unable to load your profile.
      </div>
    );
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleOpenDialog = () => {
    setFormValues({
      username: user.username ?? "",
      bio: user.bio ?? "",
      gender: user.gender ?? "",
    });
    setImageFile(null);
    setImagePreview(user.profilePicture ?? "");
    setOpenEditDialog(true);
  };

  const handleUpdate = () => {
    const formData = new FormData();

    formData.append("username", formValues.username.trim());
    formData.append("bio", formValues.bio.trim());
    if (formValues.gender) {
      formData.append("gender", formValues.gender);
    }
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    }

    updateProfile(formData, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        setOpenEditDialog(false);
        setImageFile(null);
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ?? "Unable to update profile.",
        );
      },
    });
  };

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
      <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex justify-center sm:block sm:shrink-0">
          <Avatar className="h-24 w-24 ring-2 ring-gray-200 ring-offset-2 sm:h-36 sm:w-36">
            <AvatarImage
              src={user.profilePicture ?? "https://github.com/shadcn.png"}
              alt={user.username}
            />
            <AvatarFallback className="text-2xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-center text-xl font-semibold sm:text-left">
              {user.username}
            </h1>
            <div className="flex justify-center gap-2 sm:justify-start">
              {isOwnProfile && (
                <button
                  type="button"
                  className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold transition hover:bg-gray-200"
                  onClick={handleOpenDialog}
                >
                  Edit Profile
                </button>
              )}
              {isOwnProfile && (
                <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                  <DialogContent className="space-y-4">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={imagePreview || user.profilePicture}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg text-muted-foreground">
                          {user.username}
                        </h2>
                      </div>

                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button type="button" variant="secondary">
                        <Label
                          htmlFor="profile-image"
                          className="cursor-pointer"
                        >
                          Change photo
                        </Label>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Username</p>
                      <Input
                        value={formValues.username}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="h-10 focus-visible:ring-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Bio</p>
                      <Input
                        value={formValues.bio}
                        onChange={(e) =>
                          setFormValues((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className="h-10 focus-visible:ring-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Gender</p>
                      <Select
                        value={formValues.gender}
                        onValueChange={(value) =>
                          setFormValues((prev) => ({
                            ...prev,
                            gender: value ?? "",
                          }))
                        }
                      >
                        <SelectTrigger className="w-full max-w-full">
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {genderOptions.map((item) => (
                              <SelectItem
                                key={item.value || "placeholder"}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleUpdate}
                        disabled={isPending}
                      >
                        {isPending ? "Updating..." : "Update"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              {isOwnProfile && <ProfileOptionsMenu />}
            </div>
          </div>

          <div className="flex justify-center gap-8 sm:justify-start">
            <Stat count={posts.length} label="posts" />
            {isOwnProfile ? (
              <button
                type="button"
                aria-label="View followers"
                className="cursor-pointer"
                onClick={() => {
                  setType("followers");
                  setOpen(true);
                }}
              >
                <Stat count={user.followers?.length ?? 0} label="followers" />
              </button>
            ) : (
              <Stat count={user.followers?.length ?? 0} label="followers" />
            )}
            {isOwnProfile ? (
              <button
                type="button"
                aria-label="View following"
                className="cursor-pointer"
                onClick={() => {
                  setType("followings");
                  setOpen(true);
                }}
              >
                <Stat count={user.followings?.length ?? 0} label="following" />
              </button>
            ) : (
              <Stat count={user.followings?.length ?? 0} label="following" />
            )}
          </div>

          {isOwnProfile && open && (
            <FollowingAndFollowersDialog
              open={open}
              setOpen={setOpen}
              type={type}
            />
          )}

          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="mt-1 max-w-xs text-sm text-gray-700">
              {user.bio ?? "No bio yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-4 overflow-x-auto pb-2 sm:gap-6">
        {["Travel", "Food", "Pets", "Friends", "Events"].map((label) => (
          <div
            key={label}
            className="flex shrink-0 flex-col items-center gap-1"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-gray-300 ring-offset-2">
              <img
                src={`https://picsum.photos/seed/${label}/80/80`}
                alt={label}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="flex">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-t-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition sm:text-xs ${
                activeTab === tab.id
                  ? "border-gray-800 text-gray-800"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "posts" && (
        <ProfilePostsGrid posts={posts} canDelete={isOwnProfile} />
      )}
      {isOwnProfile && activeTab === "saved" && <ProfileSavedGrid />}
    </div>
  );
}

function Stat({ count, label }: { count: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:gap-1">
      <span className="font-semibold">{count}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default Profile;
