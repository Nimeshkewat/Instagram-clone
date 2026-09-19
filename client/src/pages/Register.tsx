import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { registerSchema, type RegisterInput } from "../../../shared/src/index";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useRegister } from "@/hooks/users/useRegister";
import { toast } from "sonner";
import Loader from "@/components/ui/Loader";

function Register() {
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
    <div className="flex items-center justify-center h-screen">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="shadow-lg flex flex-col gap-5 p-6"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl uppercase">Logo</h1>
          <p className="text-sm text-center">
            Register to see photos and videos from your friends.
          </p>
        </div>

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
            <p className="text-red-500 font-normal text-sm">
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
          {isPending ? <Loader size={16} /> : "Register"}
        </Button>
        <p className="text-center text-sm text-muted-foreground max-w-lg">
          By signing up you agree to our Terms. Data policy and Cookies Policy.
        </p>
        <hr />
        <div>
          <p className="text-center">
            Have an account?{" "}
            <Link to="/login" className="text-blue-400">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Register;
