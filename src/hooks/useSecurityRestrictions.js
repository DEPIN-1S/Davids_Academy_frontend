import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function useSecurityRestrictions() {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // 1️⃣ Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning("🚫 Right-click is disabled!", { autoClose: 2000 });
    };

    // 2️⃣ Disable keyboard shortcuts (copy, paste, cut, print, save, view-source)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "p", "s", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        toast.error("🚫 This action is not allowed!", { autoClose: 2000 });
      }
    };

    // 3️⃣ Detect DevTools
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        document.body.innerHTML =
          "<h2 style='text-align:center;margin-top:20%'>🚫 Restricted Content</h2>";
      }
    };
    const interval = setInterval(detectDevTools, 1000);

    // 4️⃣ Apply watermark with user info
    if (user?.email) {
      document.body.setAttribute("data-user", user.email);
      document.body.setAttribute("data-time", new Date().toLocaleString());
    } else {
      document.body.setAttribute("data-user", "Guest");
      document.body.setAttribute("data-time", new Date().toLocaleString());
    }

    // Add listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);
}
