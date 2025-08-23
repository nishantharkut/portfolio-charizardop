# Portfolio Data Management System

This portfolio now uses a centralized JSON-based data management system that makes it easy to update content without modifying code.

## Overview

All hardcoded data has been extracted into JSON files in the `src/data/` directory. The data is accessed through utility functions that provide type safety and easy data manipulation.

## File Structure

```
src/data/
├── index.ts              # Main data utility functions and TypeScript interfaces
├── projects.json         # All project data
├── achievements.json     # Achievements, certifications, and awards
├── skills.json          # Skills, skill groups, interests, and timeline
├── experience.json       # Work experience and career highlights
├── navigation.json       # Navigation links and footer data
└── about.json           # About page content and hero data
```

## Data Files

### 1. `projects.json`
Contains all project information including:
- Project details (title, description, tech stack)
- Implementation details
- Links and images
- Featured status

### 2. `achievements.json`
Contains:
- **Achievements**: Major accomplishments with impact metrics
- **Certifications**: Professional certifications and credentials
- **Awards**: Industry awards and recognition

### 3. `skills.json`
Contains:
- **Skills**: Technical skills with proficiency levels
- **Skill Groups**: Categorized skill sets for the skills section
- **Interests**: Personal interests and hobbies
- **Timeline**: Career timeline and milestones

### 4. `experience.json`
Contains:
- **Experience Data**: Work history with responsibilities and achievements
- **Core Skills**: List of core competencies
- **Career Highlights**: Key metrics and statistics
- **Technology Evolution**: How tech stack evolved over time

### 5. `navigation.json`
Contains:
- **Navigation Links**: Main navigation menu items
- **Footer Sections**: Footer navigation sections
- **Social Links**: Social media links and icons

### 6. `about.json`
Contains:
- **Hero Section**: Hero content for about page
- **About Sections**: Main content sections for about page
- **Stats**: Key statistics displayed on about page

## Utility Functions

The `src/data/index.ts` file provides utility functions for accessing data:

### Project Functions
```typescript
getProjects()                    // Get all projects
getFeaturedProjects()            // Get only featured projects
getProjectById(id)               // Get specific project by ID
searchProjects(query)            // Search projects by keywords
getProjectsByCategory(category)  // Filter projects by category
```

### Achievement Functions
```typescript
getAchievements()                // Get all achievements
getFeaturedAchievements()        // Get only featured achievements
getCertifications()              // Get all certifications
getAwards()                      // Get all awards
getAchievementsByCategory(cat)   // Filter achievements by category
```

### Skills Functions
```typescript
getSkills()                      // Get all skills with levels
getSkillGroups()                 // Get skill groups for skills section
getInterests()                   // Get personal interests
getTimeline()                    // Get career timeline
getSkillsByCategory(category)    // Get skills by category
```

### Experience Functions
```typescript
getExperienceData()              // Get all work experience
getCoreSkills()                  // Get core competencies list
getCareerHighlights()            // Get career statistics
getTechnologyEvolution()         // Get technology evolution data
getExperienceByCompany(company)  // Get experience at specific company
```

### Navigation Functions
```typescript
getNavigationLinks()             // Get main navigation links
getFooterNavigationSections()    // Get footer navigation sections
getSocialLinks()                 // Get social media links
```

### About Functions
```typescript
getAboutData()                   // Get all about page data
```

## How to Update Content

### Adding a New Project

1. Open `src/data/projects.json`
2. Add a new project object to the `projects` array:

```json
{
  "id": 7,
  "title": "New Project",
  "category": "Web Development",
  "shortDescription": "Brief description",
  "fullDescription": "Detailed description",
  "techStack": ["React", "Node.js"],
  "implementation": ["Key implementation detail"],
  "liveLink": "https://example.com",
  "githubLink": "https://github.com/user/repo",
  "image": "/images/project7.jpg",
  "featured": false
}
```

### Adding a New Achievement

1. Open `src/data/achievements.json`
2. Add to the appropriate array (`achievements`, `certifications`, or `awards`)

### Updating Skills

1. Open `src/data/skills.json`
2. Modify the `skills` array to update skill levels
3. Modify `skillGroups` to update the skills section display

### Updating Experience

1. Open `src/data/experience.json`
2. Update `experienceData` for work history
3. Update `highlights` for career statistics

### Updating Navigation

1. Open `src/data/navigation.json`
2. Modify `navigation.links` for main menu
3. Modify `footer.navigationSections` for footer links

### Updating About Content

1. Open `src/data/about.json`
2. Update `hero` section for hero content
3. Update `aboutSections` for main content blocks

## Type Safety

All data structures have TypeScript interfaces defined in `src/data/index.ts`. This ensures:
- Type safety when accessing data
- IntelliSense support in editors
- Compile-time error checking
- Better development experience

## Component Updates

All components have been updated to use the data functions instead of hardcoded arrays:

- `ProjectsPage` → uses `getProjects()`
- `AchievementsPage` → uses `getAchievements()`, `getCertifications()`, `getAwards()`
- `AboutPage` → uses `getAboutData()`, `getSkills()`, `getInterests()`, `getTimeline()`
- `ExperiencePage` → uses `getExperienceData()`, `getCoreSkills()`, etc.
- `Navbar` → uses `getNavigationLinks()`
- `Footer` → uses `getFooterNavigationSections()`, `getSocialLinks()`
- `Skills` → uses `getSkillGroups()`

## Benefits

1. **Easy Updates**: Change content by editing JSON files
2. **Type Safety**: TypeScript interfaces prevent errors
3. **Maintainability**: Centralized data management
4. **Scalability**: Easy to add new data types
5. **Performance**: Data is imported at build time
6. **Developer Experience**: IntelliSense and autocomplete
7. **Version Control**: Easy to track content changes

## Best Practices

1. Always validate JSON syntax after editing
2. Use meaningful IDs for projects and achievements
3. Keep image paths consistent and organized
4. Test changes in development before deploying
5. Back up data files before major changes
6. Use the utility functions instead of importing JSON directly
7. Follow the existing data structure patterns

## Troubleshooting

### JSON Syntax Errors
- Use a JSON validator or IDE with JSON support
- Check for missing commas, quotes, or brackets
- Ensure proper escaping of special characters

### TypeScript Errors
- Make sure new fields match interface definitions
- Update interfaces in `index.ts` if adding new fields
- Check that all required fields are provided

### Missing Data
- Verify file paths are correct
- Check that utility functions are imported properly
- Ensure data structure matches expected format

This system provides a much more maintainable and scalable approach to managing portfolio content while maintaining type safety and developer experience.
