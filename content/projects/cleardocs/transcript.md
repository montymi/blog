## Documentation CLI

ClearDocs generates READMEs and Material for MkDocs sites from the command line. Minimal and standard templates include a homepage copied from an existing README, with optional getting started, configuration, and contributing pages.

## Preview, build, deploy

Use `cleardocs serve` for local previews and `cleardocs build --strict` to validate the site. The GitHub Pages option generates a workflow that checks pull requests and deploys changes from main. Generated sites work directly with MkDocs.

## File protection and packaging

Existing scaffold files and READMEs are preserved unless replacement is explicitly requested. Requires Python 3.10 or newer. Install from GitHub; PyPI publication is pending. The release workflow builds and checks distributions, tests the installed wheel, and supports PyPI Trusted Publishing.
