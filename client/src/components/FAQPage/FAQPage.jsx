import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// FAQ data grouped by category
const FAQ_DATA = [
  {
    category: 'Скейтпарки',
    items: [
      {
        q: 'Можно ли заказать полностью готовый скейтпарк «под ключ»?',
        a: 'Да — мы проектируем, изготавливаем и устанавливаем скейтпарки «под ключ». Включены подготовительные работы, доставка и монтаж по договору. Стоимость зависит от размера, материалов и места установки.'
      },
      {
        q: 'Какие сроки изготовления скейтпарка?',
        a: 'Сроки варьируются: простая конструкция — от 4–6 недель, крупный индивидуальный проект — от 8–16 недель. Точные сроки обсуждаются после утверждения проекта и предоплаты.'
      },
      {
        q: 'Есть ли у вас готовые проекты для маленьких площадок?',
        a: 'Да, у нас есть набор готовых конфигураций для участков малого размера (5×5 м, 8×6 м и т.д.). Мы можем адаптировать их под рельеф и требования заказчика.'
      }
    ]
  },
  {
    category: 'Рампы',
    items: [
      {
        q: 'Какие материалы вы используете для рамп?',
        a: 'Мы используем ламинированную фанеру высокой прочности, стальную арматуру и специальное покрытие (Skatelite, Masonite или композитные плиты) в зависимости от задачи и бюджета.'
      },
      {
        q: 'Можно ли заказать мобильные (складные) рампы?',
        a: 'Да, у нас есть модельный ряд мобильных рамп и трапов, которые удобно транспортировать и хранить. Мы также предлагаем варианты с быстросъёмной фурнитурой.'
      },
      {
        q: 'Какая гарантия на рампы?',
        a: 'Гарантия на конструкцию и материал обычно 12 месяцев; на покрытие — зависит от типа (от 6 до 24 месяцев). Подробности в договоре и гарантийном талоне.'
      }
    ]
  },
  {
    category: 'Фигуры',
    items: [
      {
        q: 'Можете ли вы изготовить фигуру по эскизу заказчика?',
        a: 'Да — мы принимаем индивидуальные заказы. Для корректной оценки пришлите чертёж или референс, после чего подготовим смету и 3D-эскиз.'
      },
      {
        q: 'Какая допустимая нагрузка на фигуры?',
        a: 'Нагрузка рассчитывается в зависимости от назначения: для публичных парков мы проектируем конструкции под динамические и статические нагрузки с запасом безопасности, согласно техническим регламентам.'
      },
      {
        q: 'Можно ли покрасить фигуру в фирменные цвета?',
        a: 'Да, мы выполняем подготовку поверхности и полимерные краски по палитре RAL или по цвету заказчика с защитным лаком.'
      }
    ]
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [query, setQuery] = useState('')

  const categories = useMemo(() => ['Все', ...FAQ_DATA.map(c => c.category)], [])

  const flattened = useMemo(() => {
    const list = FAQ_DATA.flatMap(cat =>
      cat.items.map(item => ({ ...item, category: cat.category }))
    )
    return list
  }, [])

  const filtered = useMemo(() => {
    return flattened.filter(item => {
      const inCategory = selectedCategory === 'Все' || item.category === selectedCategory
      const matchesQuery = (item.q + ' ' + item.a).toLowerCase().includes(query.toLowerCase())
      return inCategory && matchesQuery
    })
  }, [flattened, selectedCategory, query])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Часто задаваемые вопросы</h1>
        <p className="mt-2 text-gray-600">Всё о скейтпарках, рампах и фигурках — материалы, сроки, монтаж и гарантия.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
        <div className="flex-1">
          <label className="sr-only">Поиск по FAQ</label>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по вопросам или ответам..."
            className="w-full border border-gray-200 rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow' : 'bg-gray-100 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md">Ничего не найдено. Попробуйте изменить фильтры или поиск.</div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((item, idx) => {
              const key = `${item.category}-${idx}`
              const isOpen = openIndex === key
              return (
                <li key={key} className="bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpenIndex(isOpen ? null : key)}>
                    <div>
                      <div className="text-sm text-indigo-600 font-semibold">{item.category}</div>
                      <h3 className="mt-1 text-lg font-medium">{item.q}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="ml-4"
                    >
                      <ChevronDown />
                    </motion.div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 pb-4"
                      >
                        <div className="prose max-w-none text-gray-700">{item.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <footer className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold">Нужна помощь с проектом?</h4>
          <p className="text-sm text-gray-600">Напишите или позвоните — поможем с расчётом, 3D-проектом и монтажом.</p>
        </div>
        <div className="flex gap-3">
          <a href="#contact" className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:opacity-95">Связаться</a>
          <a href="#catalog" className="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 text-gray-700">Посмотреть каталог</a>
        </div>
      </footer>
    </div>
  )
}
