// App.js
// Now with Tailwind styling classes, plus some hover transitions & gradient buttons.

import React from 'react';
import {
  personalData,
  experienceData,
  educationData,
  projectsData
} from './data';
import './App.css'; // optional, in case you want custom overrides or advanced styling

// NAVBAR COMPONENT
function Navbar() {
  return (
    <nav className="w-full bg-gray-900 py-4 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo or Name */}
        <div className="text-xl font-bold">Darwin Chen</div>
        {/* Nav Links */}
        <ul className="flex gap-6 font-medium">
          <li><a href="#home" className="hover:text-pink-400 transition">Home</a></li>
          <li><a href="#experience" className="hover:text-pink-400 transition">Experience</a></li>
          <li><a href="#education" className="hover:text-pink-400 transition">Education</a></li>
          <li><a href="#projects" className="hover:text-pink-400 transition">Projects</a></li>
          <li><a href="#contact" className="hover:text-pink-400 transition">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

// HOME / HERO SECTION
function HomeSection() {
  const { name, role, location, summary } = personalData;

  return (
    <section
      id="home"
      className="w-full bg-gray-900 text-white py-20 flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-2">
          {`I'm ${name}, a ${role}`}
        </h1>
        <h2 className="text-xl text-gray-300 mb-6">{location}</h2>
        <p className="mb-8 max-w-3xl leading-relaxed">{summary}</p>

        <div className="flex gap-4">
          {/* Gradient Button */}
          <a
            href="#contact"
            className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-6 py-3 rounded-lg font-semibold
            hover:opacity-90 transition duration-300"
          >
            Connect With Me
          </a>
          {/* Outline / Secondary Button */}
          <a
            href="path/to/your_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-pink-500 text-pink-500 px-6 py-3 rounded-lg font-semibold
            hover:bg-pink-500 hover:text-white transition duration-300"
          >
            My Resume
          </a>
        </div>
      </div>
    </section>
  );
}

// EXPERIENCE SECTION
function ExperienceSection() {
  return (
    <section id="experience" className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Work Experience</h2>
        {experienceData.map((job, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold">
              {job.title} <span className="text-pink-400">| {job.company}</span>
            </h3>
            <p className="text-gray-300 mb-2">
              {job.duration} • {job.location}
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-200">
              {job.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// EDUCATION SECTION
function EducationSection() {
  return (
    <section id="education" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Education</h2>
        {educationData.map((ed, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-semibold">{ed.institution}</h3>
            <p className="text-pink-400">{ed.degree}</p>
            <p className="text-gray-300">
              {ed.timeframe} • {ed.location}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// PROJECTS SECTION
function ProjectsSection() {
  return (
    <section id="projects" className="bg-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Projects</h2>
        {projectsData.map((project, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-pink-400">{project.stack}</p>
            <ul className="list-disc ml-6 mt-2 text-gray-200 space-y-1">
              {project.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-400 underline hover:text-blue-200"
              >
                Link to Project
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// CONTACT SECTION
function ContactSection() {
  const { phone, email, github, linkedIn } = personalData;

  return (
    <section id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Contact</h2>
        <div className="space-y-2 text-gray-300">
          <p>Phone: {phone}</p>
          <p>
            Email:{" "}
            <a className="text-blue-400 underline" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
          <p>
            GitHub:{" "}
            <a
              className="text-blue-400 underline"
              href={github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {github}
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a
              className="text-blue-400 underline"
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkedIn}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// MAIN APP COMPONENT
function App() {
  return (
    <div className="bg-gray-900 min-h-screen font-sans">
      <Navbar />
      <HomeSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App;
