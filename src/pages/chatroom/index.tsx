import classnames from "classnames";
import { NextPage } from "next";
import { Head } from "next/document";
import Button from "~/components/Button";
import TextField from "~/components/TextField";

const ChatRoom: NextPage = () => {
  let messages = [
    {
      author: 'john',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    },
    {
      author: 'hannah',
      content: 'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
    },
    {
      author: 'Jill',
      content: 'Excepteur sint occaecat cupidatat non'
    },
    {
      author: 'Jack',
      content: 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  ]
  messages = Array.from({ length: 10 }, () => messages).flat()

  const renderMessages = (username: string) => {
    return <div className="flex flex-col gap-5">
      {messages.map((message, index) => {
        const outerClasses = classnames('w-full flex',
          { 'justify-end': message.author === username },
        )
        const innerClasses = classnames('text-black flex flex-col p-2 rounded-lg w-[80%]',
          { 'bg-white': message.author !== username },
          { 'bg-green-300': message.author === username },
        )
        return <div role='scrollable-content' className={outerClasses}>
          <div key={index} className={innerClasses}>
            <span className="font-light text-xs">
              {message.author}
            </span>
            <p>
              {message.content}
            </p>
          </div>
        </div>
      })}
    </div>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-[800px] h-[100vh]  flex flex-col gap-10 p-10 relative z-0">
        <div className="grow relative overflow-hidden z-10">
          <div className="grow w-full h-full p-5 relative scroll-auto overflow-auto">
            {renderMessages('john')}
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl grow opacity-20 p-5 absolute z-0 left-5 right-5 top-5 bottom-5">
        </div>
        <div className="flex gap-5 justify-end">
          <TextField />
          <Button>Send</Button>
        </div>
      </div>
    </main>
  );
}

export default ChatRoom