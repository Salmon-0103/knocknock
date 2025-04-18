// pages/index.js
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>KnockKnock 首頁</title>
      </Head>
      <main className="p-8">
        <h1 className="text-3xl font-bold">👋 歡迎來到 KnockKnock</h1>
        <p className="mt-4 text-lg">這是一個簡單的社群貼文平台</p>
      </main>
    </>
  );
}
