"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Hero Headline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center px-2 sm:px-4"
        >
          <h1
            className="font-bold text-gray-900 mb-4 sm:mb-6 leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 4.2rem)",
              lineHeight: "1.2",
            }}
          >
            The Fintech Talent
            <br className="hidden sm:block" />
            Marketplace
            <br />
            <span className="bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent block mt-2 sm:mt-3">
              Built for Two Sides
            </span>
          </h1>

          <p
            className="text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2"
            style={{
              fontSize: "clamp(0.9rem, 2vw, 1.25rem)",
              lineHeight: "1.6",
            }}
          >
            Whether you're a professional seeking your next breakthrough or a company scaling your team — 
            we connect the right talent with the right opportunity in finance and technology.
          </p>
        </motion.section>

        {/* Dual CTA Cards - fluid grid layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] max-w-5xl mx-auto px-2 sm:px-4"
        >
          {/* For Job Seekers */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-600 flex items-center justify-center mb-4 sm:mb-5 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h3
              className="font-bold text-gray-900 mb-2 sm:mb-3 text-center"
              style={{ fontSize: "clamp(1rem, 2.4vw, 1.5rem)" }}
            >
              For Job Seekers
            </h3>

            <p
              className="text-gray-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-center px-1 sm:px-0"
              style={{ fontSize: "clamp(0.8rem, 1.8vw, 1rem)" }}
            >
              Access exclusive roles at top fintechs, banks, and crypto firms. 
              Get matched with opportunities that fit your skills in compliance, engineering, data, or product — 
              and apply in minutes.
            </p>

            <Link
              href="/jobs"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 md:py-4 px-4 rounded-lg font-semibold transition-all duration-300 text-center hover:shadow-lg active:scale-95"
              style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.1rem)" }}
            >
              Find Your Fintech Role
            </Link>
          </motion.div>

          {/* For Employers */}
          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-teal-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-teal-600 flex items-center justify-center mb-4 sm:mb-5 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-4 8V9a2 2 0 012-2h6a2 2 0 012 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3
              className="font-bold text-gray-900 mb-2 sm:mb-3 text-center"
              style={{ fontSize: "clamp(1rem, 2.4vw, 1.5rem)" }}
            >
              For Employers
            </h3>

            <p
              className="text-gray-600 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-center px-1 sm:px-0"
              style={{ fontSize: "clamp(0.8rem, 1.8vw, 1rem)" }}
            >
              Hire pre-vetted, finance-savvy talent fast. 
              Post roles in blockchain, risk, payments, or AI — and connect with candidates who understand 
              regulation, security, and innovation.
            </p>

            <Link
              href="/login"
              className="inline-block w-full bg-teal-600 hover:bg-teal-700 text-white py-2 sm:py-3 md:py-4 px-4 rounded-lg font-semibold transition-all duration-300 text-center hover:shadow-lg active:scale-95"
              style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.1rem)" }}
            >
              Post a Job Opening
            </Link>
          </motion.div>
        </motion.div>

        {/* Trust & Impact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 max-w-4xl mx-auto px-3 sm:px-4"
        >
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2
              className="font-bold text-gray-900 mb-3 sm:mb-4"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
            >
              Why Fintech Professionals Choose Us
            </h2>
            <p
              className="text-gray-600 max-w-2xl mx-auto px-2"
              style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)" }}
            >
              We're not just another job board — we're a curated ecosystem for the future of finance.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {[
              {
                title: "Fintech-First Matching",
                desc: "AI-powered matching tuned for finance roles — not generic tech.",
              },
              {
                title: "Compliance-Ready Profiles",
                desc: "Candidates verified for KYC, certifications, and domain experience.",
              },
              {
                title: "Trusted by Innovators",
                desc: "Used by 500+ fintechs, neobanks, and crypto startups globally.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="text-center p-4 sm:p-5 md:p-6 bg-white rounded-lg border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-300"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 sm:w-5 text-blue-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4
                  className="font-semibold text-gray-900 mb-2"
                  style={{ fontSize: "clamp(0.9rem, 2vw, 1.2rem)" }}
                >
                  {item.title}
                </h4>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ fontSize: "clamp(0.75rem, 1.8vw, 1rem)" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto px-3 sm:px-4"
        >
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center border border-blue-200">
            <h3
              className="font-bold text-gray-900 mb-3 sm:mb-4"
              style={{ fontSize: "clamp(1rem, 2.6vw, 1.8rem)" }}
            >
              Ready to Get Started?
            </h3>
            <p
              className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto"
              style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)" }}
            >
              Join thousands of fintech professionals and companies already using QaziMatch to transform their careers and hiring.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 sm:px-8 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 text-center"
                style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
              >
                Create Account
              </Link>
              <Link
                href="/about"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-6 sm:px-8 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg active:scale-95 text-center"
                style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
