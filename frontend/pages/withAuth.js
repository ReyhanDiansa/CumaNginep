import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = window.localStorage.getItem("token");
      const role = window.localStorage.getItem("role");

      if (!token) {
        router.push("/login");
      }
      else{
        const currentPath = router.asPath;
        if (role === "admin" && !currentPath.startsWith("/admin")) {
          router.push("/admin");
        } else if (role === "resepsionis" && !currentPath.startsWith("/resepsionis")) {
          router.push("/resepsionis");
        }
      }

      
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
