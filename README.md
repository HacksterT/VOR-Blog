# Voice of Repentance Blog

A modern multi-client blog platform built with Hugo and Tailwind CSS, designed for deployment on Azure Static Web Hosting. This project uses the Gruvbox theme as a foundation with custom Tailwind CSS styling.

## Features

- Fast and responsive design using Tailwind CSS
- SEO-friendly structure
- Optimized for Azure Static Web Hosting
- Markdown content support
- Automation process for sermon posting via n8n workflows
- Multi-client structure with individual blog sections
- Fixed sidebar bio sections for each client

## System Requirements

This project has been tested with the following tool versions:

- **Hugo Extended** v0.146.7 (required for Tailwind CSS processing)
- **Go** v1.24.2 (required for Hugo Modules)
- **Node.js** v22.11.0
- **npm** v10.9.0
- **Python** v3.12 (for automation scripts)

### Why Go is Required

The Gruvbox theme uses Hugo Modules for dependency management, which requires Go to be installed. Hugo Modules are based on Go Modules and provide a clean way to manage theme dependencies without using Git submodules.

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

2. Initialize the project as a Hugo module

   ```bash
   hugo mod init github.com/HacksterT/VOR-Blog
   ```

3. Fetch the Gruvbox theme and its dependencies

   ```bash
   hugo mod get
   ```

4. Generate package.json based on theme requirements

   ```bash
   hugo mod npm pack
   ```

5. Install Node.js dependencies

   ```bash
   npm install
   ```

6. Set up Python virtual environment (for automation scripts)

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

#### Author Pages

Each author has their own dedicated section at `/posts/authorname/` with their bio and posts.

To set up a new author:

1. Create a directory for the author under `content/posts/`

   ```bash
   mkdir -p content/posts/authorname
   ```

1. Create an `_index.md` file in the author's directory with their bio:

   ```bash
   hugo new content/posts/authorname/_index.md
   ```

1. Edit the file to include the author's bio and information.

#### Blog Posts

To create a new blog post for an author:

```bash
hugo new content/posts/authorname/post-title.md
```

Make sure to set the `author` field in the front matter to match the author's name.

## Implementation Plan

### Site Structure

The Voice of Repentance website will be structured as a multi-client blog platform with the following architecture:

1. **Main Domain Structure**:
   - Main site: [www.voiceofrepentance.com](https://www.voiceofrepentance.com) (landing page)
   - Client subsites: [www.voiceofrepentance.com/[client-name]](https://www.voiceofrepentance.com/client-name)

2. **Content Organization**:

   ```text
   content/
   ├── _index.md                  # Main landing page
   ├── client1/                   # First client's section
   │   ├── _index.md              # Client landing page with bio
   │   ├── posts/                 # Client's sermon posts
   │   │   ├── sermon1.md
   │   │   └── sermon2.md
   ├── client2/                   # Second client's section
   │   ├── _index.md              # Client landing page with bio
   │   └── posts/                 # Client's sermon posts
   ...
   ```

### Template Customization

Custom templates will be created to achieve the desired layout:

1. **Main Landing Page Template**:  
   - Introduction to Voice of Repentance
   - Directory/grid of client sections with photos
   - Navigation to individual client pages

2. **Client Section Template**:
   - Fixed sidebar with client bio (non-scrolling)
   - Main content area for sermon posts
   - Custom header with client name/branding

3. **Single Post Template**:
   - Maintains the client bio on the right
   - Sermon content on the left
   - Metadata like date, categories, tags

### Automation Integration

The site will integrate with n8n workflows for automated content posting:

1. **Workflow Process**:
   - Clients upload sermon transcripts
   - n8n automated workflow processes these transcripts
   - The workflow automatically posts to the respective client's blog section

2. **API Endpoint**:
   - Secure endpoint for n8n to post content
   - Authentication for secure content submission

3. **Content Creation Process**:
   - Generate markdown files with proper front matter
   - Place in correct client directory
   - Trigger site rebuild

4. **Git Integration**:
   - Automated commits to the repository
   - Trigger deployment pipeline

### Azure Static Web Apps Configuration

1. **Deployment Pipeline**:
   - GitHub Actions workflow for automatic deployment
   - Hugo build configuration
   - Custom domain setup with SSL

2. **Performance Optimization**:
   - Caching rules
   - CDN configuration

### Client Management

1. **Client Onboarding Process**:
   - Template for new client sections
   - Standard bio format with customization options
   - Documentation for sermon submission

2. **Access Control** (if needed):
   - Section-specific access restrictions
   - Client management authentication

### Technical Considerations

1. **URL Structure**:
   - Clean URLs for SEO
   - Proper redirects if needed

2. **Responsive Design**:
   - Adapt fixed bio layout for mobile devices
   - Ensure readability on all screen sizes

3. **Search Functionality**:
   - Global search across all sermons
   - Client-specific search within sections

4. **Performance**:
   - Image and asset optimization
   - Lazy loading for sermon content

### Next Steps

1. Create the basic site structure with a sample client section
2. Customize the templates to match the desired layout
3. Set up the automation workflow with n8n
4. Test the end-to-end process with sample sermon content
5. Deploy to Azure and configure the domain

## Deployment

### Azure Static Web Apps Deployment

This site is configured for deployment to Azure Static Web Apps using GitHub Actions. The deployment process is fully automated:

1. **Azure Resources**:
   - Resource Group: `VOR-Blog-RG` (East US region)
   - Static Web App: Free tier with path-based routing
   - Custom domain: `www.voiceofrepentance.com` (configured in Azure Portal)

2. **Deployment Process**:
   - Pushing changes to the main branch of this repository triggers the deployment
   - GitHub Actions workflow builds the Hugo site with Tailwind CSS
   - Azure Static Web Apps hosts the built site with global CDN distribution

3. **GitHub Actions Workflow**:
   - Located at `.github/workflows/azure-static-web-apps-proud-dune-0f72d5f0f.yml`
   - Includes Hugo Extended build steps for Tailwind CSS processing
   - Handles Node.js dependencies installation
   - Automatically deploys to Azure on successful build

4. **Custom Domain Setup**:
   - In Azure Portal, navigate to the Static Web App resource
   - Go to Custom domains section
   - Add both apex domain (`voiceofrepentance.com`) and www subdomain
   - Follow Azure's DNS validation process with your domain registrar

5. **Path-Based Client Structure**:
   - Main site: `www.voiceofrepentance.com`
   - Client sites: `www.voiceofrepentance.com/[client-name]`
   - No additional Azure configuration needed for this structure

6. **Monitoring Deployments**:
   - Check GitHub Actions tab for build status
   - Azure Portal provides deployment history and logs
   - Use Azure Monitor for performance metrics

### Local Testing Before Deployment

Before pushing changes to trigger deployment, test locally:

```bash
# Build the site locally to verify it works
hugo --minify

# Serve the built site locally to check the production build
npx serve public
```

Visit [http://localhost:3000](http://localhost:3000) to preview the production build.

## License

MIT
