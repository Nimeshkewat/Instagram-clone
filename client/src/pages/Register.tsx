import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { registerSchema, type RegisterInput } from "@/schema/user";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useRegister } from "@/hooks/users/useRegister";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { Eye, EyeOffIcon } from "lucide-react";

function Register() {
  const [inputType, setInputType] = useState<"password" | "text">("password");
  const [input, setInput] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
  });
  const [inputError, setInputErrors] = useState<Partial<RegisterInput>>({});
  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (inputError[name as keyof RegisterInput]) {
      setInputErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = registerSchema.safeParse(input);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setInputErrors({
        username: fieldErrors.username?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      return;
    }
    setInputErrors({});

    mutate(input, {
      onSuccess: () => {
        navigate("/login");
        setInput({ username: "", email: "", password: "" });
        toast.success("Account created successfully");
      },
      onError: (error) => {
        toast.error(
          error.response?.data.message ||
            "Something went wrong. Please try again later.",
        );
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em] uppercase text-gray-900">
            Logo
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Register to see photos and videos from your friends.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              className="focus-visible:ring-transparent"
              required
              value={input.username}
              onChange={handleChange}
            />
            {inputError.username && (
              <p className="text-sm font-normal text-red-500">
                {inputError.username}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              className="focus-visible:ring-transparent"
              value={input.email}
              onChange={handleChange}
            />
            {inputError.email && (
              <p className="text-sm font-normal text-red-500">
                {inputError.email}
              </p>
            )}
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              type={inputType === "password" ? "password" : "text"}
              name="password"
              id="password"
              className="focus-visible:ring-transparent"
              required
              value={input.password}
              onChange={handleChange}
            />
            {inputError.password && (
              <p className="text-sm font-normal text-red-500">
                {inputError.password}
              </p>
            )}
            <p
              onClick={() =>
                setInputType((prev) =>
                  prev === "password" ? "text" : "password",
                )
              }
              className="absolute top-7 right-3 cursor-pointer"
            >
              {inputType === "password" ? (
                <EyeOffIcon size={20} />
              ) : (
                <Eye size={20} />
              )}
            </p>
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader size={16} /> : "Register"}
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          By signing up you agree to our Terms. Data policy and Cookies Policy.
        </p>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div>
          <p className="text-center text-sm text-gray-600">
            Have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
