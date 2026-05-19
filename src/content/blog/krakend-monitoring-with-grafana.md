---
title: 'KrakenD Monitoring with Grafana'
date: '2022-01-17'
description: 'Monitor your KrakenD services with Grafana.'
---

KrakenD is an ultra-performant open-source API gateway that can transform, aggregate, or remove data from multiple services with linear scalability.

In this post, I'll walk through how to monitor the status of KrakenD services with a Grafana dashboard.

![KrakenD Grafana dashboard](./_assets/grafana-krakend.jpeg)

Instead of building a dashboard from scratch, we can use one of the pre-configured dashboards available on grafana.com. We'll use the KrakenD dashboard with ID `5722`, prepared by `dlopez`. You can customize it later if you'd like.

By default, this dashboard gives us the following metrics:

- Requests from users to KrakenD
- Requests from KrakenD to your backends
- Response times
- Memory usage and details
- Endpoints and status codes
- Heatmaps
- Open connections
- Throughput
- Distributions, timers, garbage collection, etc.

## Prerequisites

- KrakenD

---

## InfluxDB Setup

The dashboard reads its metric data from InfluxDB. You can run InfluxDB easily with Docker:

```bash
docker run -p 8086:8086 \
  -e INFLUXDB_DB=krakend \
  -e INFLUXDB_USER=myusername -e INFLUXDB_USER_PASSWORD=mypassword \
  -e INFLUXDB_ADMIN_USER=admin -e INFLUXDB_ADMIN_PASSWORD=myadminpassword \
  -d --name=influx-1.8 \
  influxdb:1.8
```

```bash
docker exec -it influx-1.8 /bin/bash
```

---

## Grafana Setup

If Grafana is not yet installed, run it with Docker. After the following command, Grafana will be available at `http://localhost:3000`:

```bash
docker run \
  -d \
  -p 3000:3000 \
  --name=grafana \
  grafana/grafana
```

---

## KrakenD Configuration

Add the following configuration to your `krakend.json` at the root level. After this, your KrakenD metrics will start writing to InfluxDB at `<your-influx-db-server-ip>:8086`.

```json
{
  "version": 2,
  "extra_config": {
    "github_com/letgoapp/krakend-influx": {
      "address": "http://<your-influx-db-server-ip>:8086",
      "ttl": "25s",
      "buffer_size": 0
    },
    "github_com/devopsfaith/krakend-metrics": {
      "collection_time": "30s",
      "listen_address": "127.0.0.1:8090"
    }
  }
}
```

---

## Importing the Grafana Dashboard

1. Open `http://localhost:3000` in your browser. Use `admin` for both username and password.

2. Click `Configuration` in the side menu and find the button to add a data source. Select InfluxDB and fill in the details you provided when starting InfluxDB:
   - Query Language: `InfluxQL`
   - URL: `http://localhost:8086`
   - Access: `Browser`
   - Database: `krakend`
   - User: `admin`
   - Password: `myadminpassword`
   - HTTP Method: `GET`

3. To import the dashboard: click the `+` icon in the side menu, then `Import`. Select `Import via Grafana.com`. Enter `5722` as the ID and click `Load`. Your dashboard is ready — enjoy.

## Resources

- [KrakenD Grafana Dashboard on Grafana.com](https://grafana.com/grafana/dashboards/5722)
- [Native InfluxDB exporter](https://www.krakend.io/docs/extended-metrics/influxdb/)
- [Preconfigured Grafana dashboard](https://www.krakend.io/docs/extended-metrics/grafana/)
