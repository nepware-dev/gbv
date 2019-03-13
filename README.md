# Installation
*  Clone or download the git repo.
*  The project uses packages from composer and also eslint as devDependency from yarn/npm. Make sure to install composer and yarn/npm in your system and execute the command below to install required dependencies
```
cd project_dir
composer install
yarn install
```
# Usage
## Composer

With `composer require ...` you can download new dependencies to your 
installation.

```
cd some-dir
composer require drupal/devel:~1.0
```
## Drush
- Runserver (PHP’s built-in http server for development): `drush runserver`
- Clear cache: `drush cc` & to clear all cache: `drush cc all`
- Shows list of available modules & themes `drush pml`
- Run any pending database updates `drush updb`
- Download  module or theme `drush pm-download project_name`
- Enable a module: `drush up {name_of_module}`
- Disable a module: `drush dis {name_of_module}`
- Update a module: `drush up {name_of_module}`
- Check watchdog (logged events): `drush ws`

