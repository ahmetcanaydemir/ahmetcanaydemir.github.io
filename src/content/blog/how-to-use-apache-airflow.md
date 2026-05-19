---
title: 'How to Use Apache Airflow'
date: '2022-03-16'
description: 'A basic introduction to Apache Airflow.'
---

## What Is Apache Airflow

Airflow is an orchestration tool that makes sure tasks run at the right time, in the correct order, and in the right way.

### Why You Need Apache Airflow

![ETL](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m9803a05zin2dg81g3gs.png)

Imagine you have a data pipeline like the one above.

- What if an error happens at any stage? The API you're pulling data from could fail, the data processing could fail, or saving to the database could fail.
- If you have a lot of data pipelines like this, it eventually becomes overwhelming to manage.

Roughly speaking, taking data from a source and saving it to a target after some processing is called ETL (Extract, Transform, Load). Airflow lets you manage this kind of work in a structured way.

### Benefits of Apache Airflow

**Dynamic:** Anything you can do in Python you can do in Airflow. That gives you a lot of flexibility when defining tasks.

**Scalable:** You can run as many tasks as you need in parallel.

**User Interface:** Airflow has a useful UI. You can spot errors in your pipelines, see exactly where they happen, and restart problematic tasks.

**Extensible:** You don't have to wait for an Airflow update when a new tool comes along — you can write your own plugins and integrate them.

### Apache Airflow's Core Components

![Airflow's core components](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zqxxkmass3ie637tzjvd.png)

**Web Server:** A Flask server that serves the UI.

**Scheduler:** The daemon that schedules workflows. It's the most important component of Airflow.

**Metastore:** The database where metadata is stored.

**Executor:** The class that defines how tasks should run.

**Worker:** The process (or sub-process) that actually executes a task.

### DAG (Directed Acyclic Graph)

A DAG is the core concept of Airflow. It collects tasks together and organizes them with dependencies and relationships that say how they should run.

![DAG](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mldbmor2s91ffb7ho5z5.png)

- The example DAG above defines four tasks — A, B, C, and D — and dictates the order in which they have to run and which tasks depend on which. It also says how often the DAG should run — maybe "every 5 minutes starting tomorrow", or "every day since January 1st, 2020".
- The DAG itself doesn't care about _what_ is happening inside the tasks; it's only concerned with _how_ to execute them — the order to run them in, how many retries, whether they have timeouts, and so on.

**Basic DAG example**:

```python
with DAG("my_dag_name",
    start_date=datetime(2020, 1, 1),
    schedule_interval="@daily",
    catchup=False) as dag:
    op = DummyOperator(task_id="task")
```

### Operators

Operators are wrappers around individual tasks. There are many different built-in operators, and you can browse them at [this link](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/index.html). You can also pull in [many more](https://airflow.apache.org/docs/apache-airflow-providers/operators-and-hooks-ref/index.html) as needed.

1. **Action operators:** run functions or commands, e.g. `bash scripts`, `python code`.
2. **Transfer operators:** move data from a source to a destination, e.g. `Elasticsearch to MySQL`.
3. **Sensor operators:** wait for something to happen before moving on to the next task — for example, watching a directory for a file and continuing once it appears.

### What Airflow Isn't

Airflow is not a data streaming solution or a data processing framework. If you need to process data every second, Spark or Flink is a better fit. If you're processing terabytes of data, the recommended approach is to run a Spark job through an Airflow operator.

## Apache Airflow Setup

Airflow can be installed with Docker, Kubernetes, or other methods, but in this article we'll install it locally:

```python
# Airflow needs a home. ~/airflow is the default, but you can put it
# somewhere else if you prefer (optional).
export AIRFLOW_HOME=~/airflow

# Install Airflow using the constraints file. For this example, we'll use Python 3.6 and Airflow 2.2.4.
pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.2.4/constraints-3.6.txt"

# The standalone command will initialize the database, create a user,
# and start all components for you.
airflow standalone

# Visit localhost:8080 in the browser and use the admin account details
# shown in the terminal to log in.
# Enable the example_bash_operator DAG on the home page.
```

## First Pipeline with Apache Airflow

![Pipeline](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l4of3ly2k0c3zaqi00o9.png)

Let's create a data pipeline like the one in the figure above using Airflow. Create a new Python file in the `~/airflow/dags` directory, e.g. `user_processing.py`.

### 1. Importing Modules

```python

from datetime import datetime
import json
from pandas import json_normalize

# DAG object — we'll need this to create the DAG.
from airflow import DAG

# Operators
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.providers.sqlite.operators.sqlite import SqliteOperator
from airflow.providers.http.operators.http import SimpleHttpOperator

# Sensors
from airflow.providers.http.sensors.http import HttpSensor
```

### 2. Instantiate a DAG

We need a DAG object to nest our tasks into. We pass a string that defines the `dag_id`, which serves as a unique identifier. We also pass a default arguments dictionary and define a `schedule_interval` of one day for the DAG.

```python
default_args = {
    'start_date': datetime(2020, 1, 1)
}

with DAG('user_processing', schedule_interval='@daily',
        default_args=default_args,
        catchup=False) as dag:

        # Define tasks/operators
```

### 3. Creating the SQLite Table

We can use `SqliteOperator` for this task. But it needs a `conn_id` parameter, so first we need to create a connection for the SQLite database.

In Airflow, connections are stored in the metadata database. We'll need to do the same for `HTTPOperator` later.

We can use the UI to create the connection:

1. Go to [http://localhost:8080/connection/add](http://localhost:8080/connection/add) (**Admin / Connections / +**).
2. Set `Conn Id` to a unique name, e.g. `db_sqlite`.
3. Set `Conn Type` to `SQLite`.
4. In the `Host` field, enter the path to the SQLite database file. In this example we'll reuse Airflow's metadata database instead of creating a new one: `/home/airflow/airflow.db`.
5. Save.

After that we can create the operator. Each operator must have a unique `task_id`. `SqliteOperator` also takes `sqlite_conn_id` and `sql` parameters. We use `db_sqlite` as the `sqlite_conn_id` (see step 2).

In SQL, if the `users` table does not already exist, it creates a `users` table with fields `firstname`, `lastname`, `country`, `username`, `password`, and `email`.

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

### 4. Verify the API

We can add a sensor to check whether the API is reachable by making an HTTP request. `HttpSensor` is a good fit, but it needs an `http_conn_id` parameter, so we have to create a new connection — this time of type `HTTP` rather than `SQLite`.

We can use the UI to create the connection:

1. Go to [http://localhost:8080/connection/add](http://localhost:8080/connection/add) (**Admin / Connections / +**).
2. Set `Conn Id` to a unique name, e.g. `user_api`.
3. Set `Conn Type` to `HTTP`.
4. In the `Host` field, enter the URL of the API that returns random users, e.g. [https://randomuser.me/](https://randomuser.me/).
5. Save.

Now we can create the sensor. Since the API we're using is at `[https://randomuser.me/api/](https://randomuser.me/api)`, we use `api/` as the endpoint:

```python
is_api_available = HttpSensor(
        task_id='is_api_available',
        http_conn_id='user_api',
        endpoint='api/'
    )
```

### 5. Retrieve Random Users from the API

Using `SimpleHttpOperator`, we send a `GET` request to the `user_api` connection we created earlier. With `response_filter` we convert the JSON string in `response.text` into a Python object.

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

### 6. Processing the API Result

Using `PythonOperator`, we'll keep only the fields we want from the Python object we got in step 5 and save the result as a CSV file.

Any Python function can be run directly through the `python_callable` parameter.

The important part here is how we get the response from the previous task. We can pass the `task instance (ti)` object as a parameter to our Python function and pull the result of a previous task with `users = ti.xcom_pull(task_ids=['extracting_user'])`.

```python
processing_user = PythonOperator(
        task_id='processing_user',
        python_callable=_processing_user
    )

# Somewhere outside the scope of the DAG
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

### 7. Saving Processed Users to the SQLite DB

We can use `BashOperator` here to try out another operator type. `BashOperator` lets us run shell commands.

```python
storing_user = BashOperator(
        task_id='storing_user',
        bash_command='echo -e ".separator ","\n.import /tmp/processed_user.csv users" | sqlite3 /home/airflow/airflow/airflow.db'
    )
```

### 8. Defining Relationships Between Tasks

The order of the tasks and how they connect to each other can be defined like this:

```python
# Somewhere outside the scope of the DAG
creating_table >> is_api_available >> extracting_user >> processing_user >> storing_user
```

### Final DAG File

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

## Conclusion

To keep things simple, we defined a basic, non-parallel data pipeline. You can build much more complex pipelines with parallel tasks using Airflow. Thanks for reading.

## Screenshots

<details>
<summary markdown="span">Show Screenshots</summary>

![Graph view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a3a0r96acrkak6cfceck.png)

---

![Tree view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gc2uehcap4a2azidlppc.png)

---

![Gantt](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j68phdyzzbll0wfx7q6q.png)

---

![Log](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5vjunmrg6fd6gq0gg5wi.png)

---

![Homepage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m6rb1hz3e4qs1pmdpc53.png)

</details>

## References

- [The Complete Hands-On Introduction to Apache Airflow by Marc Lamberti](https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/)
- [Apache Airflow Docs](https://airflow.apache.org/docs/)
