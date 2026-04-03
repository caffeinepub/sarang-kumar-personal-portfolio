import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("sk-dark-mode");
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
    localStorage.setItem("sk-dark-mode", String(isDark));
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="text-muted-foreground hover:text-primary transition-colors"
      data-ocid="navbar.toggle"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
