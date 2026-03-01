export default function About() {
  return (
    <section id="about" className="section-spacing">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div className="h-64 md:h-96 bg-surface rounded-lg"></div>
          
          {/* Text content */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5">
              About MAIA
            </h2>
            <p className="text-muted text-lg">
              MAIA revolutionizes ambulance reporting by combining AI-powered transcription with compliance automation. Our platform helps medics focus on patient care while ensuring reports are accurate, compliant, and ready for billing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
