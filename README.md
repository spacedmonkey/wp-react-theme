WP React theme
===

A WordPress theme based on the _s by Automattic, but uses react and REST API to render content. 

Installation
===

### Requirements

- [Node.js](https://nodejs.org)
- [Composer](https://getcomposer.org)

### Installing locally

- git clone git@github.com:spacedmonkey/wp-react-theme.git
- cd wp-react-theme
- npm i
- npm run build

## License

The WP React Theme is licensed under the GPL v2 or later.

> This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

> This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

> You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA


## Contributions

Anyone is welcome to contribute to WP React Theme. 

Please make sure that all contribution pass lints, but running the following before submitting code. 
- npm run lint:php
- npm run lint:css
- npm run lint:js

There are various ways you can contribute:

* Raise an issue on GitHub.
* Send us a Pull Request with your bug fixes and/or new features.
* Provide feedback and suggestions on enhancements.

It is worth noting that, this project has travis enabled and runs automated tests, including code sniffing and unit tests. Any pull request will be rejects, unless these tests pass. This is to ensure that the code is of the highest quality, follows coding standards and is secure.
