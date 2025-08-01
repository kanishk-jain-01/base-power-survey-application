#!/bin/bash
# Set the CA bundle path before starting Node.js
export NODE_EXTRA_CA_CERTS="$PWD/rds-ca-bundle.pem"
exec "$@"