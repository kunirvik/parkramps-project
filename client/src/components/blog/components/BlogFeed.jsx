import BlogCard from "./BlogCard"

export default function BlogFeed({ posts }) {
  return (
    <div className="blog-feed">
      {posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
