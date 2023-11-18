import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";

export default function App({ Component, pageProps }) {
  const queryclient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryclient}>
        <Component {...pageProps} />;
      </QueryClientProvider>
    </div>
  );
}
