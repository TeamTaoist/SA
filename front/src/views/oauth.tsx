import { memo, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { LOCAL_OAUTH_KEY } from "../constants";

interface IProps {
  code: string | null;
  msgFrom?: string;
}

const Twitter = memo(({ code, msgFrom }: IProps) => {
  useEffect(() => {
    const bc = new BroadcastChannel("SA_OAUTH");
    bc.postMessage({ code, msgFrom, msgType: LOCAL_OAUTH_KEY.Twitter });
    console.log('post message done.!!!')
    window.close();
  }, [code]);
  return <>oauth success</>;
});

// const Discord = memo(({ code, msgFrom }: IProps) => {
//   useEffect(() => {
//     const bc = new BroadcastChannel("SA_OAUTH");
//     bc.postMessage({ code, msgFrom, msgType: LOCAL_OAUTH_KEY.Discord });
//     window.close();
//   }, [code]);
//   return <>oauth success</>;
// });

const Oauth = memo(() => {
  const [params] = useSearchParams();
  return (
    <Routes>
      <Route path="twitter" element={<Twitter code={params.get("code")} msgFrom={params.get("state")?.split("_")[1]} />} />
      {/* <Route path="discord" element={<Discord code={params.get("code")} msgFrom={params.get("state")?.split("_")[1]} />} /> */}
    </Routes>
  );
});

export default Oauth;
