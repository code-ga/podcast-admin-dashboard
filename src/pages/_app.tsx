import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { NavBar } from "~/components/NavBar";
import { GlobalWrapper } from "~/components/GlobalWrapper";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <GlobalWrapper>
      <NavBar></NavBar>
      <Component {...pageProps} />
    </GlobalWrapper>
  );
};

export default api.withTRPC(MyApp);
