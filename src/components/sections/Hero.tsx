import Link from "next/link";
import { routes, isExternalUrl } from "@/lib/routes";

export default function Hero() {
  const demoUrl = routes.demo;
  const isDemoExternal = isExternalUrl(demoUrl);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          AI Scribe + Compliance for Ambulance Reports
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Medics dictate a run. MAIA compiles and QA's the report — accurate, compliant, and billable &gt;75% faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isDemoExternal ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Schedule a Demo
            </a>
          ) : (
            <Link
              href={demoUrl}
              className="px-8 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Schedule a Demo
            </Link>
          )}
          <Link
            href={routes.features}
            className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            See Features
          </Link>
        </div>
      </div>
    </section>
  );
}
