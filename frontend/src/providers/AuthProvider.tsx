import { axiosInstance } from "@/lib/axois";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const { checkAdminStats } = useAuthStore();
  const { initSocket, disconnectedSocket } = useChatStore();
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
          //init socket
          if (userId) initSocket(userId);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
    return () => {
      disconnectedSocket();
    };
  }, [getToken, checkAdminStats, initSocket, userId, disconnectedSocket]);

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
