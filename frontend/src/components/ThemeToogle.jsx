import React from "react";

import {useSelector, useDispatch} from "react-redux";
import { toggleTheme } from "../features/themeSlice";

const ThemeToogle = ()=>{
    const theme = useSelector((state)=>state.theme);
    const dispatch = useDispatch();

    return (
        <button
        onClick={()=>dispatch(toggleTheme())}
        className="p-2 rounded bg-gray-200 dark:bg-gray-800"
    >
      {theme === "lofi" ? "🌞 lofi" : "🌙 carm"}
    </button> 
   );
};

export default ThemeToogle;