---
title: 'How to Use Apache Airflow'
date: '2022-03-16'
spoiler: 'Basic introduction to Apache Airflow.'
---

## What is Apache Airflow

Airflow is an orchestration tool that ensures that tasks are running at the right time, in the correct order, and in the right way.

### Why You Need Apache Airflow

![ETL](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m9803a05zin2dg81g3gs.png) 

Imagine you have a data pipeline like the one above.

- What if an error occurs in any of these stages? There may be an error in the API from which you are pulling the data, there may be an error while processing the data, or there may be an error while saving to the DB.
- If you have a lot of data pipelines like this, it will eventually become overwhelming.

Roughly, as in the example above, taking the data from a source and saving it to the target after certain operations are called ETL (Extract Transform Load). Such transactions can be managed in an advanced way by using Airflow.

### Benefits of Apache Airflow

**Dynamic:** What can be done with Python also can be done with Airflow. As a result, Airflow provides tremendous dynamics when creating our tasks.

**Scalable:** As many tasks as desired can be easily run in parallel.

**User Interface:** Airflow has a useful UI. Errors that occur in data pipelines and where they occur can be easily observed. Problematic tasks can be restarted etc.

**Extensible:** No need to wait for Airflow update when a new tool comes out. You can write your plugins and integrate them easily.

### Apache Airflow’s Core Components

![Airflow's Core Components](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zqxxkmass3ie637tzjvd.png) 

**Web Server:** A Flask server that serves the UI.

**Scheduler:** The daemon that schedules the workflows. It is the most important component of Airflow.

**Metastore:** Database where metadata is stored.

**Executor:** Class that defines how tasks should work.

**Worker:** The process or sub-process executing the task.

### DAG (Directed Acyclic Graph)

A DAG (Directed Acyclic Graph) is the core concept of Airflow, collecting Tasks together, organized with dependencies and relationships to say how they should run.

![DAG](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mldbmor2s91ffb7ho5z5.png) 

- Example DAG above defines four Tasks - A, B, C, and D - and dictates the order in which they have to run, and which tasks depend on what others. It will also say how often to run the DAG - maybe “every 5 minutes starting tomorrow”, or “every day since January 1st, 2020”.
- The DAG itself doesn’t care about *what* is happening inside the tasks; it is merely concerned with *how* to execute them - the order to run them in, how many times to retry them, if they have timeouts, and so on.

**Basic DAG example**:

```python
with DAG("my_dag_name",
		start_date=datetime(2020, 1, 1),
    schedule_interval="@daily",
		catchup=False)as dag:
    op = DummyOperator(task_id="task")
```

### Operators

Operators are wrappers that cover the task. By default, there are many different types of operators and can be viewed at [this link](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/operators/index.html). In addition, [much more](https://airflow.apache.org/docs/apache-airflow-providers/operators-and-hooks-ref/index.html) can be added as needed.

1. **Action Operators:** Operators which executes functions or commands eg. `bash scripts`, `python code`
2. **Transfer Operators:** Operators for moving data from source to destination eg. `ElasticSearch to Mysql`
3. **Sensor Operators:** Operators which wait for something to happen before moving on to another task, eg. checking the file in the directory and continuing to the other task after that.

### What Isn’t Airflow?

Airflow is not a data streaming solution or data processing framework. If you need to process data every second, instead of using Airflow, Spark or Flink would be a better solution. If terabytes of data are being processed, it is recommended to run the Spark job with the operator in Airflow.

## Apache Airflow Setup

Although Airflow can be installed with Docker, Kubernetes or different methods, in this article, we will install it locally.

```python
# Airflow needs a home. `~/airflow` is the default, but you can put it
# somewhere else if you prefer (optional)
export AIRFLOW_HOME=~/airflow

# Install Airflow using the constraints file. For this example, we will use Python 3.6 and Airflow 2.2.4
pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.2.4/constraints-3.6.txt"

# The Standalone command will initialize the database, make a user,
# and start all components for you.
airflow standalone

# Visit localhost:8080 in the browser and use the admin account details
# shown on the terminal to login.
# Enable the example_bash_operator dag on the home page
```

## First Pipeline with Apache Airflow

![Pipeline](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l4of3ly2k0c3zaqi00o9.png)
 
For example, let's create a data pipeline like the one in the figure using Airflow. For this, let's create a new python file in `~/airflow/dags` directory eg: `user_processing.py`

### 1. Importing Modules

```python

from datetime import datetime
import json
from pandas import json_normalize

# DAG object; We will need this to create DAG
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

We’ll need a DAG object to nest our tasks into. Here we pass a string that defines the `dag_id`, which serves as a unique identifier for your DAG. We also pass a default argument dictionary and define a `schedule_interval` of 1 day for the DAG.

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

We can use `SqliteOperator` for this task. But `SqliteOperator` will need a parameter named `conn_id`, so first let's create a connection for SQLite DB.

In Airflow, connections are kept in the metadata database. We will need to do the same for the `HTTPOperator`.

We can use UI to create a connection

1. Go to [http://localhost:8080/connection/add](http://localhost:8080/connection/add) (**Admin / Connections / +**)
2. Type `Conn Id` field a unique name e.g.: `db_sqlite`
3. Select `Conn Type` field as `SQLite`
4. In the `Host` field, type the path to the SQLite database file. In this example, we can use Airflow's metadata database instead of creating a new SQLite database file. `/home/airflow/airflow.db`
5. Save

After this process, we can create the operator. Each operator must have a unique `task_id`. SqliteOperator also has `sqlite_conn_id` and `sql` parameters. We will use the `db_sqlite` as the sqlite_conn_id (see step 2).

In SQL code; if the `users` table does not already exist; It creates a `users` table with fields `firstname`, `lastname`, `country`, `username`, `password` and `email`.

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

### 4. Verify API

We can add a sensor to check if there is a problem with the API by making an HTTP request. `HttpSensor` will be useful for this, but `HttpSensor` needs `http_conn_id` parameter. So we have to create a new connection as we did in the previous step. Unlike before, this time we will create a connection with `HTTP` type, not an `SQLite` type.

We can use UI to create a connection

1. Go to [http://localhost:8080/connection/add](http://localhost:8080/connection/add) (**Admin / Connections / +**)
2. Type `Conn Id` field a unique name e.g.: `user_api`
3. Select `Conn Type` field as `HTTP`
4. In the `Host` field, enter the address of the API that brings random users. eg. [https://randomuser.me/](https://randomuser.me/)
5. Save

Now we can create the sensor. Since the API we use works at `[https://randomuser.me/api/](https://randomuser.me/api)`, we used `api/` in the endpoint parameter.

```python
is_api_available = HttpSensor(
        task_id='is_api_available',
        http_conn_id='user_api',
        endpoint='api/'
    )
```

### 5. Retrieve Random Users from API

With using `SimpleHttpOperator` we send a `GET` HTTP request to the `user_api` connection we created before. With `response_filter` we convert the JSON string in the `response.text` field into a python object.

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

With using `PythonOperator`, we will keep only the desired fields of the python object that we obtained in step 5. And we will save the result as csv file.

Any python function can be run directly with the `python_callable` parameter.

The important part here is how we will get the response from the previous section. For this, we can send the `task instance (ti)` object as a parameter to the python function and get the results of the `task_ids` with `users = ti.xcom_pull(task_ids=['extracting_user'])`.

```python
processing_user = PythonOperator(
        task_id='processing_user',
        python_callable=_processing_user
    )

# Somewhere outside the scope of DAG
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

### 7. Saving Processed Users to SQLite DB

We can use `BashOperator` for trying new operators. `BashOperator` allows us to run bash commands.

```python
storing_user = BashOperator(
        task_id='storing_user',
        bash_command='echo -e ".separator ","\n.import /tmp/processed_user.csv users" | sqlite3 /home/airflow/airflow/airflow.db'
    )
```

### 8. Relationship Between Tasks

Simply, the direction of the tasks and their connection with each other can be defined as follows.

```python
# Somewhere outside the scope of DAG
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

To understand the concept, we have defined a simple and parallelism-free data pipeline. Much more complex, parallel tasks also can be created using Airflow. Thank you for reading!

## Screenshots

<details>
<summary markdown="span">Show Screenshots</summary>

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

## References

- [The Complete Hands-On Introduction to Apache Airflow by Marc Lamberti](https://www.udemy.com/course/the-complete-hands-on-course-to-master-apache-airflow/)
- [Apache Airflow Docs](https://airflow.apache.org/docs/)
