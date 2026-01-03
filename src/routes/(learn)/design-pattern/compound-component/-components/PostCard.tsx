import { Button } from '@/components/ui/button'
import { createContext, useContext, type PropsWithChildren } from 'react'

export type PostCardProps = PropsWithChildren & {
  post: {
    id: string
    tilte: string
    description: string
    createdBy: string
  }
}

const PostContext = createContext<PostCardProps | undefined>(undefined)
const usePostContext = (): PostCardProps => {
  const context = useContext(PostContext)
  if (!context) {
    throw new Error('Context is undefined.')
  }
  return context
}

const PostCard = ({ post, children }: PostCardProps) => {
  return (
    <PostContext value={{ post }}>
      <div className="p-6 border border-gray-200 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4 transition duration-300 hover:shadow-xl">
        {children}
      </div>
    </PostContext>
  )
}
PostCard.Title = () => {
  const { post } = usePostContext()
  return (
    <h2 className="font-bold text-3xl text-red-600 truncate">{post.tilte}</h2>
  )
}
PostCard.Description = () => {
  const { post } = usePostContext()
  return <p className="text-gray-400">{post.description}</p>
}
PostCard.CreatedBy = () => {
  const { post } = usePostContext()
  return <p className="text-sm text-gray-300">By {post.createdBy}</p>
}
PostCard.Buttons = () => {
  return (
    <div className="flex gap-4 mt-auto">
      <Button>See more</Button>
      <Button>View details</Button>
    </div>
  )
}

export default PostCard
