import Head from "next/head";
import { Input } from "@/src/components/ui/input";
import { login } from "@/src/utils/custom-login";
import styles from "@/styles/app.module.css";
import { useState } from "react";
import { useAsyncHandler } from "@/src/hooks/async-handler";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const handleAsync = useAsyncHandler();

  const loginHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await handleAsync(async () => {
        const res = await login(email, password);
        if (res.error) {
          setLoginError(
            "Login failed. Please check your credentials and try again.",
          );
          return;
        }
        setLoginError("");
      });
    } catch (error) {
      setLoginError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          className={`${styles.column} ${styles.center}`}
          style={{
            width: "100%",
            maxWidth: "30vw",
          }}
        >
          <div>
            <h2>Login</h2>
          </div>

          <form onSubmit={loginHandler} style={{ width: "100%" }}>
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              style={{ width: "100%" }}
            />

            <label htmlFor="password">Password</label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              style={{ width: "100%" }}
            />
            {loginError && (
              <div
                style={{
                  color: "#ed4337",
                  marginBottom: "1rem",
                }}
              >
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className={styles.primary}
              style={{
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Login Page",
      hideTitle: true,
    },
  };
}
