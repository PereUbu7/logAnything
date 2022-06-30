<?php
ini_set('display_errors', 1);
require 'databaseCommunication.php';

$settings = parse_ini_file("appsettings.ini", true);

$db = new DatabaseConnection;
$db->Connect($settings["database"]["path"]);

$argumentFound = false;

if( $_SERVER["REQUEST_METHOD"] == "GET" )
{
	if( !empty($_GET["log"]))
	{
		if( !empty($_GET["key"]) &&
			!empty($_GET["value"]))
			{
				echo json_encode($db->InsertLogPost($_GET["key"], $_GET["value"]));
				$argumentFound = true;
			}
	}
	else if( !empty($_GET["key"]) )
	{
		echo json_encode($db->GetValuesByKey($_GET["key"]));
		$argumentFound = true;
	}
	else if( !empty($_GET["keys"]) )
	{
		echo json_encode($db->GetAllKeys());
		$argumentFound = true;
	}
	else if( !empty($_GET["delete"]) )
	{
		$db->Delete($_GET["delete"]);
		echo $_GET["delete"];
		$argumentFound = true;
	}
}

if(!$argumentFound)
{
	echo "<h1>Available methods:</h1><ul>";
	echo "<li>log=true: key=\"\", value=\"\"</li>";
	echo "<li>key=\"\"</li>";
	echo "<li>keys=true</li>";
	echo "</ul>";
}
?>
