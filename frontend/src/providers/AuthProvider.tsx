import { axiosInstance } from "@/lib/axois";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const { checkAdminStats } = useAuthStore();

  const updateApiToken = async (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdminStats();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [getToken, checkAdminStats]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center  justify-center">
        <Loader className="size-8  text-emerald-500 animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthProvider;
