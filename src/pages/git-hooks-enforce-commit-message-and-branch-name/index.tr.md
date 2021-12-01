---
title: Git Hooks: Branch Adı ve Commit Mesajına Kural Ekleme
date: '2021-01-07'
spoiler: Git hooklarıyla branch ve commit için kurallar koyun
---

[](/x/)

Takımınızda bazı şeyleri standart hale getirmek istiyorsanız, katı kurallar uygulamanız gerekebilir. Git bağlamında bazı kurallar şöyle olabilir:
- Branch isimleri ISSUE-0000/feature-name şeklinde olmalıdır.
- Commit mesajları ISSUE-0000 (Jira issue id) ile başlamalıdır.

Bu yazıda bahsettiğim iki kuralı git hooks kullanarak nasıl ekleyebileceğimizi göstereceğim.

---

Farklı aşamalarda çalışan bazı [git hookları](https://git-scm.com/docs/githooks) bulunuyor. Biz yukarıda bahsettiğim kurallar için aşağıdaki iki client side hookunu kullanacağız:

- **pre-commit:** Bu hook git-commit tarafından tetiklenir ve `--no-verify' argümanı ile atlanabilir. Commit öncesinde branch adını adını kontrol etmek için bu hooku kullanacağız.
- **commit-msg:** Bu hook git-commit ve git-merge tarafından tetiklenir ve `--no-verify' argümanı ile atlanabilir. Bu hooku commit mesajını kontrol etmek için kullanacağız. Ve gerekirse commit mesajını değiştireceğiz.


## Hook Klasörünü Oluşturma

Ana dizinde `hook` isimli bir klasör ve aşağıdaki şekildeki gibi hook dosyalarını oluşturun.

```bash
mkdir ~/hooks
cd ~/hooks

touch pre-commit
chmod +x pre-commit

touch commit-msg
chmod +x commit-msg
```

---

## Branch İsimlerini Kısıtlama

Branch isimlerini ISSUE-0000/feature-name diye kabul edeceğiz ancak `main`, `develop`, `release` gibi diğer branch isimlerini de göz önünde bulundurmalıyız. Bunun için aşağıdaki regexi kullanabiliriz.

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"
```

Bir de branch ismine ihtiyacımız var. Onu da aşağıdaki komutla elde edbiliyoruz.
```bash
git rev-parse --abbrev-ref HEAD
```

Bu kadar! Regex ve branch adımız var. "ISSUE-0000/feature-name" veya "develop" veya "main" veya "release" ile başlayan branch ismini kontrol edeceğiz. Kontrolümüz başarısız olursa, hata mesajımızı yazıp `exit code 1` ile çıkacağız.

`pre-commit`
```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"

ISSUE_ID_IN_BRANCH=$(echo $(git rev-parse --abbrev-ref HEAD) | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_BRANCH" ]]; then
    echo "[pre-commit-hook] Your branch name is illegal. Please rename your branch with using following regex: $REGEX_ISSUE_ID"
    exit 1
fi
```

---

## Commit Mesajlarını Kısıtlama


Adımlar önceki adıma çok benziyor. Ama commit mesajında Jira issue id yoksa, branch adına bakıp oradan almaya çalışacağız. Branch adında da bulamazsak hata fırlatacağız.

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
```

İlk argüman `$1` bize commit-msg dosyası veriyor. Aşağıdaki komutla commit mesajını okuyabiliriz:
```bash
cat "$1"
```

Regex ve commit mesajımız var ve son adımdan branch adını nasıl alacağımızı biliyoruz. "ISSUE-0000" veya "Merge" veya "hotfix" ile başlayan commit mesajı olup olmadığını kontrol edeceğiz.

Commit mesajı kontrolü başarısız olursa, branch adını kontrol edeceğiz ve issue id'yi ayrıştıracağız ve commit mesajına ekleyeceğiz.

Kontrolümüz tekrar başarısız olursa, hata mesajımızı yazıp `exit code 1` ile çıkacağız.

`commit-msg`
```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
ISSUE_ID_IN_COMMIT=$(echo $(cat "$1") | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_COMMIT" ]]; then
    BRANCH_NAME=$(git symbolic-ref --short HEAD)
    ISSUE_ID=$(echo "$BRANCH_NAME" | grep -o -E "$REGEX_ISSUE_ID")

    if [[ -z "$ISSUE_ID" ]]; then
        echo "[commit-msg-hook] Your commit message is illegal. Please rename your branch with using following regex: $REGEX_ISSUE_ID"
        exit 1
    fi

    echo "$ISSUE_ID | $(cat "$1")" > "$1"
fi
```

---

## Kullanım

Proje klasörüne gidin ve hookları kullanmak için aşağıdaki komutu çalıştırın. Hook kullanmak istediğiniz her proje için bunu yapmanız gerekir.
```bash
cd <your-team-repository>
git config core.hooksPath ~/hooks
```

---

## Takım Arkadaşlarınızla Paylaşma

`~/hooks` klasörünüzü paylaşmanız gerekiyor. Bir git deposu oluşturup oradan paylaşabilirsiniz veya klasörü doğrudan ekibinize gönderebilirsiniz.