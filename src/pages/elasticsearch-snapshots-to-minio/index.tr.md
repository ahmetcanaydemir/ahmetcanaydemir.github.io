---
title: 'Elasticsearch Snapshotlarını Minio''da Saklama'
date: '2021-12-23'
spoiler: 'Elasticsearch yedeklerinizi Minio''da tutun.'
---

Minio yüksek performanslı, self-hosted AWS S3 uyumlu object storage çözümüdür.

Elasticsearch snapshotlarını Minio'da nasıl saklayabileceğimizi açıklayacağım.

## Ön gereksinimler

* Minio
* Elasticsearch

---

## Bucket Oluşturma

Öncelikle elasticsearch snapshotlarının depolanması için bir bucketa ihtiyacımız var.

Minio UI console'u açıp sol menüden **Buckets**'a girip **Create Bucket** ile bir bucket oluşturabilirsiniz.

---

## Service Account Oluşturma

Elasticsearch ile minio bağlantısı kurmak için bir de servis hesabı gerekiyor.

Minio UI console'u açıp sol menüden **Service Accounts**'a girip **Create Service Account** ile service account oluşturabilirsiniz.

Bu aşamada göreceğiniz **Secret Key** ve **Access Key**i kaydedin bu bilgileri plugin kurulumu sırasında kullanacağız.

---

## Elasticsearch S3 Repository Plugin Kurulumu

Minio, Amazon AWS S3 ile uyumlu olduğu için S3 repository plugin kullanacağız. Bunun için bütün elasticsearch nodelarına bağlanılır ve aşağıdaki adımlar uygulanır.

Öncelikle aşağıdaki komut ile `repository-s3` plugini kurulur.

```bash
/usr/share/elasticsearch/bin/elasticsearch-plugin install repository-s3
```

S3 plugini ile birlikte elasticsearch üzerinde default adında S3 client oluşmaktadır. Yapılacak işlemler bu
kullanıcı üzerinden gerçekleştirilebilir. Snapshotların gönderileceği minio sunucusuna erişmek için gerekli olan `access_key` ve `secret_key` bilgileri default client'a tanımlanır.

```bash
/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.secret_key
# Secret key girilmesi beklenecek

/usr/share/elasticsearch/bin/elasticsearch-keystore add s3.client.default.access_key
# Access key girilmesi beklenecek
```

Bu aşamadan sonra elasticsearch servisi yeniden başlatılmalıdır.

```bash
systemctl restart elasticsearch
```

---

## Elasticsearch Repository Ekleme

Aşağıdaki gibi bir istek gönderilerek `my-minio-repository` isimli bir repository oluşturulabilir.

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

## Elle snapshot alma

Aşağıdaki gibi bir istek gönderilerek `my-first-snapshot` isimli bir snapshot elle alınabilir.

```bash
PUT /_snapshot/my-minio-repository/my-first-snapshot?wait_for_completion=true
```

---

## Policy ile snapshot alma

İstenirse snapshot alma işlemi `snapshot policy` kullanılarak otomatikleştirilebilir. Örneğin aşağıdaki policy her gün 07:30'da tüm indexlerin snapshotını minio repository'e kaydedecektir.

```bash
PUT _slm/policy/daily-snapshots
{
    "name": "<daily-snapshot-{now/d}>",
    "schedule": "0 30 7 * * ?",
    "repository": "my-minio-repository"
}
```

---

## Snapshotları geri yükleme

Aşağıdaki istek ile `my-first-snapshot` yedeği geri yüklenebilir.

```bash
POST /_snapshot/my-minio-repository/my-first-snapshot/_restore
```

## Kaynak

[Snapshot and restore](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html)
