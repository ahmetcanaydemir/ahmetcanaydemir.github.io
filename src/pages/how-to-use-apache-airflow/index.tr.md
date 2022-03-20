---
title: 'Apache Airflow Nasıl Kullanılır'
date: '2022-03-16'
spoiler: 'Apache Airflow nedir ve nasıl kullanılır.'
---

## Apache Airflow Nedir

Airflow; taskları doğru zamanda, doğru sırayla ve doğru bir şekilde çalıştırmayı sağlayan bir orkestrasyon aracıdır.

### Apache Airflow’a Neden İhtiyaç Var

![ETL](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m9803a05zin2dg81g3gs.png) 

Yukarıdaki gibi bir data pipelinea sahip olduğunuzu hayal edin.

- Bu aşamaların herhangi birinde hata oluşursa ne olacak? Veriyi çektiğiniz API’da hata olabilir, veriyi işleme sırasında hata olabilir veya DB’ye kayıt sırasında bir hata olabilir.
- Buna benzer bir sürü data pipelinea sahipseniz eninde sonunda işin içinden çıkılmaz bir hal alacaktır.

Kabaca, yukarıdaki örnekteki gibi verinin bir kaynaktan alınıp belirli işlemlerden geçirildikten sonra hedefe kaydedilmesi işlemlerine ETL(Extract Transform Load) denir. Airflow kullanılarak bu gibi işlemler gelişmiş bir şekilde yönetilebilirler.

### Apache Airflow’un Faydaları

**Dinamik:** Python ile ne yapılabiliyorsa airflow ile de yapılabiliyor bu da tasklarımızı oluştururken muazzam bir dinamiklik sağlıyor.

**Ölçeklendirilebilir:** İstenilen kadar task kolayca paralel çalıştırılabiliyor.

**Kullanıcı Arayüzü:** Kullanışlı bir UI’a sahip. Data pipelinelarda oluşan hatalar ve nerede oluştuğu kolayca gözlemlenebiliyor. Hata alan tasklar yeniden başlatlabiliyor.

**Genişletilebilir:** Yeni bir araç çıktığında Airflow’un güncellenmesini beklemek gerekmiyor. Kendi eklentilerinizi yazıp kolayca entegre edebiliyorsunuz.

### Airflow Temel Bileşenleri

![Airflow's Core Components](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zqxxkmass3ie637tzjvd.png) 

**Web Server:** Flask sunucusu UI’ı serve ediyor.

**Scheduler:** Workflowları schecudle eden deamon. Airflow’un en önemli componentidir.

**Metastore:** Metadata’nın saklandığı veritabanı.

**Executor:** Taskların nasıl çalışması gerektiğinin tanımlandığı sınıf.

**Worker:** Taskı execute eden process veya sub proccess

### DAG (Directed Acyclic Graph)

DAG Airflow’un temel konseptidir. Taskları, bağımlılık ve ilişkileri ile bir araya getirip nasıl çalışmalarını söyler.

![DAG](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mldbmor2s91ffb7ho5z5.png) 

- Örnekteki DAG, dört task tanımlar (A, B, C ve D) ve hangi taskların yürütülmesi gerektiğini, hangi görevlerin diğerlerine bağlı olduğunu belirtir. Ayrıca ne sıklıkta çalıştırılacağını da söyler - örneğin "yarından itibaren her 5 dakikada bir" veya "1 Ocak 2020'den itibaren her gün".
- DAG, görevlerin içinde neler olduğuyla ilgilenmez; yalnızca bunların nasıl yürütüleceğiyle - çalıştırma sırası, kaç kez yeniden deneneceği, zaman aşımları vs. ile ilgilenir.

**Örnek bir DAG tanımı**

```python
with DAG("my_dag_name",
		start_date=datetime(2020, 1, 1),
    schedule_interval="@daily",
		catchup=False)as dag:
    op = DummyOperator(task_id="task")
```

### Operator

Operator taskı kapsayan bir wrapperdır. Varsayılan olarak farklı tipte birçok operator bulunur ve [bu bağlantıdan](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/index.html) incelenebilir. Ayrca [çok daha fazlası](https://airflow.apache.org/docs/apache-airflow-providers/operators-and-hooks-ref/index.html) da ihtiyaca göre eklenebilir.

1. **Action Operators:** Fonksyionları veya komutları execute ettiğimiz operatorler örn: `bash scriptleri`, `python kodu`
2. **Transfer Operators:** Kaynaktan hedefe veri taşımaya yarayan operatorler örn: `ElasticSearch to Mysql`
3. **Sensor Operators:** Başka bir işleme geçmeden önce bir şeyin olmasını beklemek için kullanılan operatorler örn: bir dizinde dosya var mı diye bekleyip, varsa diğer taska geçmek.

### Apache Airflow ne değildir?

Airflow data streaming çözümü veya data processing frameworkü değildir. Eğer her saniye veri işlemeniz gerekiyorsa Airflow kullanmak yerine Spark veya Flink daha doğru bir çözüm olacaktır. Eğer terabaytlarca veri işleniyorsa yine Airflow üzerinden operator ile Spark job’ı çalıştırılması tavsiye edilir.

## Airflow Kurulumu

Airflow docker, kubernetes veya farklı yöntemlerle kurulabilse de bu yazımda en basit şekliyle standalone kurulum yapabiliriz.

```python
# Airflow bir home dizinine ihtiyaç duyar. Varsayılan dizin `~/airflow` ama isteğe bağlı olarak değiştirilebilir.
export AIRFLOW_HOME=~/airflow

# Uygun constraint dosyasının bağlantısı ile airflow'u kurun. Bu örnekte Python 3.6 için Airflow 2.2.4 kurulumu yapıyoruz.
pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.2.4/constraints-3.6.txt"

# Aşağıdaki komut sizin için veritabanı oluşturacak, bir kullanıcı oluşturacak ve gerekli tüm bileşenleri başlatacak.
airflow standalone

# Tarayıcınızdan localhost:8080 adresini ziyaret edin
# ve terminaldeki admin kullanıcı adı ve şifresini kullanarak giriş yapın.
# Çalıştığından emin olmak için anasayfadaki `example_bash_operator` isimli örnek DAG'ı etkinleştirebilirsiniz.
```

## Apache Airflow ile İlk Pipeline

![Pipeline](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l4of3ly2k0c3zaqi00o9.png)

Örneğin şekildeki gibi bir data pipelineı airflow kullanarak oluşturalım. Bunun için `~/airflow/dags` dizinine yeni bir python dosyası oluşturalım örn: `user_processing.py`

### 1. Modullerin Import Edilmesi

```python

from datetime import datetime
import json
from pandas import json_normalize

# DAG nesnesi; DAG oluşturmak için buna ihtiyacmız olacak
from airflow import DAG

# Operatorler
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.providers.sqlite.operators.sqlite import SqliteOperator
from airflow.providers.http.operators.http import SimpleHttpOperator

# Sensorler
from airflow.providers.http.sensors.http import HttpSensor
```

### 2. DAG Nesnesini Oluşturma

Tasklarımızı tanımlamak için bir DAG nesnesine ihtiyacımız olacak. DAG için benzersiz bir tanımlayıcı olan dag_id için bir değer giriyoruz örneğin `user_processing`. Varsayılan argümanları ve taskın çalışacağı zamanlama aralığını belirtiyoruz.

```python
default_args = {
    'start_date': datetime(2020, 1, 1)
}

with DAG('user_processing', schedule_interval='@daily',
        default_args=default_args,
        catchup=False) as dag:

        # Define tasks/operators
```

### 3. SQLite Tablosunu Oluşturma

Bu task için `SqliteOperator` kulanabiliriz. Fakat `SqliteOperator` bizden conn_id isimli bir parametre isteyecek bu yüzden öncelikle SQLite DB için connection oluşturalım.

Airflow’da connectionlar için metadata veritabanında tutulur böylece sadece conn_id kullanırız ve kod tekrarı da olmaz. Aynı işlemi HTTPOperator’u için de yapmamız gerekecek.

Connection oluşturmak için UI’ı kullanabiliriz 

1. [http://localhost:8080/connection/add](http://localhost:8080/connection/add) bağlantısına gidin (**Admin / Connections / +**)
2. `Conn Id` alanına benzersiz bir isim verin örn: `db_sqlite`
3. `Conn Type` alanında `SQLite` seçin
4. `Host` alanına SQLite veritabanı dosyasının yolunu yazın. Bu örnekte yeni bir SQLite veritabanı dosyası oluşturmak yerine Airflow’un metadata veritabanını kullanabiliriz. `/home/airflow/airflow.db`
5. Kaydedin

Bu işlemden sonra operator’ü oluşturabiliriz. Her operator benzersiz bir `task_id`’ye sahip olmalıdır. SqliteOperator ayrıca `sqlite_conn_id` ve `sql` parametrelerine de sahip. `sqlite_conn_id` olarak az önce oluşturduğumuz `db_sqlite`'ı kullanacağız.

SQL kodu eğer zaten `users` tablosu yoksa; `firstname`, `lastname`, `country`, `username`, `password` ve `email` alanlarına sahip bir `users` tablosu oluşturuyor. 

```python
 creating_table = SqliteOperator(
        task_id='creating_table',
        sqlite_conn_id='db_sqlite',
        sql='''
            CREATE TABLE IF NOT EXISTS users (
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                country TEXT NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT NOT NULL PRIMARY KEY
            );
        ''' 
    )
```

### 4. API Kontrolü

HTTP isteği atarak API’da bir sorun var mı yok mu diye kontrol etmek için bir sensor ekleyebiliriz. Bunun için `HttpSensor` kullanışlı olacaktır fakat `HttpSensor`, `http_conn_id` parametresine ihtiyaç duyuyor. Bu yüzden bir önceki adımda yaptığımız gibi yeni bir connection oluşturmalıyız. Öncekinden farklı olarak bu kez `SQLite` tipinde değil `HTTP` tipinde bir connection oluşturacağız.

Connection oluşturmak için UI’ı kullanabiliriz 

1. [http://localhost:8080/connection/add](http://localhost:8080/connection/add) bağlantısına gidin (**Admin / Connections / +**)
2. `Conn Id` alanına benzersiz bir isim verin örn: `user_api`
3. `Conn Type` alanında `HTTP` seçin
4. `Host` alanına rastgele kullanıcı getiren API’ın adresini girin. örn [`https://randomuser.me/`](https://randomuser.me/api)
5. Kaydedin

Artık sensoru oluşturabiliriz. Bizim kullandığımız API [`https://randomuser.me/api/`](https://randomuser.me/api) adresinde çalıştığı için endpoint parametresinde `api/` yazıyor

```python
is_api_available = HttpSensor(
        task_id='is_api_available',
        http_conn_id='user_api',
        endpoint='api/'
    )
```

### 5. API’dan Rastgele Kullanıcı Getirme

`SimpleHttpOperator` kullanarak daha önce oluşturduğumuz `user_api` connectionına `GET` HTTP isteği gönderiyoruz. `response_filter` ile `response.text` alanındaki json stringini python objesine çeviriyoruz.

```python
 extracting_user = SimpleHttpOperator(
        task_id='extracting_user',
        http_conn_id='user_api',
        endpoint='api/',
        method='GET',
        response_filter=lambda response: json.loads(response.text),
        log_response=True
    )
```

### 6. API Sonucunu İşleme

`PythonOperator` kullanarak 5. adımda elde ettiğimiz python objesinin sadece istediğimiz alanlarını csv dosyasına kaydedeceğiz.

`python_callable` parametresi ile doğrudana python methodu çalıştırılabilir.

Buradaki önemli kısım bir önceki bölümdeki response’u nasıl alacağımızdır. Bunun için `task instance (ti)` nesnesini parametre olarak python fonksiyonuna yazabiliriz ve `users = ti.xcom_pull(task_ids=['extracting_user'])` ile verdiğimiz `task_ids`lerin sonuçlarını elde edebiliriz.

```python
processing_user = PythonOperator(
        task_id='processing_user',
        python_callable=_processing_user
    )

# DAG kapsamının dışında bir yerde
def _processing_user(ti):
    users = ti.xcom_pull(task_ids=['extracting_user'])
    if not len(users) or 'results' not in users[0]:
        raise ValueError('User is empty')
    user = users[0]['results'][0]
    processed_user = json_normalize({
        'firstname': user['name']['first'],
        'lastname': user['name']['last'],
        'country': user['location']['country'],
        'username': user['login']['username'],
        'password': user['login']['password'],
        'email': user['email']
    })
    processed_user.to_csv('/tmp/processed_user.csv', index=None, header=False)
```

### 7. İşlenmiş Kullanıcıları SQLite DB’ye Kaydetme

Burada da farklılık olsun diye `BashOperator` kullanabiliriz. `BashOperator` bash komutları çalıştırmamızı sağlar.

```python
storing_user = BashOperator(
        task_id='storing_user',
        bash_command='echo -e ".separator ","\n.import /tmp/processed_user.csv users" | sqlite3 /home/airflow/airflow/airflow.db'
    )
```

### 8. Tasklar Arasındaki İlişki

Basitçe aşağıdaki şekilde taskların yönü ve birbirleri ile bağlantısını tanımlanabilir.

```python
# DAG kapsamının dışında bir yerde
creating_table >> is_api_available >> extracting_user >> processing_user >> storing_user
```

### Tamamlanmış DAG Dosyası

```python
from datetime import datetime
import json
from pandas import json_normalize

from airflow import DAG

from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.providers.sqlite.operators.sqlite import SqliteOperator
from airflow.providers.http.operators.http import SimpleHttpOperator
from airflow.providers.http.sensors.http import HttpSensor

default_args = {
    'start_date': datetime(2020, 1, 1)
}

def _processing_user(ti):
    users = ti.xcom_pull(task_ids=['extracting_user'])
    if not len(users) or 'results' not in users[0]:
        raise ValueError('User is empty')
    user = users[0]['results'][0]
    processed_user = json_normalize({
        'firstname': user['name']['first'],
        'lastname': user['name']['last'],
        'country': user['location']['country'],
        'username': user['login']['username'],
        'password': user['login']['password'],
        'email': user['email']
    })
    processed_user.to_csv('/tmp/processed_user.csv', index=None, header=False)
    

with DAG('user_processing', schedule_interval='@daily',
        default_args=default_args,
        catchup=False) as dag:
        # Define tasks/operators
        
    creating_table = SqliteOperator(
        task_id='creating_table',
        sqlite_conn_id='db_sqlite',
        sql='''
            CREATE TABLE IF NOT EXISTS users (
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                country TEXT NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT NOT NULL PRIMARY KEY
            );
        ''' 
    )
    
    is_api_available = HttpSensor(
        task_id='is_api_available',
        http_conn_id='user_api',
        endpoint='api/'
    )
    
    extracting_user = SimpleHttpOperator(
        task_id='extracting_user',
        http_conn_id='user_api',
        endpoint='api/',
        method='GET',
        response_filter=lambda response: json.loads(response.text),
        log_response=True
    )
    
    processing_user = PythonOperator(
        task_id='processing_user',
        python_callable=_processing_user
    )
    
    storing_user = BashOperator(
        task_id='storing_user',
        bash_command='echo -e ".separator ","\n.import /tmp/processed_user.csv users" | sqlite3 /home/airflow/airflow/airflow.db'
    )
    
creating_table >> is_api_available >> extracting_user >> processing_user >> storing_user
```

## Sonuç

Konsepti anlamak adına basit ve paralellik gerektirmeyen bir datapipeline tanımlamış olduk. Airflow kullanılarak çok daha kompleks, paralel tasklar oluşturulabilir. Okuduğunuz için teşekkürler!

## Ekran Görüntüleri

<details>
<summary markdown="span">Ekran Görüntülerini Göster</summary>

![Graph View](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a3a0r96acrkak6cfceck.png)
 
---

![Tree View](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gc2uehcap4a2azidlppc.png)

---

![Gantt](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j68phdyzzbll0wfx7q6q.png)
 
---

![Log](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5vjunmrg6fd6gq0gg5wi.png)

---

![Homepage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m6rb1hz3e4qs1pmdpc53.png)
</details>

## Kaynaklar

- [The Complete Hands-On Introduction to Apache Airflow by Marc Lamberti](https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/)
- [Apache Airflow Docs](https://airflow.apache.org/docs/)
