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

function Login() {
  const [input, setInput] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [inputError, setInputErrors] = useState<Partial<LoginInput>>({});
  const { mutate, isPending } = useLogin();
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
      onSuccess: () => {
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
    <div className="flex items-center justify-center h-screen">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="shadow-lg flex flex-col gap-5 p-6"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl uppercase">Logo</h1>
          <p className="text-sm text-center">
            Login to see photos and videos from your friends.
          </p>
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
            <p className="text-red-500 font-normal text-sm">
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
            <p className="text-red-500 font-normal text-sm">
              {inputError.password}
            </p>
          )}
        </div>
        <Button disabled={isPending} type="submit">
          {isPending ? <Loader size={16} /> : "Login"}
        </Button>
        <hr />
        <div>
          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
