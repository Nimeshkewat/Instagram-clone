import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { X, ArrowLeft, Image, Smile, MapPin, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreatePost } from "@/hooks/posts/useCreatePost";
import { useProfile } from "@/hooks/users/useProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Step = "upload" | "crop" | "details";

type CreatePostDialogProps = {
  open: boolean;
  onClose: () => void;
};

function CreatePostDialog({ open, onClose }: CreatePostDialogProps) {
  const [step, setStep] = useState<Step>("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreatePost();
  const queryClient = useQueryClient();
  const { data: profileData } = useProfile();

  const MAX_CHARS = 2200;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStep("crop");
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onCaptionChange = (v: string) => {
    if (v.length > MAX_CHARS) return;
    setCaption(v);
    setCharCount(v.length);
  };

  const handleClose = useCallback(() => {
    setStep("upload");
    setPreviewUrl(null);
    setCaption("");
    setLocation("");
    setCharCount(0);
    setSelectedFile(null);
    onClose();
  }, [onClose]);

  const handleBack = () => {
    if (step === "details") setStep("crop");
    else if (step === "crop") {
      setPreviewUrl(null);
      setStep("upload");
    }
  };

  const handleShare = () => {
    if (!selectedFile) {
      toast.error("Please select an image to share.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);
    formData.append("caption", caption.trim());
    if (location.trim()) formData.append("location", location.trim());

    mutate(formData, {
      onSuccess: async () => {
        toast.success("Post created successfully");
        handleClose();
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
          queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
        ]);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ?? "Could not create your post.",
        );
      },
    });
  };

  if (!open) return null;

  const stepTitle =
    step === "upload"
      ? "Create new post"
      : step === "crop"
        ? "Crop"
        : "Create new post";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={handleClose}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-gray-200 px-4 py-3">
          {step !== "upload" && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-3 rounded-full p-1 hover:bg-gray-100"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <span className="text-sm font-semibold">{stepTitle}</span>
          {step !== "upload" && (
            <button
              type="button"
              disabled={
                (step === "details" && (!caption.trim() || isPending)) ||
                (step === "crop" ? false : false)
              }
              onClick={step === "crop" ? () => setStep("details") : handleShare}
              className="absolute right-4 text-sm font-semibold text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              {step === "crop" ? "Next" : isPending ? "Sharing..." : "Share"}
            </button>
          )}
          {step === "upload" && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 rounded-full p-1 hover:bg-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Step: upload */}
          {step === "upload" && (
            <div
              className={`flex flex-1 flex-col items-center justify-center gap-4 p-8 transition ${
                isDragging ? "bg-blue-50" : "bg-white"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Image size={40} className="text-gray-400" />
              </div>
              <p className="text-xl font-light text-gray-700">
                Drag photos here
              </p>
              <p className="text-sm text-gray-400">
                PNG, JPG, HEIC up to 100MB
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Select from computer
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          )}

          {/* Step: crop */}
          {step === "crop" && previewUrl && (
            <div className="flex flex-1 items-center justify-center bg-black">
              <img
                src={previewUrl}
                alt="preview"
                className="max-h-[60vh] w-full object-contain sm:max-h-[70vh]"
              />
            </div>
          )}

          {/* Step: details */}
          {step === "details" && previewUrl && (
            <div className="flex flex-1 flex-col overflow-y-auto sm:flex-row">
              {/* Image preview — hidden on small screens */}
              <div className="hidden shrink-0 sm:block sm:w-70 md:w-85">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Details panel */}
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                {/* User row */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        profileData?.user?.profilePicture ??
                        "https://github.com/shadcn.png"
                      }
                      alt="you"
                    />
                    <AvatarFallback>
                      {profileData?.user?.username?.slice(0, 2).toUpperCase() ??
                        "CN"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">
                    {profileData?.user?.username ?? "your_username"}
                  </span>
                </div>

                {/* Caption */}
                <div>
                  <textarea
                    rows={5}
                    value={caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder="Write a caption…"
                    className="w-full resize-none text-sm outline-none placeholder:text-gray-400"
                  />
                  <div className="mt-1 flex items-center justify-between">
                    <button type="button" aria-label="Emoji">
                      <Smile size={18} className="text-gray-400" />
                    </button>
                    <span className="text-xs text-gray-400">
                      {charCount}/{MAX_CHARS}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Location */}
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Add location"
                    className="flex-1 text-sm outline-none placeholder:text-gray-400"
                  />
                  <MapPin size={18} className="text-gray-400" />
                </div>

                <div className="border-t border-gray-200" />

                {/* Tag people */}
                <button
                  type="button"
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">Tag people</span>
                  <Users size={18} className="text-gray-400" />
                </button>

                <div className="border-t border-gray-200" />

                {/* Accessibility */}
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-sm">Accessibility</span>
                    <span className="text-xs text-gray-400">›</span>
                  </button>
                </div>

                <div className="border-t border-gray-200" />

                {/* Advanced settings */}
                <div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between"
                  >
                    <span className="text-sm">Advanced settings</span>
                    <span className="text-xs text-gray-400">›</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePostDialog;
