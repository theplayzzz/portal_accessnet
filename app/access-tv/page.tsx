import AccessTVContent from "@/components/access-tv/AccessTVContent";

export const metadata = {
  title: "Access TV - Mais de 200 canais | AccessNet",
  description:
    "Conheça o Access TV, benefício para clientes da internet residencial AccessNet com mais de 200 canais em uma plataforma regularizada.",
  alternates: {
    canonical: "/access-tv",
  },
};

export default function AccessTVPage() {
  return <AccessTVContent />;
}
