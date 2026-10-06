import { z } from "zod";
import { and, asc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, adminQuery, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { partners } from "@db/schema";
import { UF_LIST } from "@contracts/constants";

const submitSchema = z.object({
  loja: z.string().trim().min(2, "Informe o nome da loja").max(255),
  cidade: z.string().trim().min(2, "Informe a cidade").max(120),
  uf: z.enum(UF_LIST),
  whatsapp: z.string().trim().min(8, "Informe um WhatsApp válido").max(30),
  beneficio: z.string().trim().min(5, "Descreva o benefício para a família PCD").max(255),
  atendimentoAdaptado: z.boolean().default(false),
  lgpdConsent: z.literal(true, { error: "É preciso aceitar o uso dos dados (LGPD) para continuar." }),
});

export const partnersRouter = createRouter({
  /** Loja se candidata a parceira (público, com consentimento LGPD). */
  submit: publicQuery.input(submitSchema).mutation(async ({ input }) => {
    const [{ id }] = await getDb().insert(partners).values(input).$returningId();
    return { ok: true, id };
  }),

  /** Vitrine pública: só lojas aprovadas, opcionalmente por UF. */
  list: publicQuery
    .input(z.object({ uf: z.enum(UF_LIST).optional() }).optional())
    .query(async ({ input }) => {
      const where = input?.uf
        ? and(eq(partners.status, "approved"), eq(partners.uf, input.uf))
        : eq(partners.status, "approved");
      return getDb().query.partners.findMany({
        where,
        orderBy: [asc(partners.uf), asc(partners.cidade), asc(partners.loja)],
        columns: { id: true, loja: true, cidade: true, uf: true, whatsapp: true, beneficio: true, atendimentoAdaptado: true },
      });
    }),

  /** Admin: fila de lojas pendentes + todas. */
  adminList: adminQuery
    .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.partners.findMany({
        where: input?.status ? eq(partners.status, input.status) : undefined,
        orderBy: [asc(partners.createdAt)],
      });
    }),

  /** Admin: aprovar/reprovar loja. */
  review: adminQuery
    .input(z.object({ id: z.number().int().positive(), decision: z.enum(["approve", "reject"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const row = await db.query.partners.findFirst({ where: eq(partners.id, input.id) });
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Loja não encontrada." });
      await db
        .update(partners)
        .set({ status: input.decision === "approve" ? "approved" : "rejected" })
        .where(eq(partners.id, input.id));
      return { ok: true };
    }),
});
