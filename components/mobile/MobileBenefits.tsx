"use client";
import { motion } from "framer-motion";
import { FaWhatsapp, FaWaze, FaBusAlt } from "react-icons/fa";

const MobileBenefits = () => {
  const apps = [
    {
      name: "WhatsApp",
      desc: "Mensagens e chamadas sem consumir franquia",
      icon: FaWhatsapp,
      color: "#25D366",
    },
    {
      name: "Waze",
      desc: "Navegação e trânsito em tempo real",
      icon: FaWaze,
      color: "#33CCFF",
    },
    {
      name: "Moovit",
      desc: "Transporte público à vontade",
      icon: FaBusAlt,
      color: "#4A90E2",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12131A] font-[family-name:var(--font-heading)]">
            Apps ilimitados,{" "}
            <span>sem descontar da franquia</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-14 rounded-full bg-[#F6C304]" />
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Use o que importa no dia a dia sem medo de acabar a internet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {apps.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center rounded-brand-card border border-[#1510C8]/10 bg-brand-surface-soft p-6 text-center transition-all hover:-translate-y-0.5 hover:border-[#1510C8]/25 hover:bg-white hover:shadow-md"
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-brand-control"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Icon size={28} style={{ color: app.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#12131A] mb-1 font-[family-name:var(--font-heading)]">
                  {app.name}
                </h3>
                <p className="text-sm text-gray-500">{app.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MobileBenefits;
