import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { loginSchema, type LoginInput } from "@instagram-clone/shared";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";
import { useLogin } from "@/hooks/users/useLogin";
import { useQueryClient } from "@tanstack/react-query";

function Login() {
  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [inputError, setInputErrors] = useState<Partial<LoginInput>>({});
  const { mutate, isPending } = useLogin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (inputError[name as keyof LoginInput]) {
      setInputErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse(input);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setInputErrors({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      return;
    }
    setInputErrors({});

    mutate(input, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["check-auth"] });
        navigate("/");
        setInput({ email: "", password: "" });
        toast.success("Login successful");
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
            Login to see photos and videos from your friends.
          </p>
        </div>

        <div className="space-y-5">
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
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
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? <Loader size={16} /> : "Login"}
          </Button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div>
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-500">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
