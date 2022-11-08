## How to

### Deploy script options

| Variable  | Description                                                                                                   |
|-----------|---------------------------------------------------------------------------------------------------------------|
| `STAGE`   | Environment to deploy to                                                                                      |
| `ASKPASS` | Whether to ask sudo password. Set to `yes` or `true` you don't want to write sudo password in the values file |

### Make a values file

Run this command from the project directory.

```sh
make deploy-init STAGE=production
```

A file named `values.production.yml` will be created in this directory.
Change its values to the desired state.

### First time deploy

Run this command from the project directory.

```sh
make deploy-setup STAGE=production
make deploy-app STAGE=production
```

### Update deployment

Change values file to desired values and run this command from the project directory.

```sh
make deploy-app STAGE=production
```

### Update application

Update the `image.tag` value if necessary then run this command from the project directory to perform an update on the application.
The playbook will attempt to download the latest image and perform update if necessary.

```sh
make update-app STAGE=production
```

## Values file description

Default values are provided in [values.default.yml](./values.default.yml)

### Application config

| Name                            | Description                                                                | Default value |
|---------------------------------|----------------------------------------------------------------------------|---------------|
| `config.app.name`               | Application name                                                           | `Sun* Portal` |
| `config.app.key`                | Application key                                                            |               |
| `config.app.env`                | Application environment                                                    | `production`  |
| `config.app.debug`              | Application debug                                                          | `false`       |
| `config.app.url`                | Application URL                                                            |               |
| `config.log_channel`            | Default log channel                                                        | `daily`       |
| `config.session_driver`         | Default session driver                                                     | `redis`       |
| `config.cache_driver`           | Default cache driver                                                       | `redis`       |
| `config.queue_connection`       | Default queue connection                                                   | `redis`       |
| `config.broadcast_driver`       | Default broadcast driver                                                   | `redis`       |
| `services.google.client_id`     | Google OAuth app client ID                                                 |               |
| `services.google.client_secret` | Google OAuth app client secret                                             |               |
| `extra_env_vars`                | Extra environment variables (`KEY: value` pairs) for application container |               |
| `webserver.replica_count`       | Web server replicas count                                                  | `1`           |
| `worker.replica_count`          | Worker replicas count                                                      | `1`           |
| `data_dir`                      | Data storage dir on host                                                   | `/data`       |

### PHP configuration

| Parameter | Description           | Default                                                                   |
|-----------|-----------------------|---------------------------------------------------------------------------|
| `php`     | PHP configuration     | `{}`                                                                      |
| `php-fpm` | PHP-FPM configuration | `{"pm":"ondemand","pm.max_children":40,"pm.process_idle_timeout":"300s"}` |

### Web server

These are available values for the application proxy (Traefik)

| Name                  | Description                            | Default value        |
|-----------------------|----------------------------------------|----------------------|
| `domain`              | Domain for the application             | `portal.local`       |
| `tls.enabled`         | Whether to enable TLS                  | `false`              |
| `tls.acme.email`      | Email for Let's Encrypt ACME           | `admin@portal.local` |
| `basic_auth.enabled`  | Whether to enable basic authentication | `false`              |
| `basic_auth.username` | Basic authentication user              |                      |
| `basic_auth.password` | Basic authentication password          |                      |

### Docker images

| Name                    | Description              | Default value                                      |
|-------------------------|--------------------------|----------------------------------------------------|
| `image.registry`        | Docker image registry    | `registry.gitlab.com/sun-asterisk-research/portal` |
| `image.tag`             | Docker image tag         | `develop`                                          |
| `image.webserver`       | Webserver image          | `web-server`                                       |
| `image.cli`             | CLI image                | `cli`                                              |
| `registries.*.url`      | Docker registry URL      |                                                    |
| `registries.*.username` | Docker registry username |                                                    |
| `registries.*.password` | Docker registry password |                                                    |

### Monitoring

| Name                                | Description                    | Default value |
|-------------------------------------|--------------------------------|---------------|
| `monitoring.enabled`                | Whether to enable monitoring   | `false`       |
| `monitoring.grafana.path`           | Web path for grafana           | `/grafana`    |
| `monitoring.grafana.admin_user`     | Grafana initial admin user     | `admin`       |
| `monitoring.grafana.admin_password` | Grafana initial admin password | `admin`       |

### MariaDB

| Name                           | Description                                         | Default value |
|--------------------------------|-----------------------------------------------------|---------------|
| `mariadb.extra_args`           | Extra CLI arguments for MariaDB                     | `[]`          |
| `mariadb.database`             | Database name                                       | `portal`      |
| `mariadb.username`             | Database user                                       | `portal`      |
| `mariadb.password`             | Database password                                   |               |
| `mariadb.root_password`        | Password for root user                              |               |
| `mariadb.random_root_password` | Whether to generate a random password for root user | `no`          |

### Host configuration

These are the values for Docker swarm cluster setup

| Name                    | Description                                                | Default value |
|-------------------------|------------------------------------------------------------|---------------|
| `hosts.manager`         | Manager nodes configuration                                | `{}`          |
| `hosts.worker`          | Worker nodes configuration                                 | `{}`          |
| `hosts.*.name`          | Name of the host                                           |               |
| `hosts.*.hostname`      | Hostname/IP address of the host                            |               |
| `hosts.*.port`          | SSH port                                                   |               |
| `hosts.*.user`          | SSH user                                                   |               |
| `hosts.*.identity_file` | SSH private key location                                   |               |
| `hosts.*.sudo_password` | Sudo password for SSH user. Use `ASKPASS` if not specified |               |
