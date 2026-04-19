import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { Sun, Moon, Cloud } from "lucide-react";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  // Apply theme on first load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="btn btn-sm btn-outline flex items-center gap-2"
    >
      {theme === "light" && <Sun size={16} />}
      {theme === "dark" && <Moon size={16} />}
      {theme === "weather" && <Cloud size={16} />}

      {theme}
    </button>
  );
};

export default ThemeToggle;