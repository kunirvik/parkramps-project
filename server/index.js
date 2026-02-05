require('dotenv').config();
const express = require('express');

// const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const cloudinary = require('./cloudinary.config');

const { loadCompanyPosts } = require("./blog/loadCompanyPosts")
// const mongoose = require("mongoose")


const app = express();

// app.use(cors(
//   {origin: 'https://parkramps-project.vercel.app',
//   credentials: true}
// ));

app.use(cors());

app.use(express.json());



// // подключаемся к MongoDB
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.log('❌ Mongo error', err));

app.get('/', (req, res) => res.send('API работает'));

// app.listen(5000, () => console.log('🚀 Server started on port 5000'));

const API_KEY = process.env.YOUTUBE_API_KEY;




app.get("/api/youtube", async (req, res) => {
  const query = "новости"; // можно делать динамическим
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=10&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.items);

    
    // const videos = data.items.map(item => ({
    //   id: item.id.videoId,
    //   type: "video",
    //   title: item.snippet.title,
    //   date: item.snippet.publishedAt,
    //   source: "YouTube",
    //   url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    // }))

    // res.json(videos)
  } catch (err) {
    res.status(500).json({ error: "Ошибка при загрузке данных" });
  }
});










// GET /api/gallery
app.get('/api/gallery', async (req, res) => {
  try {console.log(
  'Cloudinary env:',
  !!process.env.CLOUDINARY_CLOUD_NAME,
  !!process.env.CLOUDINARY_API_KEY,
  !!process.env.CLOUDINARY_API_SECRET
);
    const tags = req.query.tags ? req.query.tags.split(',') : []; // Получаем массив тегов из запроса
    const folderName = 'Parkramps';

    let expression = `folder:${folderName}`;
    
    if (tags.length > 0) {
      const tagFilters = tags.map(tag => `tags=${tag}`).join(" AND "); // Формируем запрос
      expression += ` AND ${tagFilters}`;
    }


    const result = await cloudinary.search

      .expression(expression)
      .with_field('context') 
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    res.json(result.resources);
  } catch (error) {
    console.error('Ошибка при получении изображений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});




app.get("/api/blog", (req, res) => {
  try {
    const posts = loadCompanyPosts()

    const sorted = posts.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )

    res.json(sorted)
  } catch (err) {
    console.error("Blog error:", err)
    res.status(500).json({ error: "Ошибка загрузки блога" })
  }
})





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});








