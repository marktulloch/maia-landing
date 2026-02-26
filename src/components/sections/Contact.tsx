export default function Contact() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "team@maia.care";

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form placeholder */}
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          
          {/* Contact info */}
          <div>
            <p className="text-gray-600 mb-4">
              Get in touch with our team:
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="text-lg text-gray-900 hover:text-gray-700 font-medium"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
