import { useLocation } from "react-router-dom";
import TopNavigation from "./TopNavigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const showTopNav = location.pathname !== "/";

  return (
    <>
      {showTopNav && <TopNavigation />}
      {children}
    </>
  );
};

export default AppLayout;