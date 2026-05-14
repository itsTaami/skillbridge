import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { SavedProvider } from "@/context/SavedContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SavedProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SavedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
