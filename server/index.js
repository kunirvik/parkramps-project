
const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors(
  {origin: 'https://parkramps-project.vercel.app',
  credentials: true}
));


// app.use(bodyParser.json());

// const FILE_PATH = "news.json";

// // Чтение всех новостей
// app.get("/api/news", (req, res) => {
//   const data = JSON.parse(fs.readFileSync(FILE_PATH));
//   res.json(data);
// });

// // Добавление новости
// app.post("/api/news", (req, res) => {
//   const { title, content, youtubeUrl } = req.body;
//   const data = JSON.parse(fs.readFileSync(FILE_PATH));
//   const newItem = {
//     id: uuid(),
//     title,
//     content,
//     youtubeUrl,
//     createdAt: new Date()
//   };
//   data.push(newItem);
//   fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
//   res.status(201).json(newItem);
// });






// Конфигурация Cloudinary с использованием переменных окружения
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// GET /api/gallery
app.get('/api/gallery', async (req, res) => {
  try {
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






const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});








