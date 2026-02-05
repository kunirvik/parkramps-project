import { useEffect, useState } from "react"
import BlogFeed from "./BlogFeed"

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/api/blog")

        if (!res.ok) {
          throw new Error("API error")
        }

        const data = await res.json()

        const sorted = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )

        setPosts(sorted)
      } catch (err) {
        console.error(err)
        setError("Не удалось загрузить блог")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <p>Загрузка…</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <section>
      <h1 className="text-[#757575]">Блог</h1>
      <BlogFeed posts={posts} />
    </section>
  )
}
