import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Ticket, Users } from "lucide-react";

// SLS-style Extreme Event Landing Page
// Single-file React component using Tailwind CSS + Framer Motion
// Drop into a React app (Next.js or CRA) with Tailwind configured.

export default function ProjectPage() {
  const lineup = [
    { name: "Alex " , country: "USA", trick: "Kickflip Backside" },
    { name: "Marina", country: "BRA", trick: "Hardflip Double" },
    { name: "Toshi", country: "JPN", trick: "Nollie 360" },
    { name: "Rico", country: "ESP", trick: "Late Flip" },
    { name: "Zoe", country: "CAN", trick: "Heelflip Frontside" },
    { name: "Luka", country: "CRO", trick: "Switch Flip" },
  ];

  const schedule = [
    { time: "10:00", title: "Qualifiers" },
    { time: "13:00", title: "Best Trick Jam" },
    { time: "15:00", title: "Pro Finals" },
    { time: "18:00", title: "Award Ceremony" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* HERO */}
      <header className="relative">
        <div
          className="h-96 bg-cover bg-center flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          <div className="container mx-auto relative z-10 px-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 bg-red-600/90 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                Extreme • Live
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
                Street League — <span className="text-red-400">City Throwdown 2025</span>
              </h1>
              <p className="mt-4 text-gray-200/90 text-lg">
                Самое ожидаемое соревнование по стрийт-скейтингу. Трюки, адреналин,
                музыкальная программа и ночные джемы — 2 дня в центре города.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#tickets"
                  className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg"
                >
                  <Ticket size={16} />
                  Купить билеты
                </a>
                <a
                  href="#lineup"
                  className="inline-flex items-center gap-2 border border-gray-700 px-4 py-3 rounded-lg text-gray-200 hover:bg-gray-800"
                >
                  <Users size={16} />
                  Посмотреть состав
                </a>
              </div>

              <div className="mt-6 flex gap-4 text-sm text-gray-300">
                <div className="inline-flex items-center gap-2">
                  <Calendar size={16} />
                  12–13 июля 2025
                </div>
                <div className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  Central Park Bowl — Kyiv, UA
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 -mt-12 relative z-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Lineup */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            id="lineup"
            className="col-span-2 bg-gray-800/50 rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold">Состав</h2>
            <p className="text-gray-300 mt-2">Лучшие райдеры мира. Каждый — шоу в одном человеке.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lineup.map((rider, i) => (
                <article
                  key={i}
                  className="rounded-xl bg-gradient-to-b from-gray-800/80 to-gray-800/60 p-4 flex flex-col items-start gap-3"
                >
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{rider.name}</h3>
                      <div className="text-sm text-gray-400">{rider.country}</div>
                    </div>
                    <div className="text-sm text-gray-300 font-medium">#{i + 7}</div>
                  </div>

                  <p className="text-sm text-gray-300/90">Фирменный трюк: <span className="font-medium">{rider.trick}</span></p>

                  <div className="mt-auto w-full flex items-center justify-between">
                    <a href="#" className="text-sm underline text-gray-300/90">Профиль</a>
                    <button className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm">Follow</button>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>

          {/* Right: Schedule & Tickets */}
          <motion.aside
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/40 rounded-2xl p-6 shadow-lg flex flex-col gap-6"
          >
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">Расписание</h3>
              <ul className="mt-3 space-y-3 text-gray-300">
                {schedule.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-gray-900/20 px-3 py-2 rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-semibold">{s.time}</span>
                      <span className="text-sm">{s.title}</span>
                    </div>
                    <a href="#" className="text-sm underline">Подробнее</a>
                  </li>
                ))}
              </ul>
            </div>

            <div id="tickets" className="bg-gradient-to-r from-red-600 to-pink-500 rounded-xl p-4 text-white">
              <h4 className="text-lg font-bold">Билеты</h4>
              <p className="text-sm mt-1">Limited: VIP, General и Day Pass. Онлайн-бронирование — быстрее.</p>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md font-semibold">Купить VIP — 199€</button>
                <button className="flex-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md font-semibold">General — 59€</button>
              </div>

              <div className="mt-3 text-xs text-white/80">Наличные и банковские карты принимаются на входе.</div>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-3">
              <h4 className="font-bold">Подписка на новости</h4>
              <p className="text-sm text-gray-300 mt-1">Получайте обновления о выступлениях и изменениях расписания.</p>
              <form className="mt-3 flex gap-2">
                <input
                  aria-label="email"
                  placeholder="Ваш email"
                  className="flex-1 bg-transparent border border-gray-700 px-3 py-2 rounded-md text-gray-100 focus:outline-none"
                />
                <button className="px-4 py-2 bg-red-600 rounded-md font-semibold">Подписаться</button>
              </form>
            </div>
          </motion.aside>
        </section>

        {/* Gallery + Map */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2 bg-gray-800/50 p-4 rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold">Галерея</h3>
            <p className="text-gray-300 mt-2">Лучшие моменты с прошлых ивентов.</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-900/30">
                  <img
                    src={`https://images.unsplash.com/photo-1546484959-f6c1c8f4f8a9?auto=format&fit=crop&w=800&q=60&ixid=${n}`}
                    alt={`gallery-${n}`}
                    className="w-full h-full object-cover transform hover:scale-105 transition"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800/40 rounded-2xl p-4 shadow-lg"
          >
            <h4 className="text-lg font-bold">Место проведения</h4>
            <p className="text-gray-300 text-sm mt-2">Central Park Bowl — точная точка и расположение на карте.</p>
            <div className="mt-3 aspect-video overflow-hidden rounded-md border border-gray-700">
              {/* Placeholder map iframe — replace with your embed or Map component */}
              <iframe
                title="event-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.123456789!2d30.295!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <div className="mt-3 text-sm text-gray-300 flex items-center gap-2">
              <MapPin size={16} />
              Kyiv, Ukraine • 2 days
            </div>
          </motion.div>
        </section>

        {/* Sponsors & Footer */}
        <section className="mt-12 mb-20">
          <div className="bg-gray-800/50 rounded-2xl p-6 shadow-md">
            <h4 className="text-lg font-bold">Спонсоры</h4>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
              {['RedBull','Nike','Vans','LocalBoardCo'].map((s) => (
                <div key={s} className="flex items-center justify-center py-4 bg-gray-900/20 rounded-lg">
                  <span className="font-semibold text-gray-200">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <footer className="mt-6 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Street League — City Throwdown</div>
            <div className="flex items-center gap-4">
              <a href="#" className="underline">Правовая информация</a>
              <a href="#" className="underline">Контакты</a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

/*
  PitchPage_SLS-Dime_Pro.jsx
  Готовая одностраничная презентация-лендинг для привлечения инвестиций и спонсоров
  - React + Tailwind (с Tailwind в проекте)
  - Использует Framer Motion для простых анимаций (если не нужен — удалите импорты)
  - Включены: хедер, hero, описание, аудитория, пакеты спонсорства, медиа-план,
    бюджетная сводка, таймлайн, пошаговый план организации и контактная форма.

  Инструкция по использованию:
  1) Скопируйте файл в ваш React-проект (например, src/components/PitchPage.jsx).
  2) Убедитесь, что Tailwind подключён; установите framer-motion: npm i framer-motion.
  3) Замените все заглушки (texts, цифры, лого) на реальные данные вашего ивента.

  Автор: сгенерировано ассистентом. Редактируйте под ваши нужды.
*/

// import React from 'react'
// import { motion } from 'framer-motion'

// const sponsorTiers = [
//   {
//     name: 'Title Sponsor',
//     price: '€60,000+',
//     benefits: [
//       'Логотип на всех промо-материалах',
//       'Эксклюзивная зона на площадке',
//       '5 VIP-пропусков + meet&greet',
//       'Главный бренд-выступ на сцене',
//     ],
//   },
//   {
//     name: 'Gold',
//     price: '€25,000 - €60,000',
//     benefits: [
//       'Логотип на баннерах и вебе',
//       '2 VIP-пропуска',
//       'Социальный контент и mention',
//     ],
//   },
//   {
//     name: 'Silver',
//     price: '€8,000 - €25,000',
//     benefits: ['Логотип на месте события', 'Стенд 3x3 м', 'PR в рассылке'],
//   },
//   {
//     name: 'Community / Product Partner',
//     price: 'In-kind / €1,000 - €8,000',
//     benefits: ['Площадь для промо', 'Промо-материалы', 'Продуктовые интеграции'],
//   },
// ]

// const stats = [
//   { label: 'Ожидаемая аудитория', value: '6,000+' },
//   { label: 'СМИ / reach', value: '1.2M+' },
//   { label: 'Партнёры в прошлом', value: '12' },
//   { label: 'Видеомонтаж', value: 'Full HD + 4K' },
// ]

// const timeline = [
//   { date: 'T-6 месяцев', title: 'Формирование команды, локация, дата' },
//   { date: 'T-4 месяца', title: 'Заключение договоров со спонсорами, публикация сайта' },
//   { date: 'T-2 месяца', title: 'Продажа билетов, найм подрядчиков' },
//   { date: 'T-2 недели', title: 'Репетиции, финальный check-list' },
//   { date: 'День мероприятия', title: 'Event day — работа команд и контент' },
//   { date: 'T+1 неделя', title: 'Отчёты спонсорам, публикация контента' },
// ]

// export default function PitchPage() {
//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">S</div>
//             <div>
//               <h1 className="text-lg font-semibold">Street League Style — Pitch</h1>
//               <p className="text-sm text-slate-500">Event branding, sponsorship & investment deck</p>
//             </div>
//           </div>
//           <nav className="flex items-center gap-4">
//             <a className="text-sm hover:underline" href="#sponsors">Пакеты</a>
//             <a className="text-sm hover:underline" href="#plan">План</a>
//             <a className="text-sm hover:underline" href="#contact">Контакты</a>
//             <button className="ml-2 rounded-md bg-slate-900 text-white px-4 py-2 text-sm">Запросить встречу</button>
//           </nav>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-12">
//         {/* HERO */}
//         <section className="grid md:grid-cols-2 gap-8 items-center">
//           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//             <h2 className="text-4xl font-extrabold leading-tight">SLS / Dime-style спортивное событие<br /><span className="text-indigo-600">— уличный баскет, шоу и lifestyle</span></h2>
//             <p className="mt-4 text-slate-600">Мы создаём событие, которое объединит профессиональные команды, знаменитостей, lifestyle-бренды и тысячи зрителей — с сильной медиа-стратегией и возможностями активации для спонсоров.</p>

//             <div className="mt-6 flex gap-3">
//               <a href="#contact" className="rounded-md bg-indigo-600 text-white px-5 py-3 font-medium">Стать спонсором</a>
//               <a href="#deck" className="rounded-md border border-slate-200 px-5 py-3 text-sm">Скачать презентацию (PDF)</a>
//             </div>

//             <div className="mt-8 grid grid-cols-2 gap-4">
//               {stats.map((s) => (
//                 <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm">
//                   <div className="text-xs text-slate-500">{s.label}</div>
//                   <div className="text-xl font-bold">{s.value}</div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>

//           <motion.div className="bg-gradient-to-br from-indigo-100 to-pink-50 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg" initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}>
//             <div className="w-full aspect-[16/9] bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=')] bg-cover rounded-lg shadow-inner" />
//             <p className="mt-4 text-sm text-slate-600 text-center">Визуал для промо — замените на ваше медиа</p>
//           </motion.div>
//         </section>

//         {/* SPONSOR PACKAGES */}
//         <section id="sponsors" className="mt-12">
//           <h3 className="text-2xl font-bold">Пакеты спонсорства</h3>
//           <p className="text-slate-600 mt-2">Гибкие пакеты для локальных и международных брендов — денежные и товарно-материальные варианты.</p>

//           <div className="mt-6 grid md:grid-cols-4 gap-4">
//             {sponsorTiers.map((tier) => (
//               <div key={tier.name} className="bg-white p-5 rounded-xl shadow-sm">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-semibold">{tier.name}</h4>
//                   <div className="text-slate-500 text-sm">{tier.price}</div>
//                 </div>
//                 <ul className="mt-3 text-sm space-y-2">
//                   {tier.benefits.map((b) => (
//                     <li key={b} className="before:content-['•'] before:mr-2">{b}</li>
//                   ))}
//                 </ul>
//                 <div className="mt-4">
//                   <button className="w-full rounded-md border border-indigo-600 text-indigo-600 px-3 py-2">Запросить пакет</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* MEDIA & ACTIVATION */}
//         <section className="mt-12 grid md:grid-cols-2 gap-8">
//           <div>
//             <h3 className="text-2xl font-bold">Медиа-план и активации</h3>
//             <p className="text-slate-600 mt-2">Кросс-платформенная кампания: соцсети, таргет, медиа-партнёры, стрим, highlight-видео и коллаборации с лидерами мнений.</p>
//             <ul className="mt-4 space-y-3 text-sm">
//               <li>Pre-event: тизеры, розыгрыши билетов, партнёрские промо-акции.</li>
//               <li>Event: стриминг, брендированные зоны, промо-активности и sampling.</li>
//               <li>Post-event: подборка роликов, отчёт спонсорам, аналитика KPI.</li>
//             </ul>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <h4 className="font-semibold">KPI для спонсоров</h4>
//             <ul className="mt-3 text-sm space-y-2">
//               <li>UTM-трекинг активаций и QR-кодов</li>
//               <li>Reach аудитории: органика + платный трафик</li>
//               <li>Количество lead'ов / промо-купонов</li>
//               <li>Отчёт о релевантных показателях в течение 2 недель</li>
//             </ul>
//           </div>
//         </section>

//         {/* BUDGET SUMMARY */}
//         <section className="mt-12 bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="text-2xl font-bold">Краткая бюджетная сводка (пример)</h3>
//           <div className="mt-4 grid md:grid-cols-3 gap-4">
//             <div className="p-4 border rounded-lg">
//               <div className="text-sm text-slate-500">Площадка и логистика</div>
//               <div className="text-xl font-bold mt-2">€40,000</div>
//             </div>
//             <div className="p-4 border rounded-lg">
//               <div className="text-sm text-slate-500">Производство и сцена</div>
//               <div className="text-xl font-bold mt-2">€35,000</div>
//             </div>
//             <div className="p-4 border rounded-lg">
//               <div className="text-sm text-slate-500">Маркетинг и медиа</div>
//               <div className="text-xl font-bold mt-2">€20,000</div>
//             </div>
//           </div>
//           <div className="mt-6 flex items-center justify-between">
//             <div className="text-sm text-slate-500">Итого (примерная цель привлечения)</div>
//             <div className="text-2xl font-extrabold">€120,000</div>
//           </div>
//         </section>

//         {/* TIMELINE */}
//         <section className="mt-12">
//           <h3 className="text-2xl font-bold">Таймлайн</h3>
//           <ol className="mt-4 border-l-2 border-indigo-100">
//             {timeline.map((t) => (
//               <li className="ml-6 mb-6" key={t.date}>
//                 <div className="text-xs text-slate-500">{t.date}</div>
//                 <div className="font-semibold">{t.title}</div>
//               </li>
//             ))}
//           </ol>
//         </section>

//         {/* STEP-BY-STEP ORGANIZATION PLAN */}
//         <section id="plan" className="mt-12 bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="text-2xl font-bold">Пошаговый план организации события</h3>
//           <ol className="mt-4 list-decimal list-inside space-y-4 text-sm">
//             <li><strong>Формирование команды</strong> — определите продюсера, маркетолога, операционного менеджера, PR и SMM. Утвердите роли и KPI.</li>
//             <li><strong>Поиск и бронь локации</strong> — согласуйте дату, разрешения, страховку, план эвакуации и вместимость.</li>
//             <li><strong>Финансовая модель</strong> — составьте бюджет, план доходов (билеты, спонсорство, мерч) и сценарии (best/worse).</li>
//             <li><strong>Оффер для спонсоров</strong> — подготовьте пакеты, коммерческие предложения, медиаплан и кейсы предыдущих событий (если есть).</li>
//             <li><strong>Юридика и договора</strong> — подготовьте шаблон договоров, авторские права на трансляции, права на фото/видео.</li>
//             <li><strong>Производство</strong> — постройка сцены, свет, звук, видеосъёмка, безопасность, уборка.</li>
//             <li><strong>Маркетинг</strong> — запускайте pre-roll, таргет, работу с инфлюенсерами, партнерские активности и коллаборации.</li>
//             <li><strong>Продажа билетов</strong> — гибкая ценовая политика, блоки для спонсоров, VIP, фан-зоны.</li>
//             <li><strong>Операционный запуск</strong> — репетиции, брифы для волонтеров, чек-листы по зонам и timecode шоу.</li>
//             <li><strong>Отчётность и аналитика</strong> — собирайте KPI, делайте отчёт для инвесторов и спонсоров через 7–14 дней после мероприятия.</li>
//           </ol>
//         </section>

//         {/* CONTACT */}
//         <section id="contact" className="mt-12 bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-6 rounded-xl shadow-lg">
//           <div className="grid md:grid-cols-2 gap-6 items-center">
//             <div>
//               <h3 className="text-2xl font-bold">Готовы обсудить партнёрство?</h3>
//               <p className="mt-2 text-sm opacity-90">Оставьте заявку — мы подготовим персональное коммерческое предложение и медиаплан по вашему интересу.</p>

//               <div className="mt-4 space-y-2 text-sm">
//                 <div>📍 Локация: Украина / Европа (пример)</div>
//                 <div>📧 Email: partners@yourevent.com</div>
//                 <div>📞 Телефон: +380 00 000 0000</div>
//               </div>
//             </div>

//             <form className="bg-white p-4 rounded-lg text-slate-900">
//               <label className="block text-sm">Имя</label>
//               <input className="w-full mt-1 p-2 rounded border" placeholder="Ваше имя" />
//               <label className="block text-sm mt-3">Компания</label>
//               <input className="w-full mt-1 p-2 rounded border" placeholder="Название компании" />
//               <label className="block text-sm mt-3">Комментарий</label>
//               <textarea className="w-full mt-1 p-2 rounded border" rows={4} placeholder="Коротко о вашем запросе" />
//               <button type="button" className="mt-4 w-full bg-indigo-600 text-white p-2 rounded">Отправить запрос</button>
//             </form>
//           </div>
//         </section>

//         <footer className="mt-12 text-center text-sm text-slate-500">© {new Date().getFullYear()} Ваше событие — Pitch deck. Replace placeholders with real data.</footer>
//       </main>
//     </div>
//   )
// }

