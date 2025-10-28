import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Building, School, Award } from "lucide-react";

// ParkrampsLanding.jsx
// Однофайловий React-компонент зі стилями Tailwind
// Використовуйте в своєму проекті: імпортуйте та вставте <ParkrampsLanding />

export default function ParkrampsLanding() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      {/* Header / Nav */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-xl p-3">
              <span className="text-xl">PR</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Parkramps</h1>
              <p className="text-xs text-gray-500">Проектування • Виробництво • Монтаж</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center text-sm">
            <a href="#services" className="hover:text-indigo-600">Послуги</a>
            <a href="#projects" className="hover:text-indigo-600">Проєкти</a>
            <a href="#for-developers" className="hover:text-indigo-600">Застройникам</a>
            <a href="#for-schools" className="hover:text-indigo-600">Школам</a>
            <a href="#contact" className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-95">Зв'язатися</a>
          </nav>

          <div className="md:hidden">
            <button className="p-2 rounded-lg bg-gray-100">Меню</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-extrabold leading-tight"
          >
            Створюємо сучасні <span className="text-indigo-600">скейтпарки</span>, рампи та екстрим-майданчики по всій Україні
          </motion.h2>

          <p className="mt-6 text-gray-600">
            Parkramps — повний цикл: від концепції та 3D-проєкту до виробництва, монтажу та організації заходів. Ідеально для парків,
            новобудов, шкіл та муніципальних проєктів.
          </p>

          <div className="mt-8 flex gap-4">
            <a href="#contact" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow">Отримати пропозицію</a>
            <a href="#projects" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border">Портфоліо</a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <li className="flex items-start gap-3">
              <Award className="w-6 h-6 text-indigo-600" />
              <div>
                <div className="font-semibold">Стандарт безпеки</div>
                <div className="text-gray-500">Сертифіковані матеріали</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Building className="w-6 h-6 text-indigo-600" />
              <div>
                <div className="font-semibold">Під ключ</div>
                <div className="text-gray-500">Проєктування, виробництво, монтаж</div>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <School className="w-6 h-6 text-indigo-600" />
              <div>
                <div className="font-semibold">Для шкіл</div>
                <div className="text-gray-500">Безпечні зони для уроків та гуртків</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-lg border">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              {/* Placeholder for hero image or image carousel */}
              <span className="text-gray-500">Фото проєкту (замініть зображення)</span>
            </div>
            <div className="p-4 bg-white">
              <div className="text-sm text-gray-600">Останній реалізований проєкт</div>
              <h3 className="font-semibold">Скейтпарк у Львові — 2025</h3>
              <p className="text-gray-500 text-sm mt-2">Великий урбан-парк з рампами, зонами для початківців та трибунами.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold">Наші послуги</h2>
        <p className="mt-2 text-gray-600">Комплексні рішення для міст, девелоперів та шкіл</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-semibold">Проєктування та 3D-концепти</h3>
            <p className="mt-3 text-gray-500">Індивідуальні плани з урахуванням бюджету, ландшафту та цільової аудиторії.</p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>3D-візуалізації</li>
              <li>Розрахунок навантажень</li>
              <li>План розвитку майданчика</li>
            </ul>
          </article>

          <article className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-semibold">Виробництво рамп і фігур</h3>
            <p className="mt-3 text-gray-500">Модульні та монолітні рішення з тривалим терміном служби.</p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Металеві та фанерні рампи</li>
              <li>Модульні системи для швидкого монтажу</li>
              <li>Індивідуальний дизайн</li>
            </ul>
          </article>

          <article className="bg-white p-6 rounded-2xl shadow-sm border">
            <h3 className="font-semibold">Монтаж і сервіс</h3>
            <p className="mt-3 text-gray-500">Монтаж з гарантією, сервісне обслуговування та навчання персоналу.</p>
            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>Професійний монтаж</li>
              <li>Інструкції з експлуатації</li>
              <li>Сервісні договори</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Projects / Portfolio */}
      <section id="projects" className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Реалізовані проєкти</h2>
            <p className="text-gray-600 mt-1">Приклади скейтпарків, памп-треків і модульних зон</p>
          </div>
          <a href="#contact" className="text-sm text-indigo-600">Попросити кейс-стаді</a>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              <div className="h-40 bg-gray-200 flex items-center justify-center">Фото проєкту #{i + 1}</div>
              <div className="p-4">
                <h4 className="font-semibold">Проєкт #{i + 1}</h4>
                <p className="text-gray-500 text-sm mt-2">Короткий опис. Підхід: безпека, довговічність, стиль.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For developers and schools */}
      <section id="for-developers" className="container mx-auto px-6 py-12 bg-gradient-to-r from-white to-gray-50">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold">Рішення для девелоперів і парків</h3>
            <p className="mt-3 text-gray-600">Екстрим-майданчики підвищують привабливість ЖК та створюють досяжні точки залучення мешканців.</p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Підвищення конкурентності вашого проєкту</li>
              <li>Готові модулі, що прискорюють будівництво</li>
              <li>Комплексна інфраструктура для відпочинку та спорту</li>
            </ul>

            <a href="#contact" className="inline-block mt-6 bg-indigo-600 text-white px-5 py-3 rounded-lg">Отримати комерційну пропозицію</a>
          </div>

          <div>
            <h3 className="text-xl font-bold">Рішення для шкіл</h3>
            <p className="mt-3 text-gray-600">Безпечні майданчики для фізичного розвитку, гуртків та заходів на свіжому повітрі.</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Програми для уроків фізкультури</li>
              <li>Спрощений догляд та інструктажи</li>
              <li>Доступні бюджетні варіанти</li>
            </ul>

            <a href="#contact" className="inline-block mt-6 border border-indigo-600 text-indigo-600 px-5 py-3 rounded-lg">Замовити проєкт для школи</a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h3 className="text-xl font-bold">Зв'язатися з Parkramps</h3>
            <p className="text-gray-600 mt-2">Напишіть нам — підготуємо технічне завдання і попередню кошторисну пропозицію.</p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Офіс</div>
                  <div className="text-gray-500">Київ, Україна</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Телефон</div>
                  <div className="text-gray-500">+38 (0XX) XXX-XX-XX</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-gray-500">info@parkramps.ua</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">Працюємо по всій Україні. Всі проєкти відповідають стандартам безпеки.</div>
          </div>

          <form className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
            <div>
              <label className="text-sm font-medium">Ім'я</label>
              <input type="text" className="mt-2 w-full border rounded-md px-3 py-2" placeholder="Ім'я або компанія" />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input type="email" className="mt-2 w-full border rounded-md px-3 py-2" placeholder="email@company.ua" />
            </div>

            <div>
              <label className="text-sm font-medium">Повідомлення</label>
              <textarea className="mt-2 w-full border rounded-md px-3 py-2" rows={5} placeholder="Коротко опишіть завдання або запит" />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" className="bg-indigo-600 text-white px-5 py-3 rounded-lg">Відправити</button>
              <button type="button" className="border px-4 py-2 rounded-lg">Завантажити комерційну пропозицію</button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} Parkramps — Скейтпарки і екстрим-майданчики в Україні</div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#">Політика конфіденційності</a>
            <a href="#">Умови співпраці</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
