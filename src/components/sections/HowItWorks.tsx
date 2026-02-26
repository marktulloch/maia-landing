export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Capture",
      description: "Medics dictate their run using natural speech.",
    },
    {
      number: "2",
      title: "Compile",
      description: "MAIA processes and structures the report automatically.",
    },
    {
      number: "3",
      title: "Verify",
      description: "Review, QA, and submit — all in one streamlined workflow.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg bg-white text-center"
            >
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
