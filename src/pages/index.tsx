import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Button from "~/components/Button";
import TextField from "~/components/TextField";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [name, setName] = useState('')

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="w-[400px] bg-slate-300 rounded-xl flex flex-col p-5 gap-5">
          <TextField value={name} onChange={e => setName(e.target.value)} />
          <Button>Chat now</Button>
        </div>
      </main>
    </>
  );
};

export default Home;
