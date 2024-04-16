FROM python:3.11-bookworm
RUN apt update -y
RUN apt-get install -y python3 python3-pip python3-venv
RUN apt-get install -y postgresql-client

WORKDIR /code
COPY requirements.txt .
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install -r requirements.txt
RUN pip3 install pylint autopep8
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV POSTGRES_USER django_postgres

ENV TZ=Australia/Sydney
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN echo 'alias psqlx="psql -h localhost --username=$POSTGRES_USER $POSTGRES_NAME"' >> ~/.bashrc

COPY . /code