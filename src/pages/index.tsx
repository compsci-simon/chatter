import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";

const Home: NextPage = () => {
  const [name, setName] = useState('')
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Chatter</title>
        <meta name="description" content="Chatter - a realtime chat application" />
        <link rel="icon" href="/bird.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="w-[400px] bg-slate-300 rounded-xl flex flex-col p-5 gap-5">
          <TextField value={name} onChange={e => setName(e.target.value)} />
          <Button onClick={() => router.push(`/chatroom?username=${name}&chatroom=general`)}>Chat now</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
