import gettoken from "@/app/function/gettoken";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const useVerifyToken = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const url = process.env.NEXT_PUBLIC_URL;
  const [isChecking, setIsChecking] = useState(true); // Prevent unnecessary re-renders

  useEffect(() => {
    const verifyToken = async () => {
      const storedData = localStorage.getItem("alumni");
      if (!storedData) {
        setIsChecking(false); // Stop checking if no token is found
        return;
      }
      const { token } = await JSON.parse(storedData);
      if (!token) {
        // router.push("/alumni"); 
        setIsChecking(false); // Stop checking if no token is found
        return;
      }

      try {
        const response = await fetch(`${url}/api/auth/check-token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.removeItem("alumni");
        } else if (pathname !== "/alumni/homepage") {
          router.push("/alumni/homepage"); // Redirect only if token is valid
        }
      } catch (error) {
        console.error("Error checking token:", error);
        localStorage.removeItem("alumni");
        router.push("/alumni"); // Redirect on error
      } finally {
        setIsChecking(false); // Mark check as complete
      }
    };

    verifyToken();
  }, [router, pathname]);

  return isChecking; // Return the loading state
};

export default useVerifyToken;
