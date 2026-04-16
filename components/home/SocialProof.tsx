const SocialProof = ({ locale }: { locale: any }) => {
  const stats = [
    { number: locale.years, label: locale.yearsLabel },
    { number: locale.customers, label: locale.customersLabel },
    { number: locale.cities, label: locale.citiesLabel },
    { number: locale.team, label: locale.teamLabel },
  ];

  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#FFA500] font-[family-name:var(--font-heading)]">
                {stat.number}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
