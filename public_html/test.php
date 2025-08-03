<?php
echo "PHP is working!";
echo "<br>Current directory: " . __DIR__;
echo "<br>Parent directory: " . dirname(__DIR__);
echo "<br>Vendor autoload exists: " . (file_exists(dirname(__DIR__) . '/vendor/autoload_runtime.php') ? 'Yes' : 'No');
?>