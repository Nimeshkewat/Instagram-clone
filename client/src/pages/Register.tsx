import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { type RegisterInput } from "../../../shared/src/index";
import { Link } from "react-router-dom";

function Register() {
  const [input, setInput] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
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
            value={input.username}
            onChange={handleChange}
          />
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            className="focus-visible:ring-transparent"
            value={input.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit">Register</Button>
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
