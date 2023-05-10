import classnames from "classnames";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/Button";
import TextField from "~/components/TextField";
import { api } from "~/utils/api";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { string } from "zod";

let m: Post[] = [
  {
    id: 'asf',
    author: 'john',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    createdAt: new Date(2023, 4, 9)
  },
  {
    id: '1234',
    author: 'hannah',
    content: 'nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    createdAt: new Date(2023, 4, 8)
  },
  {
    id: 'fg',
    author: 'Jill',
    content: 'Excepteur sint occaecat cupidatat non',
    createdAt: new Date(2023, 4, 7)
  },
  {
    id: 'sg',
    author: 'Jack',
    content: 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    createdAt: new Date(2023, 4, 6)
  }
]
m = Array.from({ length: 10 }, () => m).flat()
const ChatRoom: NextPage = () => {
  const router = useRouter()
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(m)
  const [author, setAuthor] = useState<string>('')
  const { mutate: sendMessageMutation } = api.message.send.useMutation()

  const { username } = router.query
  console.log('username', username)

  const scrollToBottom = () => {
    if (scrollableRef.current) {
      const scrollableElement = scrollableRef.current;
      scrollableElement.scrollTop = scrollableElement.scrollHeight;
    }
  };

  const renderMessages = (username: string) => {
    return <div className="flex flex-col gap-5">
      {messages.map((message, index) => {
        const outerClasses = classnames('w-full flex',
          { 'justify-end': message.author === username },
        )
        const innerClasses = classnames('text-black flex flex-col p-2 rounded-lg w-[80%]',
          { 'bg-slate-200': message.author !== username },
          { 'bg-green-300': message.author === username },
        )
        return <div key={index} role='scrollable-content' className={outerClasses}>
          <div className={innerClasses}>
            <span className="font-light text-xs">
              {message.author} - {message.createdAt.toUTCString()}
            </span>
            <p>
              {message.content}
            </p>
          </div>
        </div>
      })}
    </div>
  }

  useEffect(() => {
    if (!username) {
      router.push('/')
    } else if (username) {
      if (Array.isArray(username)) {
        if (typeof (username[0]) === 'string' && username[0]) {
          setAuthor(username[0])
        } else {
          router.push('/')
        }
      } else {
        setAuthor(username)
      }
    }
    scrollToBottom()
  }, [username])
  // subscribe to new posts and add
  api.message.onAdd.useSubscription(undefined, {
    onData(data) {
      setMessages([...messages, data])
    },
    onError(err) {
      console.error('Subscription error:', err);
      // we might have missed a message - invalidate cache
    },
  })

  const sendMessage = () => {
    setMessage('')
    sendMessageMutation({ author, content: message }, {
      onSuccess: (data) => {
        console.log(data)
      }
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="w-[800px] h-[100vh]  flex flex-col gap-10 p-10 relative z-0">
        <div ref={scrollableRef} className="grow w-full h-full p-5 relative overflow-auto z-10 hide-scrollbar">
          {renderMessages(author)}
        </div>
        <div className="bg-slate-900 rounded-xl grow opacity-20 p-5 absolute z-0 left-5 right-5 top-5 bottom-5">
        </div>
        <div className="flex gap-5 justify-end z-10">
          <TextField value={message} onChange={e => setMessage(e.target.value)} />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </main>
  );
}

export default ChatRoom