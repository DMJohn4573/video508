# Video508

508-compliant video player implementation for Drupal 7, based on VideoJS library.

[![Drupal](https://badgen.net/badge/Drupal/7.x/blue)](https://www.drupal.org/7)
[![Release](https://badgen.net/github/release/DMJohn4573/video508)](https://github.com/DMJohn4573/video508/releases)
[![License](https://badgen.net/github/license/DMJohn4573/video508)][license]
[![Updated](https://badgen.net/github/last-commit/DMJohn4573/video508/main)](https://github.com/DMJohn4573/video508)
[![Issues](https://badgen.net/github/open-issues/DMJohn4573/video508)](https://github.com/DMJohn4573/video508/releases/issues)

## Requirements/Prerequisites

*  [drupal/libraries][drupal/libraries]: latest
*  [drupal/videojs][drupal/videojs]: ^7.x-2.5
*  [videojs/videojs](https://github.com/videojs/video.js): ^6.0<sup>*</sup>

_<sup>*</sup> based on the requirements for [VideoJS Drupal module][drupal/videojs]._

## Who is this repository for?

The 508-compliant video player was primarily developed for [DOI.gov][doi.gov] to be a wrapper for all video content presented on the site. To see it in action, please visit [the Video section on the DOi.gov][doi-video], which showcases a variety of videos posted on the agency's site.

After receiving positive reviews internally within the agency, as well as externally from other agencies, the player was converted into a standalone Drupal 7 module. This module is now available to everyone. Please consult with the [LICENSE][license].

## Installation

### Manual

The module is installed following standard [module installation procedure for Drupal 7](https://www.drupal.org/docs/7/extend/installing-modules).

- download and install all dependencies,
- download and install VideoJS library v6 from [videojs/videojs],
- download and install the module,
- enable the module.

### Using Composer

If you are using Composer to manage modules and dependencies in your project, add the following entry to repositories list in your `composer.json` file:

<pre>
{
  "type": "package",
  "package": {
    "name": "doi/video508",
    "version": "2.0",
    "type": "drupal-module",
    "source": {
      "url": "git@bitbucket.org:DMJohn4573/video508.git",
      "type": "git",
      "reference": "master"
    }
  }
}
</pre>

Then run `composer require drupal/libraries drupal/videojs doi/video508` to add Video508 module and dependencies to the project.

Proceed with installing the modules following standard [module installation procedure for Drupal 7](https://www.drupal.org/docs/7/extend/installing-modules).

## Configuration

The configuration of the module is found at `admin/config/media/video-508`.

## Contribution guidelines

For agencies willing to participate and contribute - please create a fork and submit a PR.

## Support

The module has been developed for Drupal 7 and has no Drupal 9/10 support. There are plans on porting the modules to Drupal 9/10, but the roadmap and release date are TBD.

This repository is owned by [US Department of Interior][doi.gov]
For support, please log issues within the project's issues queue.

## Credits

- Assembled by [WebFirst, INC][webfirst]
- Support by [US Department of Interior][doi.gov].

[doi.gov]: https://www.doi.gov
[webfirst]: https://www.webfirst.com
[drupal/libraries]: https://www.drupal.org/project/libraries
[drupal/videojs]: https://www.drupal.org/project/videojs
[videojs/videojs]: https://github.com/videojs/video.js
[doi-video]: https://www.doi.gov/video
[license]: ./LICENSE
