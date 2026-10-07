import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * POST /api/leads — приём заявки с формы и из калькулятора.
 * Валидация zod, запись в SQLite через Prisma.
 */

const LeadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(120),
  contact: z.string().trim().min(3, "Укажите контакт").max(200),
  task: z.string().trim().max(200).optional().nullable(),
  budget: z.string().trim().max(120).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  estimate: z.string().trim().max(2000).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
    }

    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Проверьте поля формы";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        name: parsed.data.name,
        contact: parsed.data.contact,
        task: parsed.data.task ?? null,
        budget: parsed.data.budget ?? null,
        message: parsed.data.message ?? null,
        estimate: parsed.data.estimate ?? null,
      },
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 200 });
  } catch (e) {
    console.error("[/api/leads] ошибка записи:", e);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить заявку. Напишите в Telegram — ответим быстрее." },
      { status: 500 }
    );
  }
}
