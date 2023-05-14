import classnames from "classnames";
import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "~/components/Button";
import TextField from "~/components/TextField";
import { api } from "~/utils/api";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";

const ChatRoom: NextPage = () => {
  const router = useRouter()
  const scrollableRef = useRef<HTMLDivElement>(null)
  const postsQuery = api.message.infinite.useInfiniteQuery({},
    {
      getPreviousPageParam: (d) => d.prevCursor,
    }
  )
  const [messages, setMessages] = useState<Post[]>(() => {
    const msgs = postsQuery.data?.pages.map(page => page.items).flat() ?? []
    return msgs
  })
  const addMessages = useCallback((incoming?: Post[]) => {
    setMessages((current) => {
      const map: Record<Post['id'], Post> = {}
      for (const msg of current ?? []) {
        map[msg.id] = msg
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg
      }
      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
    })
  }, [])
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState<string>('')
  const [chatroom, setChatroom] = useState<string>('')
  const { mutate: sendMessageMutation } = api.message.send.useMutation()

  const { username: usernameParam, chatroom: chatroomParam } = router.query

  const scrollToBottomOfList = useCallback(() => {
    if (scrollableRef.current == null) {
      return
    } else {
      scrollableRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [scrollableRef])

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
    const msgs = postsQuery.data?.pages.map(page => page.items).flat()
    addMessages(msgs)
  }, [postsQuery.data?.pages, addMessages])
  useEffect(() => {
    if (!usernameParam) {
      void router.push('/')
    } else if (usernameParam) {
      if (Array.isArray(usernameParam)) {
        if (typeof (usernameParam[0]) === 'string' && usernameParam[0]) {
          setAuthor(usernameParam[0])
        } else {
          void router.push('/')
        }
      } else {
        setAuthor(usernameParam)
      }
    }
    if (!chatroomParam) {
      void router.push('/')
    } else if (chatroomParam) {
      if (Array.isArray(chatroomParam)) {
        if (typeof (chatroomParam[0]) === 'string' && chatroomParam[0]) {
          setChatroom(chatroomParam[0])
        } else {
          void router.push('/')
        }
      } else {
        setChatroom(chatroomParam)
      }
    }
  }, [usernameParam, chatroomParam])
  useEffect(() => {
    scrollToBottomOfList()
  }, [])
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
    sendMessageMutation({ author, content: message, chatroom }, {
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