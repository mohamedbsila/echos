#!/bin/bash

echo "Fixing file permissions for Hostinger hosting..."

# Set proper permissions for directories
find . -type d -exec chmod 755 {} \;

# Set proper permissions for files
find . -type f -exec chmod 644 {} \;

# Make specific directories writable by web server
chmod 775 var/
chmod 775 var/cache/
chmod 775 var/log/
chmod 775 public/

# Make sure .htaccess files are readable
chmod 644 .htaccess
chmod 644 public/.htaccess
chmod 644 public_html/.htaccess

# Make sure index.php files are executable
chmod 755 public/index.php
chmod 755 public_html/index.php

echo "Permissions fixed!"
echo "Please upload these files to your Hostinger hosting:"
echo "1. All files from the root directory"
echo "2. Make sure the document root points to the public_html directory"
echo "3. Test your site at: https://yourdomain.com/test.php"