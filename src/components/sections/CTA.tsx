import Link from "next/link";
import { routes, isExternalUrl } from "@/lib/routes";

export default function CTA() {
  const demoUrl = routes.demo;
  const isDemoExternal = isExternalUrl(demoUrl);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          Give Your Medics Their Time Back.
        </h2>
        {isDemoExternal ? (
          <a
            href={demoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Schedule a Demo
          </a>
        ) : (
          <Link
            href={demoUrl}
            className="inline-block px-8 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Schedule a Demo
          </Link>
        )}
      </div>
    </section>
  );
}
