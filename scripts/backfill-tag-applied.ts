import { prisma } from "@/lib/db";

async function main() {
  const r = await prisma.lead.updateMany({
    where: {
      opaContatoId: { not: null },
      opaStatus: { in: ["sent", "delivered", "read", "replied"] },
      opaTagAppliedAt: null,
    },
    data: { opaTagAppliedAt: new Date() },
  });
  console.log("Backfilled opaTagAppliedAt em", r.count, "leads");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
