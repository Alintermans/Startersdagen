FROM python:3.11-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# build-essential + cmake zijn nodig om dlib te compileren (duurt ~10 min bij
# de eerste build, daarna zit het in de Docker layer cache). OpenBLAS/LAPACK
# maken dlib een stuk sneller.
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        cmake \
        libopenblas-dev \
        liblapack-dev \
        libglib2.0-0 \
        libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Wiskunde/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Wiskunde ./Wiskunde
COPY Startpagina ./Startpagina
COPY wsgi.py .

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python -c "import os,urllib.request;urllib.request.urlopen('http://127.0.0.1:'+os.environ.get('PORT','3000')+'/')" || exit 1

# --preload: laad de dlib-modellen één keer vóór het forken van de workers.
CMD gunicorn --preload --workers ${WEB_CONCURRENCY:-2} --threads 4 --timeout 120 --bind 0.0.0.0:${PORT:-3000} wsgi:app
