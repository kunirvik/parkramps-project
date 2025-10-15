import { useState, useEffect } from "react";
import { Instagram, Phone, Plane } from "lucide-react"; // предполагаю, что иконки берутся отсюда
import { motion } from "framer-motion";

export default function ModalRequestSkatepark({ isOpen, onClose }) {

       const buttons = [
    { icon: <Instagram size={15} className="text-[#919191]" />, link: "https://instagram.com/parkramps/" },
    {icon:<Plane size={15} className="text-[#919191]" />, link: "https://t.me/parkramps"},

    // { icon: <Phone size={15} className="text-[#919191]" />, link: "tel:+380681205553" },
  ];
  const [form, setForm] = useState({
    fullName: "",
    // email: "",
    phone: "",
    // requestType: "Продажа скейтпарка",
    // title: "",
    // quantity: 1,
    // location: "",
    // preferredContact: "email",
    // message: "",
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // function handleFiles(e) {
  //   const chosen = Array.from(e.target.files).slice(0, 5); // лимит превью
  //   setFiles(chosen);
  // }

  function validate() {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Укажите имя";
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = "Нужен корректный e-mail";
    if (!form.title.trim()) err.title = "Краткое название/заголовок";
    if (!form.location.trim()) err.location = "Город/адрес";
    return err;
  }

  function buildMailto() {
    const subject = `[Заявка] ${form.requestType} — ${form.title}`;
    const bodyLines = [
      `Имя: ${form.fullName}`,
      // `E-mail: ${form.email}`,
      `Телефон: ${form.phone || "-"}`,
      // `Тип заявки: ${form.requestType}`,
      // `Заголовок: ${form.title}`,
      // `Кол-во: ${form.quantity}`,
      // `Локация: ${form.location}`,
      // `Предпочтительный контакт: ${form.preferredContact}`,
      `Сообщение:\n${form.message || "-"}`,
      // "\n(Примечание: файлы не отправляются через mailto — прикрепите их отдельно при необходимости или загрузите на облако и вставьте ссылку)",
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    // замените адрес ниже на ваш рабочий e-mail получателя
    const to = "sales@example.com";
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const err = validate();
    if (Object.keys(err).length) return setErrors(err);

    setSubmitting(true);

    try {
      // Используем mailto в качестве быстрого способа отправить заявку на "мыло".
      // Недостаток: через mailto нельзя прикрепить файлы. Для реальной отправки
      // желательно сделать API-эндпоинт на сервере или интеграцию с почтовым сервисом.
      const mailto = buildMailto();
      // Открываем почтовый клиент пользователя
      window.location.href = mailto;

      setSuccess(true);
      // Очистим форму (опционально)
      setForm({
        fullName: "",
        email: "",
        phone: "",
        requestType: "Продажа скейтпарка",
        title: "",
        quantity: 1,
        location: "",
        preferredContact: "email",
        message: "",
      });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Не удалось открыть почтовый клиент. Можно попробовать вручную отправить заявку.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>

      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold">строим экстримальные площадки и проводим ивенты</h2>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Закрыть">
              ✕
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-600">Свяжитесь с нами в соц сетях.</p>
        
            
        <div className="flex items-center gap-2">
          {buttons.map((button, index) => (
            <motion.a
              key={index}
              href={button.link}
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-xl shadow-lg flex items-center justify-center w-9 h-9 rounded transition-all hover:bg-white/30"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.onClick ? button.onClick : () => window.open( button.link, "_blank")}
            >
              {button.icon}
            </motion.a>
            
          ))}
          </div><p className="mt-2 text-sm text-gray-600"> или заполните форму — мы свяжемся удобным для Вас способом.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium">Имя</span>
              <input name="fullName" value={form.fullName} onChange={handleChange} className={`mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.fullName ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
            </label>


            <label className="flex flex-col">
              <span className="text-sm font-medium">Телефон </span>
              <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-200" />
            </label>

       

           {/* <label className="flex flex-col">
  <span className="text-sm font-medium">Размер (м²)</span>
  <select
    name="quantity"
    value={form.quantity}
    onChange={handleChange}
    className="mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-200"
  >
    <option value="">Выберите размер</option>
    <option value="50">до 50 м²</option>
    <option value="100">до 100 м²</option>
    <option value="200">до 200 м²</option>
    <option value="300">до 300 м²</option>
    <option value="500">500+ м²</option>
  </select>
</label> */}
 

            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium">Локация (область, город)</span>
              <input name="location" value={form.location} onChange={handleChange} className={`mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${errors.location ? 'border-red-400' : 'border-gray-200'}`} />
              {errors.location && <span className="text-red-500 text-xs mt-1">{errors.location}</span>}
            </label>

      <label className="flex flex-col">
              <span className="text-sm font-medium">Цель использования</span>
              <select name="requestType" value={form.requestType} onChange={handleChange} className="mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-200">
                <option>общественный парк</option>
                <option>частный парк</option>
                <option>ивент / мероприятие</option>
                <option>другое / укажите в пожелании</option>
              </select>
            </label>

            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium">Укажите свои пожелания</span>
              <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-200" />
            </label>

     
  <fieldset className="md:col-span-2 mt-2">
  <legend className="text-sm font-medium">Как с вами связаться?</legend>
  <div className="flex gap-4 mt-2">
    <label className="inline-flex items-center gap-2">
      <input
        type="radio"
        name="preferredContact"
        value="email"
        checked={form.preferredContact === "email"}
        onChange={handleChange}
      />
      <span className="text-sm">E-mail</span>
    </label>
    <label className="inline-flex items-center gap-2">
      <input
        type="radio"
        name="preferredContact"
        value="phone"
        checked={form.preferredContact === "phone"}
        onChange={handleChange}
      />
      <span className="text-sm">Телефон</span>
    </label>
  </div>

  {/* 👇 Условно показываем email поле */}
  {form.preferredContact === "email" && (
    <div className="mt-3">
      <label className="flex flex-col">
        <span className="text-sm font-medium">Ваш E-mail</span>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={`mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            errors.email ? "border-red-400" : "border-gray-200"
          }`}
        />
        {errors.email && (
          <span className="text-red-500 text-xs mt-1">{errors.email}</span>
        )}
      </label>
    </div>
  )}
</fieldset>
 
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Отмена</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-indigo-600 text-white shadow hover:opacity-95">
              {submitting ? 'Отправка...' : 'Отправить на почту'}
            </button>
          </div>

          {success && <div className="mt-4 text-sm text-green-600">Почтовый клиент открыт. Если письмо не отправилось — скопируйте текст вручную или используйте серверную отправку.</div>}

          
        </form>
      </div>
    </div>
  );
}
