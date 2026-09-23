import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import ThemeProvider from "@/components/common/ThemeProvider";
import ToastProvider from "@/components/common/ToastProvider";
import { APP_NAME, APP_TAGLINE, THEME_STORAGE_KEY } from "@/lib/utils/constants";

export const metadata = {
  title: {
    default: `${APP_NAME} | ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Monitor transactions, detect suspicious activity, investigate fraud alerts, and protect banking operations with intelligent risk analysis. An academic banking fraud detection simulation.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint so the saved / system theme is applied without a flash.
const themeScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
