export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <p className="mb-2 sm:mb-0 text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-600">QaziMatch</span>. All rights reserved.
        </p>

        <div className="flex space-x-4">
          <a
            href="/privacy"
            className="hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-blue-600 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
