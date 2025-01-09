// data.js

export const personalData = {
    name: "Darwin Chen",
    role: "Frontend Developer & Data Analyst",
    location: "Kingston, ON, Canada",
    phone: "+1 (506)897-3819",
    email: "darwinchen8@outlook.com",
    github: "https://github.com/Darwin27264",
    linkedIn: "https://www.linkedin.com/in/Darwin-Chen",
    summary: `I am a software developer with a passion for creating innovative solutions. 
    I specialize in frontend development and data analytics, with experience in web development, 
    data visualization, and machine learning. I am currently pursuing a Bachelor of Computing Honours degree at Queen’s University, 
    with a specialization in Data Analytics.`
  };
  
  export const experienceData = [
    {
      title: "vDU Developer",
      company: "Ericsson Canada Inc",
      duration: "May 2024 - Aug 2025",
      location: "Ottawa, ON",
      responsibilities: [
        "Implemented critical development tools for developers in the vDU division using Node.js, React, enabling data visualization."
      ]
    },
    {
      title: "Web Developer & Manager",
      company: "Pathfinders",
      duration: "May - Aug. 2022 - 2024",
      location: "Fredericton, NB",
      responsibilities: [
        "Led site maintenance & UI enhancements improving UX; optimized web apps using PHP, HTML, CSS.",
        "Streamlined the translation process by developing plugins using Google Apps Script (JavaScript).",
        "Utilized Google Ads, Tag Manager, and Analytics to target global traffic; proficient in Cloudflare, Dreamhost, WordPress, etc."
      ]
    },
    {
      title: "Teaching Assistant (Elements of Computing w/ Data Analytics)",
      company: "Queen’s University",
      duration: "Jan. - Apr. 2023 - 2024",
      location: "Kingston, ON",
      responsibilities: [
        "Assisted in course instruction and grading, focusing on Data Analytics and computational thinking."
      ]
    }
  ];
  
  export const educationData = [
    {
      institution: "Queen’s University",
      degree: "Bachelor of Computing Honours (Data Analytics Specialization)",
      timeframe: "Sept. 2021 - Apr. 2026 (w/ one year internship)",
      location: "Kingston, ON"
    }
  ];
  
  export const projectsData = [
    {
      title: "On-Device GPT Chat Agent",
      stack: "Python, Flutter, GPT4ALL",
      description: [
        "Developed a chatbot using a quantized LLM model & Flutter (Flet GUI) to be ran locally.",
        "Incorporated various API calls to obtain real-time information & context."
      ],
      link: "https://example.com/on-device-gpt-chat-agent"
    },
    {
      title: "Fishing Data Mapper",
      stack: "Python, React, HTML, CSS, JS, Git",
      description: [
        "Scraped lake and fish species information using Python and BS4, stored in JSON format.",
        "Created an interactive map utilizing React & Leaflet library to visually display the scraped data."
      ],
      link: "https://example.com/fishing-data-mapper"
    },
    {
      title: "NLP Intent Identifier",
      stack: "Java, JavaFX, StanfordNLP",
      description: [
        "Used StanfordNLP for input processing and pattern matching with dataset to perform categorization.",
        "Incorporated API calls to respond to commands and emulated a chat-like experience."
      ],
      link: "https://example.com/nlp-intent-identifier"
    }
  ];
  