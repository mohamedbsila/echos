# Hostinger Setup Guide

## Problem: 403 Forbidden Error

The 403 Forbidden error on Hostinger is caused by:
1. Incorrect document root configuration
2. File permission issues
3. Missing .htaccess configuration

## Solution Steps

### 1. File Structure
Your Symfony application should be deployed with this structure:
```
public_html/          # Document root (web accessible)
├── .htaccess        # Main rewrite rules
├── index.php        # Symfony bootstrap
├── test.php         # Test file
└── public/          # Symfony public directory
    ├── .htaccess    # Public directory rules
    ├── index.php    # Symfony front controller
    ├── css/
    ├── js/
    ├── img/
    └── music/
```

### 2. Upload Files
1. Upload ALL files from your project to the `public_html` directory on Hostinger
2. Make sure the document root points to `public_html` (not `public_html/public`)

### 3. Fix Permissions
Run the permission fix script:
```bash
./fix-permissions.sh
```

Or manually set permissions:
```bash
# Directories
find . -type d -exec chmod 755 {} \;

# Files
find . -type f -exec chmod 644 {} \;

# Writable directories
chmod 775 var/
chmod 775 var/cache/
chmod 775 var/log/
chmod 775 public/

# Important files
chmod 644 .htaccess
chmod 644 public/.htaccess
chmod 644 public_html/.htaccess
chmod 755 public/index.php
chmod 755 public_html/index.php
```

### 4. Environment Configuration
1. Create `.env.local` file with production settings:
```env
APP_ENV=prod
APP_DEBUG=false
APP_SECRET=your_secret_here
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

### 5. Test Your Setup
1. Visit: `https://yourdomain.com/test.php`
   - Should show "PHP is working!"
2. Visit: `https://yourdomain.com/`
   - Should load your Symfony application

### 6. Troubleshooting

#### Still getting 403 error?
1. Check Hostinger's error logs
2. Verify document root is set to `public_html`
3. Ensure `.htaccess` files are uploaded
4. Check file permissions (755 for directories, 644 for files)

#### Database connection issues?
1. Update `DATABASE_URL` in `.env.local`
2. Make sure database credentials are correct
3. Check if Hostinger allows external database connections

#### Cache issues?
1. Clear Symfony cache: `php bin/console cache:clear`
2. Make sure `var/cache` directory is writable
3. Check `var/log` directory permissions

### 7. Security Notes
- The `var` directory should have permissions `775` (not `777`)
- Keep `.env.local` file secure and don't commit it to version control
- Regularly update your application and dependencies

### 8. Performance Optimization
- Enable OPcache in Hostinger's PHP settings
- Use Hostinger's CDN for static assets
- Consider using Hostinger's Redis cache if available

## Support
If you still encounter issues:
1. Check Hostinger's error logs
2. Contact Hostinger support with specific error messages
3. Verify your hosting plan supports PHP applications