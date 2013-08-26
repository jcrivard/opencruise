<?php
header('Access-Control-Allow-Origin: http://' . $_SERVER['SERVER_NAME']); //to enable SSL call from non-SSL page
require_once("./phpmailer/PHPMailer_v5.1/class.phpmailer.php");
//ini_set('display_errors', 1);
//error_reporting(E_ALL);
function smtpmailer($to, $from, $from_name, $subject, $body, $csv, $cruisename, $pw) { 
    global $response;
    $mail = new PHPMailer();  // create a new object
    $mail->IsSMTP(); // enable SMTP
    $mail->SMTPDebug = 0;  // debugging: 1 = errors and messages, 2 = messages only
    $mail->SMTPAuth = true;  // authentication enabled
    $mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for GMail
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 465; 
    $mail->Username = $from;  
    $mail->Password = $pw;           
    $mail->SetFrom($from, $from_name);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->AddAddress($to);
    $mail->AddStringAttachment($csv, $cruisename . '.csv', 'base64', 'text/csv');
    if(!$mail->Send()) {
        $response = 'Mail error: '.$mail->ErrorInfo; 
        return false;
    } else {
        $response = 'Message sent from OpenCruise!';
        return true;
    }
}
smtpmailer($_POST["emailTo"], $_POST["emailTo"], 'Open Cruise', "Forest Inventory Data for " . $_POST["cruiseName"], 'Cruise Data', $_POST["data"], $_POST["cruiseName"], $_POST["emailPW"]);

echo $response;
?>