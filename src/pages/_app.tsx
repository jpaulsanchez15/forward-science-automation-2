import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/themeProvider";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
