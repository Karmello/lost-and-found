openssl genrsa -des3 -out certs/rootCA.key 2048
openssl req -x509 -new -nodes -key certs/rootCA.key -sha256 -days 1024 -out certs/rootCA.pem