import Loader from "@/components/ui/Loader";
import { useCheckAuth } from "@/hooks/users/useCheckAuth";
import { createContext, useContext, type ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useCheckAuth();
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size={50} />
      </div>
    );
  const isAuthenticated = !isError && data?.user ? true : false;

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
export default AuthContextProvider;
