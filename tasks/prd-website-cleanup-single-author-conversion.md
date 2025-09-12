# PRD: Website Cleanup and Single Author Conversion

## Introduction/Overview

This feature focuses on cleaning up and optimizing the Voice of Repentance blog website after understanding its current structure and issues. The primary goal is to convert the multi-author blog template into a single-author blog for Dr. Troy E. Sybert, fix critical functionality issues (search and main menu), improve code and UI organization, test and verify Azure deployment configuration, and establish a foundation for efficient content creation and posting.

## Project Context

The Voice of Repentance blog is built with Hugo and Tailwind CSS using the Gruvbox theme, deployed on Azure Static Web Apps via GitHub Actions. The current site was deployed from a template designed for multiple authors, but needs to be streamlined for a single author. This cleanup is essential to get the blog "across the finish line" for efficient sermon and blog post creation. The project follows the Gruvbox theme constraints and Azure deployment practices documented in the README.md.

## Goals

- Convert the multi-author blog template to a single-author blog optimized for Dr. Troy E. Sybert
- Fix critical functionality issues including broken search feature and main menu
- Organize code and UI structure according to template best practices
- Verify and test Azure deployment configuration through GitHub
- Establish a clear understanding of storage strategy for blog content with search capabilities
- Create an efficient workflow for posting content either through GitHub or alternative mechanisms
- Prepare the foundation for future automated blog deployment features

## User Stories

- As a single author (Dr. Troy E. Sybert), I want a streamlined blog interface so that I can focus on content creation without multi-author complexity
- As a blog administrator, I want working search functionality so that visitors can find sermons and posts easily
- As a blog maintainer, I want a functional main menu so that users can navigate the site properly
- As a developer, I want organized code structure so that I can maintain and extend the blog efficiently
- As a content creator, I want a reliable deployment process so that I can publish posts quickly and confidently
- As a blog owner, I want to understand storage options so that I can choose the best approach for content management and search capabilities

## Functional Requirements

FR-1: The system shall convert the multi-author blog structure to single-author format, removing unnecessary multi-author components while maintaining template compliance
FR-2: The system shall fix the search functionality to allow users to search across all blog content
FR-3: The system shall repair the main menu navigation to ensure all links and sections work properly
FR-4: The system shall reorganize code structure following Hugo and Gruvbox theme best practices
FR-5: The system shall reorganize UI components for optimal single-author blog presentation
FR-6: The system shall test and verify Azure deployment configuration through GitHub Actions
FR-7: The system shall analyze and document storage strategy options for blog content with search capabilities
FR-8: The system shall establish a clear workflow for posting content through GitHub or alternative mechanisms

## Non-Goals (Out of Scope)

- Implementing mobile-first responsive design improvements
- Designing the automated blog deployment system (will be addressed in future features)
- Connecting to custom domain (voiceofrepentance.com)
- Adding new features beyond cleanup and conversion
- Overhauling the Gruvbox theme design system
- Implementing database storage solutions

## Design Considerations

The cleanup must maintain the Gruvbox theme's design system without overriding its core methodology. UI organization should follow the template's documentation for proper blog site structure. Any design changes should prioritize clean, minimalist interface while ensuring responsive design for different screen sizes.

## Technical Considerations

- Must stay within Gruvbox theme template rules and Hugo best practices
- Preserve existing Azure Static Web Apps deployment pipeline
- Maintain compatibility with current Hugo Extended, Node.js, and Go versions
- Consider search implementation options (client-side vs server-side vs external service)
- Evaluate storage strategies: static HTML files vs database integration
- Ensure code organization follows Hugo's recommended directory structure

## Dependencies

- Gruvbox Hugo theme (via Hugo Modules)
- Azure Static Web Apps deployment infrastructure
- GitHub Actions workflow for CI/CD
- Current project dependencies (Hugo Extended, Node.js, npm, Python for automation)

## Success Metrics

- Search functionality works across all blog content
- Main menu navigation functions properly on all pages
- Single-author conversion completed without breaking existing functionality
- Code structure organized according to Hugo best practices
- Azure deployment configuration verified and working
- Clear documentation of storage strategy options and recommendations
- Established workflow for efficient content posting
- Blog ready for daily content creation and publishing

## Open Questions

- What specific storage strategy will be chosen (static files vs database) and how will it impact search functionality?
- Should search be implemented client-side, server-side, or using an external search service?
- What is the preferred method for content posting (GitHub commits vs web interface vs API)?
- Are there any specific performance bottlenecks that need addressing beyond the identified issues?
- How will the single-author conversion affect existing content structure and URLs?
