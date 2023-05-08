import { NextPage } from "next";
import { Head } from "next/document";
import TextField from "~/components/TextField";

const ChatRoom: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-[800px] h-[100vh] border flex flex-col border-black gap-10 p-10">
        <div className="bg-slate-900 rounded-xl grow">

        </div>
        <div>
          <TextField />
        </div>
      </div>
    </main>
  );
}

export default ChatRoom