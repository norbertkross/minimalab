import Header from "../../components/header";
import Footer from "../../components/footer";
import { Mail, Github, Linkedin, MapPin, Briefcase, ExternalLink, Code2, Cpu, Globe } from "lucide-react";
import { projects } from "../works_page/projects";

const SkillCategory = ({ title, skills, icon: Icon }: { title: string, skills: string[], icon: React.ElementType }) => (
  <div className="flex flex-col gap-4 p-6 rounded-2xl border border-neutral-200 bg-white transition-all hover:border-neutral-400">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-neutral-100 rounded-lg">
        <Icon className="w-5 h-5 text-neutral-700" />
      </div>
      <h3 className="font-semibold text-neutral-900">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span key={skill} className="px-3 py-1 text-sm bg-neutral-50 text-neutral-600 rounded-full border border-neutral-100">
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: typeof projects[0] }) => (
  <div className="group flex flex-col gap-4 p-4 rounded-2xl border border-neutral-200 bg-white transition-all hover:border-neutral-400">
    <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-100">
      <img
        src={project.imageSrc}
        alt={project.title}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-neutral-900">{project.title}</h3>
        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
      </div>
      <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{project.description}</p>
    </div>
  </div>
);

const ExperienceItem = ({ company, role, period, description }: { company: string, role: string, period: string, description: string }) => (
  <div className="relative pl-8 pb-12 last:pb-0 border-l border-neutral-200">
    <div className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full bg-neutral-900 border-2 border-white" />
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-neutral-400">{period}</span>
      <h3 className="text-lg font-bold text-neutral-900">{role}</h3>
      <span className="text-neutral-600 font-medium">{company}</span>
      <p className="mt-2 text-neutral-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function Portfolio() {
  const experiences = [
    {
      company: "Sailnex",
      role: "Lead Fullstack Developer & AI Engineer",
      period: "2023 - Present",
      description: "Leading the development of intelligent digital experiences, focusing on AI-powered applications and scalable cloud solutions. Architected and deployed high-performance m-commerce and ATS platforms."
    },
    {
      company: "TechNexus Solutions",
      role: "Senior Fullstack Developer",
      period: "2020 - 2023",
      description: "Developed and maintained complex web applications using React, Node.js, and PostgreSQL. Improved system performance by 40% through database optimization and caching strategies."
    },
    {
      company: "Innovate Labs",
      role: "Software Engineer",
      period: "2018 - 2020",
      description: "Collaborated with cross-functional teams to build user-centric mobile and web applications. Focused on frontend performance and seamless user experiences."
    }
  ];

  const skillCategories = [
    {
      title: "Languages",
      icon: Globe,
      skills: ["TypeScript", "JavaScript", "Python", "Go", "Java", "SQL"]
    },
    {
      title: "Frontend",
      icon: Code2,
      skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Shadcn UI"]
    },
    {
      title: "Backend & AI",
      icon: Cpu,
      skills: ["Node.js", "Express", "FastAPI", "PostgreSQL", "MongoDB", "OpenAI API", "LangChain"]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-20 max-w-5xl">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-24">
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 tracking-tight mb-6">
              Norbert Kross
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 text-neutral-600 font-medium">
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
                <Briefcase className="w-4 h-4" /> Fullstack Developer
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
                <MapPin className="w-4 h-4" /> Lagos, Nigeria
              </span>
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
                <Code2 className="w-4 h-4" /> 5+ Years Exp.
              </span>
            </div>
            <p className="text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto md:mx-0">
              I am a Senior Software Engineer specializing in building intelligent, scalable, and user-centric digital experiences. My focus lies at the intersection of robust fullstack engineering and cutting-edge AI integration.
            </p>
            <div className="flex gap-4 mt-10 justify-center md:justify-start">
              <a href="mailto:norbertkross@example.com" className="bg-neutral-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> Get in touch
              </a>
              <div className="flex gap-2">
                <a href="https://github.com" className="p-3 bg-white rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors">
                  <Github className="w-5 h-5 text-neutral-700" />
                </a>
                <a href="https://linkedin.com" className="p-3 bg-white rounded-full border border-neutral-200 hover:border-neutral-400 transition-colors">
                  <Linkedin className="w-5 h-5 text-neutral-700" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Arsenal / Skills Section */}
        <section className="mb-24">
          <div className="flex flex-col gap-2 mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Technical Arsenal</h2>
            <p className="text-neutral-500">The tools and technologies I use to bring ideas to life.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {skillCategories.map((cat) => (
              <SkillCategory key={cat.title} {...cat} />
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Experience</h2>
              <p className="text-neutral-500 leading-relaxed">
                A track record of delivering high-impact solutions across various industries, from early-stage startups to established enterprises.
              </p>
            </div>
            <div className="md:col-span-2">
              {experiences.map((exp, i) => (
                <ExperienceItem key={i} {...exp} />
              ))}
            </div>
          </div>
        </section>

        {/* Selected Works Section */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-neutral-900">Selected Works</h2>
              <p className="text-neutral-500">Handpicked projects that showcase my engineering philosophy.</p>
            </div>
            <a href="/works" className="text-sm font-bold text-neutral-900 hover:underline flex items-center gap-2">
              View all works <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-neutral-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6 italic tracking-tight">Let's build something intelligent together.</h2>
          <p className="text-neutral-400 mb-10 max-w-lg mx-auto">
            Currently open to senior-level opportunities and high-impact collaborations.
          </p>
          <a href="mailto:norbertkross@example.com" className="inline-block bg-white text-neutral-900 px-10 py-4 rounded-full font-bold hover:bg-neutral-100 transition-colors">
            Start a Conversation
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
