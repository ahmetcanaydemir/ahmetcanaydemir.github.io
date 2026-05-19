---
title: 'Elasticsearch Snapshots to MinIO'
date: '2021-12-23'
description: 'Store your Elasticsearch backups in a MinIO repository.'
---

MinIO is a high-performance, self-hosted, AWS S3-compatible object storage solution.

In this post, I'll walk through how to store Elasticsearch snapshots in MinIO.

## Prerequisites

- MinIO
- Elasticsearch

---

## Creating a Bucket

First, we need a bucket to store Elasticsearch snapshots.

You can create one from the MinIO Console. Click **Buckets** in the left menu, then click **Create Bucket**.

![Creating a bucket](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iippohmwlinkwrcxern2.png)

---

## Creating a Service Account

A service account is also required so that Elasticsearch can authenticate with MinIO.

You can create one from the MinIO Console. Click **Service Accounts** in the left menu, then click **Create Service Account**.

Save the **Secret Key** and **Access Key** — we'll use them during the plugin installation.

![Creating a service account](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ejh1gjw6wu1nw53ds1s.png)

---

## Installing the Elasticsearch S3 Repository Plugin

Since MinIO is compatible with AWS S3, we can use the S3 repository plugin. Connect to each of your Elasticsearch nodes and run the following.

First, install the `repository-s3` plugin:

```bash
/usr/share/elasticsearch/bin/elasticsearch-plugin install repository-s3
```

Once the plugin is installed, an S3 client named `default` will be created. Any actions we run will go through this client. We need to give it the `access_key` and `secret_key` so it can talk to MinIO:

```bash
/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.secret_key
# Waiting for secret key

/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.access_key
# Waiting for access key
```

After this, restart the Elasticsearch service:

```bash
systemctl restart elasticsearch
```

---

## Adding the Elasticsearch Repository

Create a repository named `my-minio-repository` by sending the following request:

```bash
PUT _snapshot/my-minio-repository {
   "type": "s3",
   "settings": {
      "client": "default",
      "bucket": "elasticsearch-snapshots",
      "endpoint": "minio.example.com",
      "path_style_access": "true",
      "protocol": "http"
   }
}
```

---

## Manual Snapshot

Take a snapshot named `my-first-snapshot` manually with:

```bash
PUT /_snapshot/my-minio-repository/my-first-snapshot?wait_for_completion=true
```

---

## Taking Snapshots with a Policy

You can also automate snapshots with a snapshot policy. The policy below will save snapshots of all indices to the MinIO repository at 07:30 every day:

```bash
PUT _slm/policy/daily-snapshots
{
    "name": "<daily-snapshot-{now/d}>",
    "schedule": "0 30 7 * * ?",
    "repository": "my-minio-repository"
}
```

---

## Restoring Snapshots

Restore the `my-first-snapshot` backup with:

```bash
POST /_snapshot/my-minio-repository/my-first-snapshot/_restore
```

## Resources

- [Snapshot and restore](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html)
