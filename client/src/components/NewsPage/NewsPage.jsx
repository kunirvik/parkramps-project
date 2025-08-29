import { useEffect, useState } from "react";


export default function NewsPage() {
 const [youtubeNews, setYoutubeNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/youtube")
      .then(res => res.json())
      .then(data => setYoutubeNews(data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Новости из YouTube</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {youtubeNews.map((item) => (
          <div key={item.id.videoId} className="bg-white shadow rounded-xl p-4">
            <img
              src={item.snippet.thumbnails.medium.url}
              alt={item.snippet.title}
              className="rounded-lg mb-2"
            />
            <h2 className="font-semibold text-lg">{item.snippet.title}</h2>
            <p className="text-sm text-gray-600">{item.snippet.channelTitle}</p>
            <a
              href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 mt-2 inline-block"
            >
              Смотреть →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
