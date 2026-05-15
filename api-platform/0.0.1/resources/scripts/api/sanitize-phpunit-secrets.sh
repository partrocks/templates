#!/bin/sh
set -e

# Symfony Flex (lexik/jwt-authentication-bundle recipe) injects a random hex
# JWT_PASSPHRASE into phpunit.xml.dist. Strip it so generated repos stay
# scanner-clean; developers set a real value via .env.local / .env.test.local.
echo "Sanitizing JWT_PASSPHRASE in phpunit.xml.dist..."
if [ -f phpunit.xml.dist ]; then
  sed -i 's/\(<env name="JWT_PASSPHRASE" value="\)[^"]*\(".*\)/\1\2/' phpunit.xml.dist
fi
