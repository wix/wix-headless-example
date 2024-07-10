import {useEffect, useState} from "react";
import {getMetaSiteId, installedApps} from "@/src/utils/installed-apps";
import Link from "next/link";

export default function Home() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msid, setMsid] = useState(null);
    useEffect(() => {
        async function checkInstalledApps() {
            const installedAppsList = await installedApps();
            setApps(installedAppsList);
            setMsid(await getMetaSiteId());
            setLoading(false);
        }

        checkInstalledApps();
    }, []);

    return (<>
        <article>
            <h1>Quick start examples with Next.js for Wix Headless</h1>
            <span>
                  This is an example site to demonstrate how to use Wix&apos;s business
                  solution APIs headless. Click each example to see how it works.
             </span>
            <span>
                <a href="https://dev.wix.com/api/sdk/about-wix-headless/overview">
                    Documentation
                </a> &nbsp;|&nbsp;
                <a href="https://github.com/wix-incubator/wix-headless-example">
                    Repo
                </a>
            </span>
            {!loading && !apps.length && (<div
                style={{
                    marginTop: "20px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#d7191c",
                    color: "#fff",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        style={{
                            width: "25px",
                            height: "25px",
                            marginRight: "10px",
                            verticalAlign: "middle",
                            fill: "#fff",
                        }}
                    >
                        <path
                            d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
                    </svg>
                    No Wix Apps Installed
                </h2>
                <span>
                    <h4>
                        Please install at least one of the following apps to see the
                        examples:
                    </h4>
                    <ul>
                        <li>Bookings</li>
                        <li>Store</li>
                        <li>Events</li>
                        <li>Subscriptions</li>
                    </ul>
                </span>
                <Link href={`https://manage.wix.com/dashboard/${msid}/headless-apps`} target={"_blank"} style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    color: "#d7191c",
                    borderRadius: "5px",
                    textDecoration: "none",
                    justifyContent: "center",
                    margin: "auto",
                }}>
                    Install Apps
                </Link>
            </div>)}
        </article>
    </>);
}
