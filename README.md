# VOR Blog

A modern blog built with Hugo and Tailwind CSS, designed for deployment on Azure Static Web Hosting. This project uses the Gruvbox theme as a foundation with custom Tailwind CSS styling.

## Features

- Fast and responsive design using Tailwind CSS
- SEO-friendly structure
- Optimized for Azure Static Web Hosting
- Markdown content support
- Automation process for blog posting

## System Requirements

This project has been tested with the following tool versions:

- **Hugo Extended** v0.146.7 (required for Tailwind CSS processing)
- **Node.js** v22.11.0
- **npm** v10.9.0
- **Python** v3.12 (for automation scripts)

## Project Structure

- `content/` - All blog content (posts, pages, etc.)
- `themes/gruvbox/` - The Gruvbox theme (Git submodule)
- `assets/css/` - Custom CSS including Tailwind configuration
- `layouts/` - Custom layout templates that override the theme
- `static/` - Static assets like images and fonts

## Development Workflow

### Setup

1. Clone this repository

   ```bash
   git clone https://github.com/HacksterT/VOR-Blog.git
   cd VOR-Blog
   ```

2. Initialize the theme submodule (if not already done)

   ```bash
   git submodule update --init --recursive
   ```

3. Install Node.js dependencies

   ```bash
   npm install
   ```

4. Set up Python virtual environment (for automation scripts)

   ```bash
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # On Windows
   pip install -r requirements.txt
   ```

### Local Development

1. Start the Hugo development server

   ```bash
   hugo server -D
   ```

2. Visit [http://localhost:1313](http://localhost:1313) to see your site

### Creating Content

To create a new blog post:

```bash
hugo new content/posts/my-new-post.md
```

## Deployment

This site is configured for deployment to Azure Static Web Apps. The deployment process involves:

1. Pushing changes to the main branch of this repository
2. Azure Static Web Apps will automatically build and deploy the site

## License

MIT
