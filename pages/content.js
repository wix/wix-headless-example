import Link from "next/link";
import {useEffect, useState} from "react";

export default function Examples() {
    const [examples, setExamples] = useState([]);

    async function fetchExamples() {
        try {
            const response = await fetch('/examples.json');
            if (response.ok) {
                const examples = await response.json();
                setExamples(examples);
            } else {
                throw new Error('Failed to fetch examples');
            }
        } catch (error) {
            console.error('Error reading from file:', error);
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
