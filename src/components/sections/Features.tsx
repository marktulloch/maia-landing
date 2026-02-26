export default function Features() {
  const features = [
    {
      title: "QA/QI",
      description: "Quality assurance and quality improvement tools for comprehensive report review.",
    },
    {
      title: "AI ePCR Reporting",
      description: "Automated electronic patient care reporting powered by advanced AI technology.",
    },
    {
      title: "Medical Billing",
      description: "Streamlined billing processes integrated with report generation.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
