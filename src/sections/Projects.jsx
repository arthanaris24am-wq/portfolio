import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalData } from '../data/content';
import TastefulImage from '../components/TastefulImage';
import { ExternalLink, Github, Sparkles } from 'lucide-react';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl bg-[#090a0f] border border-white/5 hover:border-[#ff5a1f]/30 p-6 sm:p-10 transition-all duration-500 group shadow-xl"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          isEven ? '' : 'lg:grid-flow-dense'
        }`}
      >
        {/* Project Details */}
        <div
          className={`flex flex-col space-y-5 lg:col-span-5 ${
            isEven ? 'lg:order-1' : 'lg:col-start-8 lg:col-span-5 lg:order-2'
          }`}
        >
          {/* Index + Category Badge */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs sm:text-sm font-bold text-[#ff5a1f] tracking-widest">
              // {project.id}
            </span>
            <span className="h-3 w-[1px] bg-white/10" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              {project.category}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white group-hover:text-neutral-100 transition-colors tracking-tight">
            {project.title}
          </h3>

          {/* 2-line Description */}
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3">
            {project.description}
          </p>

          {/* Key Stat pill if present */}
          {project.stats && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff5a1f]/10 border border-[#ff5a1f]/20 w-fit text-xs font-mono text-[#ff7a45]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{project.stats}</span>
            </div>
          )}

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md bg-[#13141c] border border-white/5 text-[11px] font-mono text-neutral-300"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4 pt-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider transition-all duration-300"
              >
                <Github className="w-3.5 h-3.5 text-[#ff5a1f]" />
                <span>View Code</span>
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff5a1f]/10 hover:bg-[#ff5a1f]/20 text-[#ff7a45] hover:text-white border border-[#ff5a1f]/30 text-xs font-mono uppercase tracking-wider transition-all duration-300"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Project Screenshot / Visual Mockup */}
        <div
          className={`lg:col-span-7 ${
            isEven ? 'lg:order-2' : 'lg:col-start-1 lg:col-span-7 lg:order-1'
          }`}
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0d0e14] group-hover:border-[#ff5a1f]/40 transition-all duration-500 shadow-2xl">
            <TastefulImage
              src={project.image}
              alt={project.title}
              aspectRatio="aspect-[16/10]"
              fallbackTitle={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            03 // Selected Deployments
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight">
            Featured Engineering
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-400 max-w-xl">
            Deep learning, computer vision models, and intelligent full-stack applications built for tangible real-world tasks.
          </p>
        </div>

        {/* Full-Width Project Blocks */}
        <div className="space-y-12 sm:space-y-16">
          {personalData.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

