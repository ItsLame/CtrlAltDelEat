FROM debian:bookworm
RUN apt update -y
RUN apt-get install -y python3 python3-pip python3-venv
RUN apt-get install -y postgresql-client

# WORKDIR /workspaces
WORKDIR /code
COPY ./backend/requirements.txt .
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install -r requirements.txt


COPY . /code
