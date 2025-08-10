// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function NewsPage() {
//   const [news, setNews] = useState([]);
//   const [form, setForm] = useState({ title: "", content: "", youtubeUrl: "" });

//   const fetchNews = async () => {
//     const res = await axios.get("https://your-server-domain.com/api/news");
//     setNews(res.data);
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("https://your-server-domain.com/api/news", form);
//     setForm({ title: "", content: "", youtubeUrl: "" });
//     fetchNews();
//   };

//   const getYoutubeEmbed = (url) => {
//     const id = url.split("v=")[1]?.split("&")[0];
//     return `https://www.youtube.com/embed/${id}`;
//   };

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Новости</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-4 mb-6">
//         <input
//           type="text"
//           className="w-full border p-2 rounded"
//           placeholder="Заголовок"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />
//         <textarea
//           className="w-full border p-2 rounded"
//           placeholder="Содержание"
//           value={form.content}
//           onChange={(e) => setForm({ ...form, content: e.target.value })}
//         />
//         <input
//           type="text"
//           className="w-full border p-2 rounded"
//           placeholder="Ссылка на YouTube"
//           value={form.youtubeUrl}
//           onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Добавить новость
//         </button>
//       </form>

//       {news.map((item) => (
//         <div key={item.id} className="mb-6 border p-4 rounded shadow">
//           <h2 className="text-xl font-semibold">{item.title}</h2>
//           <p className="text-sm text-gray-600 mb-2">{new Date(item.createdAt).toLocaleString()}</p>
//           <p className="mb-2">{item.content}</p>
//           <iframe
//             className="w-full h-64"
//             src={getYoutubeEmbed(item.youtubeUrl)}
//             title="YouTube Video"
//             allowFullScreen
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
