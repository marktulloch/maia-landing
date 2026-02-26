export default function Security() {
  const securityFeatures = [
    "HIPAA-aligned architecture",
    "Encrypted infrastructure",
    "Role-based access controls",
    "Audit trail logging",
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Security & Compliance
        </h2>
        <ul className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-900 mr-3">•</span>
              <span className="text-gray-700 text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
