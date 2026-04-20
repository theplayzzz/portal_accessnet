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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A5F] font-[family-name:var(--font-heading)]">
            Apps ilimitados,{" "}
            <span className="text-[#FFA500]">sem descontar da franquia</span>
          </h2>
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
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-slate-50/50 hover:border-[#FFA500]/40 hover:bg-white hover:shadow-md transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Icon size={28} style={{ color: app.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#1E3A5F] mb-1 font-[family-name:var(--font-heading)]">
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
