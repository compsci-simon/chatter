import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";

const Home: NextPage = () => {
  const [name, setName] = useState('')
  const [chatroom, setChatroom] = useState('general')
  const router = useRouter()
  const submithandler = () => {
    if (name !== '') {
      router.push(`/chatroom?username=${name}&chatroom=${chatroom}`)
    }
  }

  return (
    <>
      <Head>
        <title>Chatter</title>
        <meta name="description" content="Chatter - a realtime chat application" />
        <link rel="icon" href="/bird.png" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="md:w-[400px] w-[90%] bg-slate-300 rounded-xl flex flex-col p-5 gap-5">
          <TextField value={name} submithandler={submithandler} placeholder="Your name" onChange={e => setName(e.target.value)} />
          <TextField value={chatroom} submithandler={submithandler} placeholder="The chat room you would like to join" onChange={e => setChatroom(e.target.value)} />
          <Button onClick={submithandler}>Chat now</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
