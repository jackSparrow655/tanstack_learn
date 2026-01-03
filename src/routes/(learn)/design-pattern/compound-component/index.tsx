import { createFileRoute } from '@tanstack/react-router'
import PostCard from './-components/PostCard'

export const Route = createFileRoute(
  '/(learn)/design-pattern/compound-component/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const post = {
    id: '1',
    createdBy: 'arijit@pharmaquant.org',
    description: 'This is good post dummy description.',
    tilte: 'First post',
  }
  return (
    <div className="flex-1 flex justify-center items-center">
      <PostCard post={post}>
        <PostCard.Title/>
        <PostCard.Description/>
        <PostCard.CreatedBy/>
        <PostCard.Buttons/>
      </PostCard>
    </div>
  )
}
