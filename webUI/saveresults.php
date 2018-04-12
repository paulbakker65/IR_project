<?php
$json = $_POST['json'];
$filename = './result/results.json';
$myfile = fopen($filename,'a') or die("unable 2 open file");
fwrite($myfile, $json . "\n");
if (is_writable($filename)) {
	echo 'data = saved';
} else {
    echo 'Please chmod 777 to /result/ folder';
}
fclose($myfile);
?>