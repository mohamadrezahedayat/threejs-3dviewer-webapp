<?php
$serverName = "DESKTOP-PCTBI5R"; 
$connectionInfo = array( "Database"=>"VaultViewer_DB");
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn ) {
     // echo "Connected succsessfully.<br />";
}else{
     echo "Connection could not be established.<br />";
     die( print_r( sqlsrv_errors(), true));
}
$ItemName = "/".$_GET['Item'];
$sql = "SELECT * FROM Datatools where ItemName=? ";
$params = array($ItemName );
$stmt = sqlsrv_query( $conn, $sql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

if( sqlsrv_fetch( $stmt ) === false) {
     die( print_r( sqlsrv_errors(), true));
}

$ItemName = sqlsrv_get_field( $stmt,1);
echo "ItemName: ".$ItemName ;

$DocumentTitle = sqlsrv_get_field( $stmt, 2);
echo "          DocumentTitle: ".$DocumentTitle;
$TransmitalNumber = sqlsrv_get_field( $stmt, 3);
echo "          TransmitalNumber: ".$TransmitalNumber;
$POI = sqlsrv_get_field( $stmt, 4);
echo "          POI: ".$POI;
$DocumentNumber = sqlsrv_get_field( $stmt, 6);
echo "          DocumentNumber: ".$DocumentNumber;
