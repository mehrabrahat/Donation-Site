<?php

$store_id = "your_store_id";
$store_passwd = "your_store_password";

$sslcz_api_url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
// For live:
// $sslcz_api_url = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

$post_data = array(
    'store_id' => $store_id,
    'store_passwd' => $store_passwd,
    'total_amount' => $_POST['amount'],
    'currency' => "BDT",
    'tran_id' => uniqid("DON_"),

    'success_url' => "https://yourdomain.com/success.php",
    'fail_url' => "https://yourdomain.com/fail.php",
    'cancel_url' => "https://yourdomain.com/cancel.php",

    'cus_name' => $_POST['cus_name'],
    'cus_email' => $_POST['cus_email'],
    'cus_add1' => "N/A",
    'cus_city' => "N/A",
    'cus_country' => "Bangladesh",
    'cus_phone' => "00000000",

    'shipping_method' => "NO",
    'product_name' => $_POST['cause'],
    'product_category' => "Donation",
    'product_profile' => "non-physical-goods"
);

$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, $sslcz_api_url);
curl_setopt($handle, CURLOPT_TIMEOUT, 30);
curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
curl_setopt($handle, CURLOPT_POST, 1);
curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

$content = curl_exec($handle);
$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

if ($code == 200 && !(curl_errno($handle))) {
    $response = json_decode($content, true);
    echo json_encode($response);
} else {
    echo json_encode(["error" => "Failed to connect SSLCOMMERZ"]);
}
?>
