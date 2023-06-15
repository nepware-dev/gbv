# Installation

- Clone or download the git repo.
- The project uses packages from composer and also eslint as devDependency from yarn/npm. Make sure to install composer and yarn/npm in your system and execute the command below to install required dependencies

```
cd project_dir
composer install
yarn
```

# Usage

## Setup using docker-compose

1. Create external-service docker network `docker network create external-services`
2. If server is setup for local environment than soft link `docker-compose.local.yml` else link `docker-compose.prod.yml` for production
   - For development/testing `ln -s docker-compose.local.yml docker-compose.yml`
   - For staging/production `ln -s docker-compose.prod.yml docker-compose.yml`
3. Create an `.env` file from `.env.example` file, and set appropriate and required environmental variable as explained in `.env.example`
4. If MySQL database is required, execute the command: `docker-compose -f external-services.yml up -d`
   - The server requires the database to be created before starting.
   - To create database
     - Access container shell by running the command: `docker exec -it <CONTAINER_NAME> bash`
     - Access the database by running the command: `mysql -uroot -p`
     - Create the database by running the command: `create database <DATABASE_NAME>`. Replace DATABASE_NAME with actual database
5. Run `docker-compose up -d` to start the server.
6. Access server using url http://localhost:8080

## Composer

With `composer require ...` you can download new dependencies to your
installation.

```
cd some-dir
composer require drupal/devel:~1.0
```

## Drush

- Runserver (PHP’s built-in http server for development): `drush runserver`
- Clear cache: `drush cc`
- Clear all cache: `drush cache-rebuid`
- Shows list of available modules & themes `drush pml`
- Run any pending database updates `drush updb`
- Enable a module: `drush pm:enable {name_of_module}`
- Disable a module: `drush pm:uninstall {name_of_module}`
- Check Drupal Composer packages for security updates: `drush pm:security`
- Check watchdog (logged events): `drush ws`

# Customizing Theme

This website uses Bootstrap Barrio as a base theme and the gbv theme is a bootstrap_sass extension of it.
If any theme changes is needed to be done, follow steps below
`cd web/themes/custom/gbv`

- Edit the gulpfile.js and change the proxy to your server URL followed by installing dependencies and creating js,css.

```
browserSync.init({
    proxy: 'http://yourdomain.com',
})
yarn
yarn gulp
```
