import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { createClient, OAuthStrategy } from "@wix/sdk";

const myWixClient = createClient({
  auth: OAuthStrategy({
    clientId: `a491d07a-24a9-4b64-a566-0525c26a081b`,
    tokens: JSON.parse(Cookies.get("session") || null),
  }),
});

export default function LoginCallback() {
  const [nextPage, setNextPage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  async function verifyLogin() {
    const data = JSON.parse(localStorage.getItem("oauthRedirectData"));
    localStorage.removeItem("oauthRedirectData");

    try {
      const { code, state } = myWixClient.auth.parseFromUrl();
      const tokens = await myWixClient.auth.getMemberTokens(code, state, data);
      Cookies.set("session", JSON.stringify(tokens));
      window.location = data?.originalUri || "/";
    } catch (e) {
      setNextPage(data?.originalUri || "/");
      setErrorMessage(e.toString());
    }
  }

  useEffect(() => {
    verifyLogin();
  }, []);

  return (
    <article>
      {errorMessage && (
        <>
          <span>{errorMessage}</span>
          <br />
          <br />
        </>
      )}
      {nextPage ? <a href={nextPage}>Continue</a> : <>Loading...</>}
    </article>
  );
}
