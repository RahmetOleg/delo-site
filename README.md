# ДЕЛО — премиальный сайт студии

Тёмный одностраничник уровня Awwwards: WebGL-фон (Three.js), GSAP-анимации,
плавный скролл (Lenis), 3D-tilt карточки, магнитные кнопки, прелоадер,
калькулятор сметы и приём заявок в базу данных.

## Стек

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + shadcn/ui
- **@react-three/fiber + three** — WebGL-фон (аврора-шейдер + частицы, параллакс мыши)
- **GSAP ScrollTrigger** — scroll-анимации, **Lenis** — плавный скролл
- **Prisma + SQLite** — хранение заявок

## Быстрый запуск

Нужен [Bun](https://bun.sh) (или Node.js 20+):

```bash
bun install        # установить зависимости (или: npm install)
bun run db:push    # создать базу данных SQLite (или: npx prisma db push)
bun run dev        # запустить сайт (или: npm run dev)
```

Откройте http://localhost:3000 — готово.

## Заявки с формы

Форма в секции «Контакты» отправляет `POST /api/leads`,
заявки сохраняются в SQLite (`db/custom.db`).

Просмотреть заявки:

```bash
npx prisma studio   # откроет GUI на http://localhost:5555
```

## Где что менять

| Что | Где |
|---|---|
| Все тексты, услуги, цены, контакты | `src/lib/content.ts` |
| Цвета и токены темы | `src/app/globals.css` (`:root`) |
| Фото (портрет, кейсы) | `public/img/` |
| SEO (title, description) | `src/app/layout.tsx` |

> ⚠️ Не забудьте заменить контакты-заглушки (телефон, Telegram, e-mail)
> на реальные — они лежат в `src/lib/content.ts` → `CONTACTS`.

## Продакшен-сборка

```bash
bun run build && bun run start
```
