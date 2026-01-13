import { AnimatePresence, motion } from "framer-motion";
import Header from "../../components/header";
import { useState } from "react";
import { X } from "lucide-react";
import Footer from "../../components/footer";

interface JobOpening {
  id: number;
  title: string;
  type: string;
  location: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
}

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  const jobOpenings: JobOpening[] = [
    {
      id: 1,
      title: "Frontend Developer",
      type: "Full-time",
      location: "Remote",
      description: "We're looking for an experienced React developer to join our team to build innovative web applications.",
      responsibilities: [
        "Develop new user-facing features using React.js",
        "Build reusable components and front-end libraries",
        "Optimize components for maximum performance",
        "Collaborate with designers and backend developers"
      ],
      requirements: [
        "3+ years of experience with React.js",
        "Proficient in TypeScript and modern JavaScript",
        "Experience with state management libraries (Redux, Zustand, etc.)",
        "Familiarity with RESTful APIs and GraphQL"
      ]
    },
    {
      id: 2,
      title: "UX Designer",
      type: "Contract",
      location: "Hybrid (New York)",
      description: "Join our design team to create beautiful, intuitive user experiences for our products.",
      responsibilities: [
        "Create user flows, wireframes, and prototypes",
        "Conduct user research and usability testing",
        "Collaborate with product managers and engineers",
        "Maintain and evolve our design system"
      ],
      requirements: [
        "Portfolio demonstrating strong UX/UI design skills",
        "Proficiency in Figma or similar design tools",
        "3+ years of experience in UX design",
        "Understanding of front-end development principles"
      ]
    },
    {
      id: 3,
      title: "Backend Engineer",
      type: "Full-time",
      location: "Remote",
      description: "Help us build scalable, high-performance backend services that power our applications.",
      responsibilities: [
        "Design and implement backend services and APIs",
        "Optimize database queries and performance",
        "Implement security and data protection measures",
        "Collaborate with frontend developers to integrate user-facing elements"
      ],
      requirements: [
        "5+ years of backend development experience",
        "Strong knowledge of Node.js and/or Python",
        "Experience with database design and optimization",
        "Familiarity with cloud platforms (AWS, GCP, or Azure)"
      ]
    }
  ];

  const handleJobClick = (job: JobOpening) => {
    setSelectedJob(job);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setSelectedJob(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="mx-auto mb-10 mt-32 w-full px-4 text-center md:w-7/12">
          <h1 className="mb-4 text-4xl font-bold">Join Our Team</h1>
          <p className="mb-6 text-lg text-gray-600">
            We&apos;re always looking for talented individuals to join our team.
            If you're passionate about what you do and want to make an impact, we want to hear from you!
          </p>
        </div>
        <div className="mb-24 p-1"></div>
        <div className="mx-auto mb-24 w-full px-4 md:w-7/12">
          <h2 className="mb-8 text-center text-2xl font-semibold">Current Openings</h2>

          <div className="flex flex-col items-center space-y-6">
            {jobOpenings.length > 0 ? (
              jobOpenings.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJobClick(job)}
                  className="w-full cursor-pointer rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-black hover:shadow-sm"
                >
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>{job.type}</span>

                      <span>{job.location}</span>
                    </div>

                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-500">We currently dont have any open positions. Please check back later!</p>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto bg-white/90"
            >
              <div className="flex min-h-screen items-center justify-center p-4">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="relative mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-8"
                >
                  <button
                    onClick={closeModal}
                    className="absolute right-6 top-6 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                    aria-label="Close job details"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h2 className="text-3xl font-bold">{selectedJob.title}</h2>
                      <div className="mt-2 flex items-center space-x-4 text-gray-600">
                        <span>{selectedJob.type}</span>

                        <span>{selectedJob.location}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">About the Role</h3>
                      <p className="text-gray-700">{selectedJob.description}</p>
                    </div>

                    {selectedJob.responsibilities && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Responsibilities</h3>
                        <ul className="list-inside list-disc space-y-2 text-gray-700">
                          {selectedJob.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.requirements && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Requirements</h3>
                        <ul className="list-inside list-disc space-y-2 text-gray-700">
                          {selectedJob.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-6">
                      <button className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800 md:w-auto">
                        Apply for this position
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer/>
    </>
  );
};

export default Careers;