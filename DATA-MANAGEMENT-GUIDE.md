# 📊 JSON Data Management Guide

## 🎯 Overview

This guide explains how to manage and update the portfolio data using the JSON files in the `src/data/` directory. The portfolio uses a static data system with TypeScript interfaces for type safety and optimal performance.

## 📁 Data Structure

```
src/data/
├── index.ts          # Data fetching functions and TypeScript interfaces
├── projects.json     # Portfolio projects and case studies
├── experience.json   # Work experience and career timeline
├── skills.json       # Technical skills and expertise areas
├── achievements.json # Awards, certifications, and accomplishments
├── about.json        # Personal information and bio content
└── navigation.json   # Site navigation and footer links
```

---

## 🚀 Projects Data (`projects.json`)

### Structure
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Project Title",
      "category": "Category Name",
      "shortDescription": "Brief description for cards",
      "fullDescription": "Detailed project description",
      "techStack": ["Technology1", "Technology2"],
      "implementation": ["Step1", "Step2"],
      "liveLink": "https://live-url.com",
      "githubLink": "https://github.com/username/repo",
      "image": "/images/project1.jpg",
      "featured": true
    }
  ]
}
```

### Adding a New Project

1. **Open** `src/data/projects.json`
2. **Add** a new project object to the `projects` array:

```json
{
  "id": 7,                                    // Increment from last ID
  "title": "Your Project Name",
  "category": "Web Development",              // Choose: "3D Modeling & Web Development", "Full-Stack Web Development", "React Web Application", "Modern Web Development", "Mobile Development", "Dashboard & Analytics"
  "shortDescription": "Brief 1-2 line description for project cards",
  "fullDescription": "Detailed description of the project, its purpose, and impact",
  "techStack": ["React", "Node.js", "MongoDB"],
  "implementation": [
    "First implementation detail or achievement",
    "Second implementation detail",
    "Third implementation detail"
  ],
  "liveLink": "https://your-live-site.com",
  "githubLink": "https://github.com/username/repo",
  "image": "/images/project7.jpg",            // Add image to public/images/
  "featured": false                           // Set to true for homepage display
}
```

### 🔍 Field Explanations

- **`id`**: Unique numeric identifier (increment from last)
- **`title`**: Project name displayed in headings
- **`category`**: Used for filtering and organization
- **`shortDescription`**: Brief description for project cards (keep under 100 chars)
- **`fullDescription`**: Detailed description for project detail pages
- **`techStack`**: Array of technologies used (keep consistent naming)
- **`implementation`**: Key features, achievements, or implementation details
- **`liveLink`**: URL to the deployed project
- **`githubLink`**: URL to the GitHub repository
- **`image`**: Path to project image (relative to public folder)
- **`featured`**: Boolean - if true, appears on homepage

---

## 💼 Experience Data (`experience.json`)

### Structure
```json
{
  "experienceData": [
    {
      "id": 1,
      "position": "Job Title",
      "company": "Company Name",
      "year": "2023",
      "duration": "2023 - Present",
      "description": "Role summary",
      "responsibilities": ["Task1", "Task2"],
      "technologies": ["Tech1", "Tech2"],
      "achievements": ["Achievement1", "Achievement2"],
      "logo": "/logos/company.svg"
    }
  ]
}
```

### Adding New Experience

```json
{
  "id": 4,                                    // Increment from last ID
  "position": "Senior Full-Stack Developer",
  "company": "Tech Company Inc.",
  "year": "2024",
  "duration": "2024 - Present",
  "description": "Leading development of innovative web applications with focus on user experience and scalability.",
  "responsibilities": [
    "Lead frontend development using React and Next.js",
    "Architect scalable backend systems with Node.js",
    "Mentor junior developers and conduct code reviews",
    "Collaborate with design team on UI/UX implementation"
  ],
  "technologies": ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
  "achievements": [
    "Improved application performance by 50%",
    "Led successful migration to microservices architecture",
    "Reduced bug reports by 60% through testing implementation"
  ],
  "logo": "/logos/tech-company.svg"          // Add logo to public/logos/
}
```

### Additional Sections

- **`coreSkills`**: Array of main skill areas
- **`highlights`**: Key statistics with numbers and descriptions
- **`technologyEvolution`**: Timeline of technology adoption

---

## 🛠️ Skills Data (`skills.json`)

### Structure
```json
{
  "skills": [
    {
      "category": "Category Name",
      "technologies": ["Tech1", "Tech2"],
      "level": 95
    }
  ],
  "skillGroups": [
    { "title": "Group", "items": ["Skill1", "Skill2"] }
  ],
  "interests": [
    {
      "title": "Interest Name",
      "description": "Description of interest",
      "icon": "FaIcon"
    }
  ]
}
```

### Adding New Skills

1. **Main Skills**: Add to `skills` array
```json
{
  "category": "Machine Learning",
  "technologies": ["Python", "TensorFlow", "PyTorch", "Scikit-learn"],
  "level": 82
}
```

2. **Skill Groups**: Add to `skillGroups` array
```json
{ "title": "ML/AI", "items": ["Python", "TensorFlow", "Data Analysis", "Neural Networks"] }
```

3. **Interests**: Add to `interests` array
```json
{
  "title": "Virtual Reality",
  "description": "Exploring immersive experiences and VR development",
  "icon": "FaVr"
}
```

### Available Icons
Use Font Awesome React icons (prefix with `Fa`):
- `FaPalette`, `FaRocket`, `FaGamepad`, `FaRobot`, `FaCamera`, `FaMusic`
- `FaCode`, `FaDatabase`, `FaMobile`, `FaCloud`, `FaLock`, `FaBrain`

---

## 🏆 Achievements Data (`achievements.json`)

### Structure
```json
{
  "achievements": [
    {
      "id": 1,
      "title": "Achievement Title",
      "category": "Category",
      "description": "Brief description",
      "details": "Detailed description",
      "date": "2024",
      "organization": "Organization Name",
      "link": "https://proof-link.com",
      "image": "/achievements/image.jpg",
      "badge": "🏆",
      "impact": ["Impact1", "Impact2"],
      "featured": true
    }
  ]
}
```

### Adding New Achievement

```json
{
  "id": 7,
  "title": "Your Achievement Title",
  "category": "Professional Achievement",     // Choose: "Web Design Recognition", "Leadership Achievement", "Community Impact", "Professional Achievement", "Innovation Recognition", "Technical Excellence"
  "description": "Brief description for cards and lists",
  "details": "Detailed description explaining the achievement, context, and significance",
  "date": "2024",
  "organization": "Organization or Event Name",
  "link": "https://proof-or-reference-link.com",  // Optional
  "image": "/achievements/your-image.jpg",
  "badge": "🎯",                             // Choose relevant emoji
  "impact": [
    "Quantifiable impact or result",
    "Second impact or outcome",
    "Third impact or benefit"
  ],
  "featured": false                          // Set true for homepage display
}
```

### Categories Available
- **Web Design Recognition**: Awards, features, showcases
- **Leadership Achievement**: Team leadership, project management
- **Community Impact**: Open source, mentoring, speaking
- **Professional Achievement**: Client work, business results
- **Innovation Recognition**: Technical innovations, patents
- **Technical Excellence**: Performance, optimization, architecture

### Certifications & Awards
Add to respective arrays:

```json
// Certifications
{
  "id": 4,
  "name": "Microsoft Azure Developer Associate",
  "issuer": "Microsoft",
  "date": "2024",
  "credentialId": "AZ-204-2024-001",
  "image": "/certifications/azure.png",
  "skills": ["Azure Functions", "API Development", "DevOps", "Monitoring"]
}

// Awards
{
  "id": 3,
  "title": "Developer of the Year",
  "event": "Tech Excellence Awards 2024",
  "position": "Winner",
  "year": "2024",
  "description": "Recognized for outstanding contribution to web development community",
  "image": "/awards/developer-year.jpg"
}
```

---

## 👤 About Data (`about.json`)

### Structure
```json
{
  "hero": {
    "badge": "Your Title",
    "title": "About",
    "subtitle": "Your tagline",
    "profileImage": "image-url",
    "profileAlt": "Your Name",
    "profileCaption": "Your Name"
  },
  "aboutSections": [
    {
      "title": "Section Title",
      "content": ["Paragraph 1", "Paragraph 2"]
    }
  ],
  "stats": [
    { "number": "7+", "label": "Years Experience" }
  ]
}
```

### Updating About Content

1. **Hero Section**: Update badge, subtitle, and profile image
2. **About Sections**: Modify titles and content paragraphs
3. **Stats**: Update numbers and labels for key statistics

---

## 🧭 Navigation Data (`navigation.json`)

### Structure
```json
{
  "navigation": {
    "links": [
      { "href": "/", "label": "Home" },
      { "href": "/about", "label": "About Me" }
    ]
  },
  "footer": {
    "navigationSections": [
      {
        "title": "SECTION TITLE",
        "links": [
          { "label": "Link Text", "href": "/path" }
        ]
      }
    ],
    "socialLinks": [
      { "label": "GitHub", "href": "https://github.com/username", "icon": "FaGithub" }
    ]
  }
}
```

### Updating Navigation

1. **Main Navigation**: Add/modify main menu items
2. **Footer Sections**: Update footer link groups
3. **Social Links**: Update social media profiles

---

## 🔧 TypeScript Integration

The data is consumed through type-safe functions in `src/data/index.ts`:

### Available Functions
- `getProjects()` - All projects
- `getFeaturedProjects()` - Featured projects only
- `getExperienceData()` - Work experience
- `getSkills()` - Skills and technologies
- `getAchievements()` - Achievements and awards
- `getAboutData()` - About page content
- `getNavigationData()` - Navigation structure
- `searchProjects(query)` - Search projects
- `getProjectsByCategory(category)` - Filter by category

### Type Interfaces
The system includes TypeScript interfaces for:
- `Project`
- `Experience`
- `Skill`
- `Achievement`
- `AboutData`
- `NavigationData`

---

## 📋 Best Practices

### 1. **Data Consistency**
- Keep technology names consistent across files
- Use same date formats (YYYY or YYYY-MM-DD)
- Maintain consistent image paths

### 2. **Image Management**
- Add images to appropriate `public/` subdirectories:
  - Projects: `public/images/`
  - Achievements: `public/achievements/`
  - Certifications: `public/certifications/`
  - Awards: `public/awards/`
  - Logos: `public/logos/`

### 3. **Performance**
- Keep descriptions concise but informative
- Optimize images before adding to public folder
- Use consistent image sizes when possible

### 4. **SEO Optimization**
- Use descriptive titles and descriptions
- Include relevant keywords naturally
- Ensure all links are functional

### 5. **Validation**
- Test the site after making changes
- Verify all images load correctly
- Check that featured items appear on homepage

---

## 🚀 Quick Update Workflow

1. **Backup**: Always backup current JSON files before major changes
2. **Edit**: Make changes to appropriate JSON file(s)
3. **Images**: Add any new images to public folder
4. **Test**: Run development server and verify changes
5. **Build**: Run production build to catch any errors
6. **Deploy**: Deploy updated version

### Testing Changes
```bash
# Start development server
npm run dev

# Build for production (catches errors)
npm run build

# Test production build
npm start
```

---

## 📞 Common Issues & Solutions

### Issue: Data not updating
- **Solution**: Restart development server, clear browser cache

### Issue: Images not loading
- **Solution**: Check image paths, ensure images are in public folder

### Issue: TypeScript errors
- **Solution**: Verify JSON structure matches interfaces in `index.ts`

### Issue: Build failures
- **Solution**: Check JSON syntax, ensure all required fields are present

---

## 🎉 Tips for Success

1. **Start Small**: Make incremental changes and test frequently
2. **Use Tools**: JSON validators can help catch syntax errors
3. **Stay Organized**: Use consistent naming and categorization
4. **Document Changes**: Keep notes of significant updates
5. **Regular Updates**: Keep projects and achievements current

---

This guide ensures your portfolio data remains organized, consistent, and easy to manage. Remember that the JSON files are the single source of truth for your portfolio content!
