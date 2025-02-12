<div id="readme-top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GPL License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">📰 blog</h2>

  Personal portfolio and sandbox on the web.

<p align="center">

</p>

  <p align="center">
    Created by <span><a href="https://github.com/montymi">@montymi</a></span>
    <br />
    <br />
    <a href="https://montymi.com">View Demo</a>
    ·
    <a href="https://github.com/montymi/blog/issues">Report Bug</a>
    ·
    <a href="https://github.com/montymi/blog/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#structure">Structure</a></li>
    <li><a href="#tasks">Tasks</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

This personal portfolio brings together my work as a software developer and academic. It serves as a central hub for showcasing projects, research, and other contributions; specifically, the repository includes highlights of my software development journey, from personal projects to larger initiatives, as well as academic papers and research that have informed my approach to problem-solving and technology.

The goal is simple: to document and share my progress while providing a snapshot of my skills and experiences in one place. Whether you're here to explore my software projects or academic work, I hope you find something of interest.

<br />

### Built With
[![React][reactLogo]][reactLogo-url]
[![TypeScript][tsLogo]][tsLogo-url]
[![Vite][viteLogo]][viteLogo-url]
[![PWA][pwaLogo]][pwaLogo-url]
[![Recoil][recoilLogo]][recoilLogo-url]
[![React Router][rrLogo]][rrLogo-url]
[![MUI][muiLogo]][muiLogo-url]
[![Vercel][vercelLogo]][vercelLogo-url]
[![Three.js][threejsLogo]][threejsLogo-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

For interacting with the demo:

<a href="https://montymi.com" target="_blank">Check out the website!</a>

For interacting with the code:

1. Clone and navigate into the repo with:
  ```bash
  git clone https://github.com/montymi/blog.git && cd blog
  ```
2. Install dependencies
  ```bash
  npm install
  ```
3. Run development server for testing
  ```bash
  npm run dev
  ```
4. Build app for production server
  ```bash
  npm run build
  ```
5. Run production server locally
  ```bash
  npm run preview
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

The portfolio is divided into three main sections: Discography, Library, and Activity, each offering a unique way to explore my journey as a developer and academic.

### Discography 🎙️
The Discography takes you on an audio-driven walkthrough of my projects, styled like a musical catalog. Each entry is crafted to give you deeper insights into the story behind the work:

- Singles: Bite-sized projects or experiments that showcase quick ideas or concepts.
- Episodes: Medium-scale projects, often part of a series, reflecting a deeper dive into specific topics.
- Albums: Comprehensive, larger-scale projects that represent significant milestones in my career.

### Library 🗂️ 
The Library serves as a repository of my academic work and technical writing, including:

- Research papers and publications, complete with summaries and external links.
- Documentation and guides related to tools, frameworks, or methodologies I’ve explored.
- Notes and reflections that capture the thinking behind my work.
- It’s the ideal place for a more in-depth look at my technical expertise and academic contributions.

### Activity 🔍
The Activity section is a set of cards that highlight what I’m currently working on, experimenting with, or learning about. Here, you’ll find:

- Updates on ongoing projects and experiments.
- Prototypes and beta versions of ideas in progress.
- Personal insights and reflections about my process and challenges.
- This section keeps things fresh and offers a behind-the-scenes look at my development as a creator and researcher.

### Blog 🌍
The blog section is where whatever’s on my mind, tech, life, and everything in between. can be found Expect a mix of:

- Deep dives into code & tech when I’m in full-on nerd mode.
- Lessons learned (sometimes painfully) from projects, experiments, and life in general.
- Random musings & stories—anything from a high school vignette to a weird realization at 2 AM.
- Hot takes on trends (tech or otherwise) that I can’t keep to myself.
- Guides & tutorials for things I finally figured out and want to spare someone else the headache.

### What's Next?
- Listen: Start with the Discography for an engaging overview of my work, guided by audio storytelling.
- Explore: Dive into the Library for a detailed understanding of my academic and technical background.
- Follow: Check the Activity feed for the latest updates and ideas I’m exploring.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- STRUCTURE -->
## Structure

```
src
├── components
│   ├── Loading
│   └── Meta
├── config
│   ├── index.ts
│   ├── it-jokes.ts
│   └── types.ts
├── error-handling
│   ├── fallbacks
│   └── index.tsx
├── hooks
│   ├── useHistory.ts
│   ├── useLatestCommit.ts
│   ├── useOrientation.ts
│   ├── usePosts.ts
│   ├── useReadMe.ts
│   └── useServiceWorkerNotifications.tsx
├── pages
│   ├── Activity
│   ├── Blog
│   ├── Discography
│   ├── Library
│   ├── NotFound
│   └── Welcome
├── routes
│   ├── Pages
│   ├── index.ts
│   └── types.ts
├── sections
│   ├── Header
│   ├── HotKeys
│   ├── Notifications
│   ├── Sidebar
│   └── SW
├── store
│   ├── hotkeys
│   ├── notifications
│   ├── sidebar
│   └── theme
├── theme
│   ├── Provider.tsx
│   ├── themes.ts
│   └── types.ts
├── utils
│   ├── insertIf
│   ├── loader
│   ├── is-mobile.ts
│   ├── reset-app.ts
│   ├── sleep.ts
│   └── welcome.ts
├── App.tsx
├── main.tsx
└── Root.tsx
api
└── date.ts # for running with vercel serverless functions

```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TASKS -->
## Tasks

- [X] Use vercel serverless functions for handling API calls
- [X] Continue adding projects to the Discography
- [X] Continue various paper and presentation transfer to the Library
- [X] Allow scrolling in the Welcome Page
- [X] Design and upload the Activity Page
- [X] Optimize PDF view on phone (using isMobile to show PDF as full-screen perhaps)
- [ ] Create a more interactive 3D environment for the Vinyl object
- [ ] Add audio files for all Published projects in the Discography

See the [open issues](https://github.com/montymi/blog/issues) for a full list of issues and proposed features.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

1. [Fork the Project](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. [Open a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License 

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
## Contact

[![LinkedIn][linkedin-shield]][linkedin-url] [![Email][email-shield]][email-url] [![Portfolio][website-shield]][website-url]


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [react-pwa](https://github.com/suren-atoyan/react-pwa) by @suren-atoyan for the amazing PWA template
* [historylabs](https://events.historylabs.io/) for the fun and free API for seeing historical events
* [ClearDocs](https://github.com/montymi/ClearDocs) for the high quality README template
* [Vercel][vercelLogo-url] for fast and free deployment, hosting, and serverless functions

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/montymi/blog.svg?style=for-the-badge
[contributors-url]: https://github.com/montymi/blog/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/montymi/blog.svg?style=for-the-badge
[forks-url]: https://github.com/montymi/blog/network/members
[stars-shield]: https://img.shields.io/github/stars/montymi/blog.svg?style=for-the-badge
[stars-url]: https://github.com/montymi/blog/stargazers
[issues-shield]: https://img.shields.io/github/issues/montymi/blog.svg?style=for-the-badge
[issues-url]: https://github.com/montymi/blog/issues
[license-shield]: https://img.shields.io/github/license/montymi/blog.svg?style=for-the-badge
[license-url]: https://github.com/montymi/blog/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin
[linkedin-url]: https://linkedin.com/in/michael-montanaro
[muiLogo]: https://img.shields.io/badge/-Material%20UI-black.svg?style=for-the-badge&logo=mui&logoColor=natural
[muiLogo-url]: https://mui.com/
[pwaLogo]: https://img.shields.io/badge/-PWA-black.svg?style=for-the-badge&logo=pwa&logoColor=natural
[pwaLogo-url]: https://web.dev/progressive-web-apps/
[reactLogo]: https://img.shields.io/badge/-React-black.svg?style=for-the-badge&logo=react&logoColor=natural
[reactLogo-url]: https://reactjs.org/
[recoilLogo]: https://img.shields.io/badge/-Recoil-black.svg?style=for-the-badge&logo=recoil&logoColor=natural
[recoilLogo-url]: https://recoiljs.org/
[rrLogo]: https://img.shields.io/badge/-React%20Router-black.svg?style=for-the-badge&logo=react-router&logoColor=natural
[rrLogo-url]: https://reactrouter.com/
[tsLogo]: https://img.shields.io/badge/-TypeScript-black.svg?style=for-the-badge&logo=typescript&logoColor=natural
[tsLogo-url]: https://www.typescriptlang.org/
[viteLogo]: https://img.shields.io/badge/-Vite-black.svg?style=for-the-badge&logo=vite&logoColor=natural
[viteLogo-url]: https://vitejs.dev/
[vercelLogo]: https://img.shields.io/badge/-Vercel-black.svg?style=for-the-badge&logo=vercel&logoColor=natural
[vercelLogo-url]: https://vercel.com/
[threejsLogo]: https://img.shields.io/badge/-Threejs-black.svg?style=for-the-badge&logo=three.js&logoColor=natural
[threejsLogo-url]: https://threejs.org/
[email-shield]: https://img.shields.io/badge/-Email-black.svg?style=for-the-badge&logo=gmail&logoColor=natural
[email-url]: mailto:mcmontanaro01@gmail.com
[website-shield]: https://img.shields.io/badge/-Portfolio-black.svg?style=for-the-badge&logo=react&logoColor=natural
[website-url]: https://montymi.com/
