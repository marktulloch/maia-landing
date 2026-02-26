export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className="h-64 md:h-96 bg-gray-200 rounded-lg"></div>
          
          {/* Text content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              About MAIA
            </h2>
            <p className="text-gray-600 text-lg">
              MAIA revolutionizes ambulance reporting by combining AI-powered transcription with compliance automation. Our platform helps medics focus on patient care while ensuring reports are accurate, compliant, and ready for billing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
