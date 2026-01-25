import { useTheme } from "next-themes";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ConfigProvider } from "antd";
import { getMuiTheme, getAntdTheme } from "@/theme/appTheme";
import { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering children without providers until mounted,
  // or default to light/system. Better to wait for mount.
  if (!mounted) {
    return <>{children}</>;
  }

  const mode = (theme === "dark" || resolvedTheme === "dark") ? "dark" : "light";
  const muiTheme = getMuiTheme(mode);
  const antdTheme = getAntdTheme(mode);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ConfigProvider theme={antdTheme}>
        <CssBaseline />
        {children}
      </ConfigProvider>
    </MuiThemeProvider>
  );
}
