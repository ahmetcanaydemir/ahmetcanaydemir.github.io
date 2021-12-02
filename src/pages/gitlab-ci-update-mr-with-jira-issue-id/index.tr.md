---
title: 'GitLab CI: Jira Issue Id ile MR Güncelleme'
date: '2021-12-02'
spoiler: 'Jira Issue Id ile MR başlığını ve açıklamasını güncelleyin'
---

[](/x/)


Bir önceki yazımda branch isimlerini ve commit mesajlarını belirli kurallara bağlamıştık. Şimdi bir adım daha ileri gideceğim. MR açıldığında başlığında Jira issue id (örn. ISSUE-0000) varsa, başlığa jira'daki başlığını ve açıklamaya jiradaki açıklamayı çekeceğiz. Eğer başlıkta Jira Issue Id hiç yoksa CI fail olacak.

---

Bunu yapmak için özetle şu adımları takip edebiliriz.


1. MR başlığında issue id var mı kontrol et. Yoksa fail döndür. Bunun için regex kullanacağız. `$CI_MERGE_REQUEST_TITLE` bize MR başlığını verecektir.
2. Issue Id'yi ayıkla ve Jira API'ından verileri çek. `https://jira.<your-hostname>/rest/api/2/issue/ISSUE-0000` jira adresine GET isteği yaptığınızda size JSON olarak Issue detayları dönecektir.
3. jq ile dönen json verilerinden `summary` ve `description` kısmını al ve değişkene ata.
4. GitLab API kullanarak MR'ın title ve descriptionunu güncelle.

---

## Curl ve jq Kurulumu

API isteklerimiz için `curl`, JSON ayrıştırmak için ise `jq`ya ihtiyacımız var

```bash
apk add --update curl && apk add --update jq && rm -rf /var/cache/apk/*
```

---

## Issue Id Kontrolü

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+)"
ISSUE_ID_IN_MR=$(echo "$CI_MERGE_REQUEST_TITLE" | grep -o -E "$REGEX_ISSUE_ID")
[[ -z "$ISSUE_ID_IN_MR" ]]; then exit 1; fi 
```

---

## Jira Issue Ayrıştırılması

Curl isteği atarken boşlukların sorun olması nedeni ile `DESCRIPTION_JSON` ile boşlukları karakter olarak saklıyoruz.

```bash
JSON=$(curl -s -u <jira-kullanici-adiniz>:<jira-sifreniz> -X GET -H "Content-Type:application/json" "https://jira.<sunucu-adresiniz>/rest/api/2/issue/$ISSUE_ID_IN_MR")

SUMMARY=$(echo "$JSON" | jq -r ".fields.summary")
DESCRIPTION=$(echo "$JSON" | jq -r ".fields.description")
DESCRIPTION_JSON=$(jq --null-input --compact-output --arg msg "$DESCRIPTION" '$msg')
```

---

## Merge Request'in Güncellenmesi

Private tokena ihtiyacınız var [GitLab dökümantasyonundan](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) nasıl alabileceğinizi öğrenebilirsiniz.

```bash
curl -v \
--data "{\"title\": \"${ISSUE_ID_IN_MR} ${SUMMARY}\"\"description\": ${DESCRIPTION_JSON}}" \
--fail \
--header "Content-Type:application/json; charset=utf-8" \
--header "PRIVATE-TOKEN:<private-tokenınız>" \
--output "/dev/null" \
--request PUT \
--show-error \
--silent \
--trace-ascii "/dev/stderr" \
--write-out "HTTP response: %{http_code}\n\n" \
"${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_request$CI_MERGE_REQUEST_IID"
```

---

## Sonuç

Tüm bunları bir GitLab CI yml dosyasında birleştirdiğimizde şöyle görünecekir.


```yml
check_mr:
  image: alpine
  stage: test
  script:
    - apk add --update curl && apk add --update jq && rm -rf /var/cache/apk/*
    - IFS=$"\n"
    - REGEX_ISSUE_ID="^(ISSUE-[0-9]+)"
    - ISSUE_ID_IN_MR=$(echo "$CI_MERGE_REQUEST_TITLE" | grep -o -E "$REGEX_ISSUE_ID")
    - if [[ -z "$ISSUE_ID_IN_MR" ]]; then exit 1; fi 
    - JSON=$(curl -s -u <jira-kullanici-adiniz>:<jira-sifreniz> -X GET -H "Content-Type:application/json" "https://jira.<sunucu-adresiniz>/rest/api/2/issue/$ISSUE_ID_IN_MR")
    - SUMMARY=$(echo "$JSON" | jq -r ".fields.summary")
    - DESCRIPTION=$(echo "$JSON" | jq -r ".fields.description")
    - DESCRIPTION_JSON=$(jq --null-input --compact-output --arg msg "$DESCRIPTION" '$msg')
    - |
      curl -v \
      --data "{\"title\": \"${ISSUE_ID_IN_MR} ${SUMMARY}\", \"description\": ${DESCRIPTION_JSON}}" \
      --fail \
      --header "Content-Type:application/json; charset=utf-8" \
      --header "PRIVATE-TOKEN:<private-tokenınız>" \
      --output "/dev/null" \
      --request PUT \
      --show-error \
      --silent \
      --trace-ascii "/dev/stderr" \
      --write-out "HTTP response: %{http_code}\n\n" \
      "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/$CI_MERGE_REQUEST_IID"
    only:
      - merge_requests
```

---

Oluşturduğunuz bu dosyayı GitLab projenize CI dosyası olarak eklemelisiniz. Bütün bu işlemlerden sonra artık MR başlıklarınız ve açıklamalarınız çok daha düzenli ve anlaşılır olacak.