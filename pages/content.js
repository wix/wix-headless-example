import Link from "next/link";
import {useEffect, useState} from "react";
import {installedApps} from "@/src/utils/installed-apps";

export default function Examples() {
    const [examples, setExamples] = useState([]);

    async function fetchExamples() {
        try {
            // Fetch the JSON file
            const response = await fetch('/examples.json');
            await installedApps();
            if (response.ok) {
                const examples = await response.json();
                setExamples(examples);
                console.log('Examples loaded from file');
            } else {
                throw new Error('Failed to fetch examples');
            }
        } catch (error) {
            console.error('Error reading from file:', error);
            // You might want to add a fallback here, such as setting an empty array
            setExamples([]);
        }
    }

    useEffect(() => {
        fetchExamples();
    }, []);

    return (
        <footer>
            {examples.map((example) => (
                <Link href={example.data.slug} key={example._id}>
                    <section>
                        <h2>
                            {example.data.title} <span>-&gt;</span>
                        </h2>
                        <p>{example.data.description}</p>
                    </section>
                </Link>
            ))}
        </footer>
    );
}
