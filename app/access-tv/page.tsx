import AccessTVContent from "@/components/access-tv/AccessTVContent";

export const metadata = {
  title: "Access TV - Mais de 200 canais | AccessNet",
  description:
    "Access TV com mais de 200 canais, incluso sem custo adicional em todos os planos de internet residencial AccessNet.",
  alternates: {
    canonical: "/access-tv",
  },
};

export default function AccessTVPage() {
  return <AccessTVContent />;
}
