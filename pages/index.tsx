import Head from 'next/head';
import { FormEvent, useState } from 'react';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setPrompt('');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Head>
        <title>Scripts Made Easy</title>
        <meta name="description" content="Scripts Made Easy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Scripts Made Easy</h1>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter a keyword"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <input
            disabled={isGenerating}
            type="submit"
            value={isGenerating ? 'Generating...' : 'Generate script'}
          />
        </form>
        <p>{result}</p>
      </main>
    </>
  );
}
