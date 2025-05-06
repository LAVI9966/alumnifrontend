
import AdminThemeToggle from "./AdminThemeToggle";

import { useTheme } from "@/context/ThemeProvider";

const AdminHeader = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`${isDark ? 'bg-[#232B4A]' : 'bg-white'} p-4 py-4 flex justify-between items-center shadow-md`}>
      <p className={`text-xl font-bold transition-colors duration-200 ${isDark ? 'text-white' : 'text-[#131A45]'}`}>Admin Dashboard</p>
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <AdminThemeToggle />
      </div>
    </div>
  );
};

export default AdminHeader;
