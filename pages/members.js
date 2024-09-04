import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { members } from "@wix/members";
import { CLIENT_ID } from "@/constants/constants";
import { useAsyncHandler } from "@/src/hooks/async-handler";
import LoginModal from "@/src/components/ui/modals/login-modal";
import { useRouter } from "next/navigation";
import { InfoModal } from "@/src/components/ui/modals/info-modal";
import Link from "next/link";
import { getMetaSiteId } from "@/src/utils/installed-apps";
import { handleCopyUrl } from "@/src/utils/utils";

// We're creating a Wix client using the createClient function from the Wix SDK.
const myWixClient = createClient({
  // We specify the modules we want to use with the client.
  // In this case, we're using the members' module.
  modules: { members },

  // We're using the OAuthStrategy for authentication.
  // This strategy requires a client ID and a set of tokens.
  auth: OAuthStrategy({
    // The client ID is a unique identifier for the application.
    // It's used to authenticate the application with the Wix platform.
    clientId: CLIENT_ID,

    // The tokens are used to authenticate the user.
    // In this case, we're getting the tokens from a cookie named "session".
    // If the cookie doesn't exist, we default to null.
    tokens: JSON.parse(Cookies.get("session") || null),
  }),
});

const WixLogin = () => {};

export default function LoginBar() {
  // State variable to store the current member.
  const [member, setMember] = useState(null);
  const [msid, setMsid] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSandboxInfoModal, setShowSandboxInfoModal] = useState(false);
  const [url, setUrl] = useState("");

  const handleAsync = useAsyncHandler();
  const router = useRouter();

  // This function fetches the current member.
  async function fetchMember() {
    await handleAsync(async () => {
      // We check if the user is logged in using the loggedIn method from the auth module of the Wix client.
      // If the user is logged in, we call the getCurrentMember method from the members module of the Wix client.
      // This method retrieves the current member.
      // If the user is not logged in, we default to an empty object.
      const { member } = myWixClient.auth.loggedIn()
        ? await myWixClient.members.getCurrentMember()
        : {};

      // Then, we update the state of the member in the React component.
      // If the member is undefined, we default to undefined.
      setMember(member || undefined);

      // We get the metaSiteId.
      setMsid(await getMetaSiteId());

      // We set the URL.
      setUrl(window.location.href);
    });
  }

  // This function initiates the login process.
  async function login() {
    setShowLoginModal(false);
    // If the user is running the app in the CodeSandbox environment, we display a message.
    const url = window.location.hostname;
    const csbUrlType = /^[a-zA-Z0-9]+-\d+\.csb\.app$/;
    if (csbUrlType.test(url) && !localStorage.getItem("sandboxInfoModal")) {
      setShowSandboxInfoModal(true);
      return;
    }
    try {
      await handleAsync(async () => {
        // We call the generateOAuthData method from the auth module of the Wix client.
        // This method generates the necessary data for the OAuth authentication process.
        // We specify the redirect URI for the authentication callback page.
        const data = myWixClient.auth.generateOAuthData(
          `${window.location.origin}/login-callback`,
          window.location.href,
        );

        // We store the generated OAuth data in the local storage.
        // This data will be used later in the authentication process.
        localStorage.setItem("oauthRedirectData", JSON.stringify(data));

        // We call the getAuthUrl method from the auth module of the Wix client.
        // This method generates the URL for the authentication page.
        const { authUrl } = await myWixClient.auth.getAuthUrl(data);

        // Finally, we redirect the user to the authentication page.
        window.location = authUrl; // Wix auth will send the user back to the callback page (login-callback.js)
      });
    } catch (error) {
      // If an error occurs during the login process, we log the error to the console.
      console.error("Login error:", error);
    }
  }

  // This function initiates the logout process.
  async function logout() {
    await handleAsync(async () => {
      // We call the logout method from the auth module of the Wix client.
      // This method generates the URL for the logout page.
      // We pass the current page URL as the parameter.
      const { logoutUrl } = await myWixClient.auth.logout(window.location.href);

      // We remove the session cookie.
      // This effectively logs the user out on the client side.
      Cookies.remove("session");

      // Finally, we redirect the user to the logout page.
      window.location = logoutUrl;
    });
  }

  // open login modal when clicking the login button
  const handleLoginModal = () => {
    myWixClient.auth.loggedIn() ? logout() : setShowLoginModal(true);
  };

  // Fetch the current member when the component mounts.
  useEffect(() => {
    fetchMember();
  }, []);

  return (
    <div>
      {/* We check if the member state is not null. If it's not null, we render a section. */}
      {member !== null && (
        <section
          // When the section is clicked, we check if the user is logged in.
          // If the user is logged in, we call the logout function.
          // If the user is not logged in, we call the login function.
          // onClick={() => (myWixClient.auth.loggedIn() ? logout() : login())}
          onClick={handleLoginModal}
          style={{
            cursor: "pointer",
          }}
        >
          <h3>
            {/* We display a greeting message. */}
            Hello{" "}
            {/* If the user is logged in, we display the user's nickname or slug, if they exist.
                          If neither exist, we display an empty string.
                          If the user is not logged in, we display "visitor". */}
            {myWixClient.auth.loggedIn()
              ? member.profile?.nickname || member.profile?.slug || ""
              : "visitor"}
            ,
          </h3>
          {/* We display a link that allows the user to login or logout.
                    The text of the link depends on whether the user is logged in or not. */}
          <span>{myWixClient.auth.loggedIn() ? "Logout" : "Login"}</span>
        </section>
      )}
      {/* display login modal when clicking the login button */}
      <LoginModal
        openModal={showLoginModal}
        WixLoginAction={login} // login with Wix
        CustomLoginAction={() => {
          setShowLoginModal(false);
          router.push("/custom-login");
        }} // login with custom login
        onClose={() => setShowLoginModal(false)}
      />
      {/* display sandbox info modal when running in CodeSandbox */}
      <InfoModal
        openModal={showSandboxInfoModal}
        title={"CodeSandbox Environment Detected"}
        content={
          <>
            <p>
              We&rsquo;ve detected that you&rsquo;re running the app in the
              CodeSandbox environment.
              <br />
              In order to experience the full functionality of the Wix Login
              Method,
              <br />
              If you running your own client-id please add the generated URL
              that CodeSandbox provides (
              <span
                onClick={handleCopyUrl}
                style={{
                  color: "#116DFF",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5em",
                }}
              >
                {url}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{
                    width: "1em",
                    height: "1em",
                    verticalAlign: "middle",
                    fill: "#116DFF",
                  }}
                >
                  <path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z" />
                </svg>
              </span>
              ) to the Wix App settings.
              <Link
                href={`https://manage.wix.com/dashboard/${msid}/oauth-apps-settings/manage/${CLIENT_ID}`}
                target={"_blank"}
                style={{ color: "#116DFF" }}
              >
                (OAuth Redirect URL)
              </Link>
            </p>
            <br />
            <p>
              Alternatively, if you didn&rsquo;t provide your own client-id, you
              can test this feature from the{" "}
              <Link
                href={`https://wix-headless-example.vercel.app/`}
                target={"_blank"}
                style={{ color: "#116DFF" }}
              >
                deployed version of the app
              </Link>
            </p>
          </>
        }
        onClose={() => setShowSandboxInfoModal(false)}
        primaryAction={() => {
          localStorage.setItem("sandboxInfoModal", true);
        }}
      />
    </div>
  );
}
