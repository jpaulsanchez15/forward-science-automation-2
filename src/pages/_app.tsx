import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import NextTopLoader from "nextjs-toploader";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <NextTopLoader />
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
