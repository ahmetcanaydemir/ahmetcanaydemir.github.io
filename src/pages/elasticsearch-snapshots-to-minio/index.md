---
title: 'Elasticsearch snapshots to Minio'
date: '2021-12-23'
spoiler: 'Store your elasticsearch backups in Minio repository.'
---

[](/x/)

Minio is a high performance, self-hosted AWS S3 compatible object storage solution.

I will explain how we can store Elasticsearch snapshots in Minio.

## Prerequisites

* Minio
* Elasticsearch

---

## Creating Bucket

First we need a bucket to store elasticsearch snapshots.

You can create a bucket at Minio UI Console. Click **Buckets** from the left menu and click **Create Bucket**.

---

## Creating a Service Account

A service account is also required to establish a minio connection with Elasticsearch.

You can create a service account at Minio UI Console. Click **Service Accounts** from the left menu and click **Create Service Account**.

Save the **Secret Key** and **Access Key**, we will use this information during the plugin installation.

---

## Elasticsearch S3 Repository Plugin Installation

Since Minio is compatible with Amazon AWS S3, we will use the S3 repository plugin. For this, all elasticsearch nodes are connected and the following steps are applied.

First of all, install `repository-s3` plugin with following command:

```bash
/usr/share/elasticsearch/bin/elasticsearch-plugin install repository-s3
```

An S3 client named `default` will be created after plugin installed. Actions to be taken can be performed by this client. We will define the `access_key` and `secret_key` information to the default client for accessing minio.

```bash
/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.secret_key
# Waiting for secret key

/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.access_key
# Waiting for access key
```

After this stage, elasticsearch service should be restarted.

```bash
systemctl restart elasticsearch
```

---

## Adding Elasticsearch Repository

A repository named `my-minio-repository` can be created by sending following request:

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

## Manual snapshot

A snapshot named `my-first-snapshot` can be taken manually by sending following request:

```bash
PUT /_snapshot/my-minio-repository/my-first-snapshot?wait_for_completion=true
```

---

## Taking snapshots with policy

If desired, the snapshot process can be automated using the `snapshot policy`. For example, the policy below will save snapshots of all indexes to the minio repository at 07:30 every day.

```bash
PUT _slm/policy/daily-snapshots
{
    "name": "<daily-snapshot-{now/d}>",
    "schedule": "0 30 7 * * ?",
    "repository": "my-minio-repository"
}
```

---

## Restoring snapshots

The `my-first-snapshot` backup can be restored with the following request:

```bash
POST /_snapshot/my-minio-repository/my-first-snapshot/_restore
```

## Resource

https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html
